import { useEffect, useRef, useState } from "react";
import { Eraser, RotateCcw } from "lucide-react";

function DrawCanvas({
  mode = "digit",
  onFileReady,
  onClear,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getTitle = () => {
    if (mode === "digit") return "Draw a Digit";
    if (mode === "character") return "Draw a Character";
    if (mode === "word") return "Draw a Word";
    if (mode === "text") return "Draw Text";
    return "Draw a Digit";
  };

  const getDescription = () => {
    if (mode === "digit") {
      return "Write a single digit from 0 to 9.";
    }

    if (mode === "character") {
      return "Write a single handwritten character.";
    }

    if (mode === "word") {
      return "Write a handwritten word.";
    }

    if (mode === "text") {
      return "Write handwritten text.";
    }

    return "Write a single digit from 0 to 9.";
  };

  const getCanvasLabel = () => {
    if (mode === "digit") return "0 – 9";
    if (mode === "character") return "A – Z";
    if (mode === "word") return "WORD";
    if (mode === "text") return "TEXT";
    return "0 – 9";
  };

  const getFooterText = () => {
    if (mode === "digit") {
      return "Draw your digit inside the box";
    }

    if (mode === "character") {
      return "Draw your character inside the box";
    }

    if (mode === "word") {
      return "Draw your word inside the box";
    }

    if (mode === "text") {
      return "Draw your text inside the box";
    }

    return "Draw your digit inside the box";
  };

  const setupCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.strokeStyle = "#000000";

    // Digit = 12px
    // Character = 13px for clearer handwriting
    // Word/Text = 13px
    ctx.lineWidth = mode === "digit" ? 12 : 13;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.imageSmoothingEnabled = true;
  };

  useEffect(() => {
    setIsDrawing(false);

    const timer = setTimeout(() => {
      setupCanvas();
    }, 0);

    return () => clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [mode]);

  const getPosition = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Ignore pointer capture error
    }

    const { x, y } = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(x, y);

    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const { x, y } = getPosition(event);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  /*
   * Convert handwriting into a more MNIST-like image.
   *
   * Steps:
   * 1. Find handwritten area
   * 2. Crop empty background
   * 3. Add controlled padding
   * 4. Resize handwriting
   * 5. Put handwriting inside 28x28 canvas
   * 6. Calculate center of mass
   * 7. Move handwriting toward the center
   * 8. Export as PNG
   */
   
  const createCleanImageFile = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const data = ctx.getImageData(
      0, 0, canvas.width, canvas.height
    ).data;

    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

        if (brightness < 200) {
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (maxX === -1) return null;

    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;

    // MULTI-DIGIT: keep the full number image
    if (mode === "multi_digit") {
      const padding = Math.max(
        20,
        Math.round(Math.max(cropWidth, cropHeight) * 0.12)
      );

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = cropWidth + padding * 2;
      outputCanvas.height = cropHeight + padding * 2;

      const outputCtx = outputCanvas.getContext("2d");
      if (!outputCtx) return null;

      outputCtx.fillStyle = "#ffffff";
      outputCtx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);

      outputCtx.drawImage(
        canvas,
        minX, minY, cropWidth, cropHeight,
        padding, padding, cropWidth, cropHeight
      );

      setPreviewUrl(outputCanvas.toDataURL("image/png"));

      return new Promise((resolve) => {
        outputCanvas.toBlob((blob) => {
          if (!blob) return resolve(null);

          resolve(new File([blob], "multi-digit-handwriting.png", {
            type: "image/png",
          }));
        }, "image/png");
      });
    }

    // SINGLE DIGIT: keep 28x28 preprocessing
    const padding = Math.floor(
      Math.max(cropWidth, cropHeight) * 0.20
    );

    const paddedWidth = cropWidth + padding * 2;
    const paddedHeight = cropHeight + padding * 2;
    const squareSize = Math.max(paddedWidth, paddedHeight);

    const squareCanvas = document.createElement("canvas");
    squareCanvas.width = squareSize;
    squareCanvas.height = squareSize;

    const squareCtx = squareCanvas.getContext("2d");
    if (!squareCtx) return null;

    squareCtx.fillStyle = "#ffffff";
    squareCtx.fillRect(0, 0, squareSize, squareSize);

    squareCtx.drawImage(
      canvas,
      minX, minY, cropWidth, cropHeight,
      Math.floor((squareSize - cropWidth) / 2),
      Math.floor((squareSize - cropHeight) / 2),
      cropWidth, cropHeight
    );

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 28;
    finalCanvas.height = 28;

    const finalCtx = finalCanvas.getContext("2d");
    if (!finalCtx) return null;

    finalCtx.fillStyle = "#ffffff";
    finalCtx.fillRect(0, 0, 28, 28);
    finalCtx.imageSmoothingEnabled = true;

    // Resize to 20x20 and place in the 28x28 image
    const digitCanvas = document.createElement("canvas");
    digitCanvas.width = 20;
    digitCanvas.height = 20;

    const digitCtx = digitCanvas.getContext("2d");
    if (!digitCtx) return null;

    digitCtx.fillStyle = "#ffffff";
    digitCtx.fillRect(0, 0, 20, 20);
    digitCtx.imageSmoothingEnabled = true;

    digitCtx.drawImage(squareCanvas, 0, 0, 20, 20);
    finalCtx.drawImage(digitCanvas, 4, 4);

    // Center the digit
    const pixels = finalCtx.getImageData(0, 0, 28, 28).data;
    let totalWeight = 0;
    let weightedX = 0;
    let weightedY = 0;

    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        const i = (y * 28 + x) * 4;
        const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        const weight = Math.max(0, 255 - brightness);

        if (weight > 15) {
          totalWeight += weight;
          weightedX += x * weight;
          weightedY += y * weight;
        }
      }
    }

    if (totalWeight > 0) {
      const shiftX = Math.max(-3, Math.min(3,
        Math.round(13.5 - weightedX / totalWeight)
      ));
      const shiftY = Math.max(-3, Math.min(3,
        Math.round(13.5 - weightedY / totalWeight)
      ));

      if (shiftX !== 0 || shiftY !== 0) {
        const centered = document.createElement("canvas");
        centered.width = 28;
        centered.height = 28;

        const centeredCtx = centered.getContext("2d");
        if (centeredCtx) {
          centeredCtx.fillStyle = "#ffffff";
          centeredCtx.fillRect(0, 0, 28, 28);
          centeredCtx.drawImage(finalCanvas, shiftX, shiftY);

          finalCtx.fillStyle = "#ffffff";
          finalCtx.fillRect(0, 0, 28, 28);
          finalCtx.drawImage(centered, 0, 0);
        }
      }
    }

    setPreviewUrl(finalCanvas.toDataURL("image/png"));

    return new Promise((resolve) => {
      finalCanvas.toBlob((blob) => {
        if (!blob) return resolve(null);

        resolve(new File([blob], "digit-handwriting.png", {
          type: "image/png",
        }));
      }, "image/png");
    });
  };
  const stopDrawing = async () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const file =
      await createCleanImageFile();

    if (!file) return;

    if (onFileReady) {
      onFileReady(file, mode);
    }
  };

  const clearCanvas = () => {
    setIsDrawing(false);
    setPreviewUrl(null);

    setupCanvas();

    if (onClear) {
      onClear();
    }
  };

  const restartCanvas = () => {
    setIsDrawing(false);
    setPreviewUrl(null);

    setupCanvas();

    if (onClear) {
      onClear();
    }
  };

  return (
    <>
      <style>
        {`
          .ai-draw-panel {
            width: 100%;
            box-sizing: border-box;
            color: #f8fafc;
          }

          .ai-draw-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 18px;
          }

          .ai-draw-heading {
            min-width: 0;
          }

          .ai-draw-kicker {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 13px;
            color: #f59e0b;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 1.8px;
          }

          .ai-draw-kicker-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #f59e0b;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.75);
          }

          .ai-draw-title {
            margin: 0 0 9px;
            color: #f8fafc;
            font-size: 29px;
            line-height: 1.2;
            font-weight: 800;
            letter-spacing: -0.5px;
          }

          .ai-draw-description {
            margin: 0;
            color: #cbd5e1;
            font-size: 16px;
            line-height: 1.5;
          }

          .ai-canvas-shell {
            position: relative;
            width: 100%;
            padding: 7px;
            box-sizing: border-box;
            border: 1px solid rgba(148, 163, 184, 0.22);
            border-radius: 18px;
            background:
              linear-gradient(
                145deg,
                rgba(30, 41, 59, 0.95),
                rgba(15, 23, 42, 0.98)
              );
            box-shadow:
              0 18px 45px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }

          .ai-canvas-topbar {
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 13px;
            box-sizing: border-box;
          }

          .ai-canvas-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #94a3b8;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .ai-status-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow: 0 0 10px rgba(34, 197, 94, 0.65);
          }

          .ai-canvas-mode {
            display: inline-flex;
            align-items: center;
            padding: 6px 11px;
            border: 1px solid rgba(148, 163, 184, 0.22);
            border-radius: 8px;
            background: rgba(15, 23, 42, 0.72);
            color: #cbd5e1;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.8px;
          }

          .ai-canvas-board {
            position: relative;
            width: 100%;
            height: 345px;
            overflow: hidden;
            border-radius: 12px;
            background: #ffffff;
            box-shadow:
              inset 0 0 0 1px rgba(15, 23, 42, 0.1),
              inset 0 0 35px rgba(15, 23, 42, 0.05);
          }

          .ai-canvas-board::before {
            content: "";
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            background-image:
              linear-gradient(
                rgba(100, 116, 139, 0.075) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(100, 116, 139, 0.075) 1px,
                transparent 1px
              );
            background-size: 34px 34px;
          }

          .ai-canvas-board::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 220px;
            height: 220px;
            transform: translate(-50%, -50%);
            border: 1px dashed rgba(100, 116, 139, 0.18);
            border-radius: 16px;
            pointer-events: none;
            z-index: 1;
          }

          .ai-drawing-canvas {
            position: relative;
            z-index: 2;
            display: block;
            width: 100%;
            height: 100%;
            background: transparent;
            cursor: crosshair;
            touch-action: none;
            user-select: none;
            -webkit-user-select: none;
          }

          .ai-canvas-corner {
            position: absolute;
            z-index: 3;
            left: 13px;
            top: 12px;
            padding: 6px 10px;
            border: 1px solid rgba(100, 116, 139, 0.18);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.88);
            color: #475569;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.7px;
            pointer-events: none;
          }

          .ai-canvas-crosshair {
            position: absolute;
            z-index: 3;
            left: 50%;
            top: 50%;
            width: 230px;
            height: 230px;
            transform: translate(-50%, -50%);
            pointer-events: none;
          }

          .ai-canvas-crosshair::before,
          .ai-canvas-crosshair::after {
            content: "";
            position: absolute;
            background: rgba(100, 116, 139, 0.12);
          }

          .ai-canvas-crosshair::before {
            left: 50%;
            top: 0;
            width: 1px;
            height: 100%;
          }

          .ai-canvas-crosshair::after {
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
          }

          .ai-canvas-bottom {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 15px;
            min-height: 95px;
            padding: 12px 5px 2px;
            box-sizing: border-box;
          }

          .ai-canvas-hint {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 0;
            color: #cbd5e1;
            font-size: 14px;
            line-height: 1.4;
          }

          .ai-canvas-hint svg {
            flex-shrink: 0;
            color: #94a3b8;
          }

          .ai-canvas-actions {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 105px;
          }

          .ai-clear-button,
          .ai-restart-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 105px;
            height: 42px;
            padding: 0 16px;
            border: 1px solid rgba(148, 163, 184, 0.25);
            border-radius: 10px;
            background: #182235;
            color: #f8fafc;
            font-family: inherit;
            font-size: 14px;
            font-weight: 750;
            cursor: pointer;
            transition:
              background 0.2s ease,
              border-color 0.2s ease,
              transform 0.15s ease;
          }

          .ai-clear-button:hover,
          .ai-restart-button:hover {
            background: #222f46;
            border-color: rgba(148, 163, 184, 0.45);
          }

          .ai-clear-button:active,
          .ai-restart-button:active {
            transform: scale(0.98);
          }

          .ai-clear-button svg {
            color: #f59e0b;
          }

          .ai-restart-button svg {
            color: #60a5fa;
          }

          .ai-input-preview {
            margin: 14px 0 4px;
            padding: 14px;
            border: 1px solid rgba(148, 163, 184, 0.22);
            border-radius: 14px;
            background: rgba(15, 23, 42, 0.72);
          }

          .ai-input-preview-title {
            margin-bottom: 10px;
            color: #f8fafc;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.9px;
          }

          .ai-input-preview-box {
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            border: 1px solid rgba(148, 163, 184, 0.28);
            border-radius: 10px;
            background: #000000;
          }

          .ai-input-preview-image {
            width: 140px;
            height: 140px;
            display: block;
            object-fit: contain;
            image-rendering: pixelated;
            image-rendering: crisp-edges;
          }

          .ai-input-preview-note {
            margin-top: 9px;
            color: #94a3b8;
            font-size: 11px;
            line-height: 1.45;
          }

          @media (max-width: 700px) {
            .ai-draw-title {
              font-size: 24px;
            }

            .ai-canvas-board {
              height: 300px;
            }

            .ai-canvas-bottom {
              align-items: stretch;
              flex-direction: column;
            }

            .ai-canvas-actions {
              width: 100%;
            }

            .ai-clear-button,
            .ai-restart-button {
              width: 100%;
            }
          }
        `}
      </style>

      <div className="ai-draw-panel">

        <div className="ai-draw-header">
          <div className="ai-draw-heading">

            <div className="ai-draw-kicker">
              <span className="ai-draw-kicker-dot"></span>
              <span>DRAW &amp; RECOGNIZE</span>
            </div>

            <h3 className="ai-draw-title">
              {getTitle()}
            </h3>

            <p className="ai-draw-description">
              {getDescription()}
            </p>

          </div>
        </div>

        <div className="ai-canvas-shell">

          <div className="ai-canvas-topbar">

            <div className="ai-canvas-status">
              <span className="ai-status-dot"></span>
              <span>READY TO DRAW</span>
            </div>

            <div className="ai-canvas-mode">
              {getCanvasLabel()}
            </div>

          </div>

          <div className="ai-canvas-board">

            <canvas
              ref={canvasRef}
              className="ai-drawing-canvas"
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              onPointerCancel={stopDrawing}
            />

            <div className="ai-canvas-corner">
              {getCanvasLabel()}
            </div>

            <div className="ai-canvas-crosshair"></div>

          </div>

          {previewUrl && (
            <div className="ai-input-preview">

              <div className="ai-input-preview-title">
                 AI INPUT PREVIEW — {mode === "multi_digit" ? "FULL NUMBER" : "28 × 28"}
              </div>

              <div className="ai-input-preview-box">
                <img
                  src={previewUrl}
                  alt="Processed 28x28 AI input"
                  className="ai-input-preview-image"
                />
              </div>

              <div className="ai-input-preview-note">
                This is the exact processed image sent to the AI model.
              </div>

            </div>
          )}

          <div className="ai-canvas-bottom">

            <div className="ai-canvas-hint">
              <RotateCcw size={16} />
              <span>{getFooterText()}</span>
            </div>

            <div className="ai-canvas-actions">

              <button
                type="button"
                className="ai-clear-button"
                onClick={clearCanvas}
              >
                <Eraser size={17} />
                <span>Clear</span>
              </button>

              <button
                type="button"
                className="ai-restart-button"
                onClick={restartCanvas}
              >
                <RotateCcw size={17} />
                <span>Restart</span>
              </button>

            </div>

          </div>

        </div>

      </div> 
    </>
  );
}

export default DrawCanvas;