import { useEffect, useRef, useState } from "react";
import { Eraser, RotateCcw, Sparkles } from "lucide-react";

function DrawCanvas({
  mode = "digit",
  onFileReady,
  onClear,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

    // White drawing background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Drawing pen
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
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
  }, []);

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

  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File(
          [blob],
          `${mode}-handwriting.png`,
          {
            type: "image/png",
          }
        );

        if (onFileReady) {
          onFileReady(file, mode);
        }
      },
      "image/png"
    );
  };

  const clearCanvas = () => {
    setIsDrawing(false);

    setupCanvas();

    if (onClear) {
      onClear();
    }
  };

  const restartCanvas = () => {
    setIsDrawing(false);

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

        {/* HEADER */}
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

        {/* CANVAS */}
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

          {/* BOTTOM AREA */}
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