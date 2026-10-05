
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  RotateCcw,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function CameraRecognition({ setActivePage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureTimerRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Camera is OFF");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // ==========================================
  // START CAMERA
  // ==========================================

  const startCamera = async () => {
    setLoading(true);
    setError("");
    setCapturedImage(null);
    setCountdown(0);
    setMessage("Opening camera...");

    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera is not supported by this browser."
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        throw new Error(
          "Video element not found."
        );
      }

      video.srcObject = stream;

      await new Promise((resolve) => {
        if (video.readyState >= 2) {
          resolve();
        } else {
          video.onloadedmetadata = resolve;
        }
      });

      await video.play();

      setCameraOn(true);

      setMessage(
        "Camera is ON — show handwriting inside the frame."
      );

      setError("");

      console.log(
        "Camera started:",
        video.videoWidth,
        video.videoHeight
      );

      setLoading(false);

      // ======================================
      // AUTOMATIC CAPTURE
      // ======================================

      let seconds = 2;

      setCountdown(seconds);

      setMessage(
        "Handwriting detected area will be captured automatically..."
      );

      captureTimerRef.current =
        setInterval(() => {
          seconds--;

          setCountdown(seconds);

          if (seconds <= 0) {
            clearInterval(
              captureTimerRef.current
            );

            captureTimerRef.current = null;

            captureHandwriting();
          }
        }, 1000);
    } catch (err) {
      console.error(
        "CAMERA ERROR:",
        err
      );

      setLoading(false);
      setCameraOn(false);

      if (
        err?.name ===
        "NotAllowedError"
      ) {
        setError(
          "Camera permission denied. Allow camera permission in Chrome."
        );
      } else if (
        err?.name ===
        "NotFoundError"
      ) {
        setError(
          "Camera not found."
        );
      } else {
        setError(
          err?.message ||
            "Unable to start camera."
        );
      }

      setMessage("Camera is OFF");
    }
  };

  // ==========================================
  // CAPTURE HANDWRITING
  // ==========================================

  const captureHandwriting = () => {
    console.log(
      "AUTOMATIC CAPTURE STARTED"
    );

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError(
        "Camera is not ready."
      );
      return;
    }

    const videoWidth =
      video.videoWidth;

    const videoHeight =
      video.videoHeight;

    if (
      videoWidth <= 0 ||
      videoHeight <= 0
    ) {
      setError(
        "Camera image is not ready."
      );
      return;
    }

    try {
      const cropWidth =
        Math.floor(
          videoWidth * 0.70
        );

      const cropHeight =
        Math.floor(
          videoHeight * 0.70
        );

      const cropX =
        Math.floor(
          (videoWidth -
            cropWidth) / 2
        );

      const cropY =
        Math.floor(
          (videoHeight -
            cropHeight) / 2
        );

      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx =
        canvas.getContext("2d");

      if (!ctx) {
        throw new Error(
          "Canvas could not be created."
        );
      }

      ctx.clearRect(
        0,
        0,
        cropWidth,
        cropHeight
      );

      ctx.drawImage(
        video,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      const image =
        canvas.toDataURL(
          "image/jpeg",
          0.95
        );

      if (
        !image ||
        image.length < 500
      ) {
        throw new Error(
          "Image capture failed."
        );
      }

      setCapturedImage(image);

      setCountdown(0);

      setMessage(
        "Handwriting captured successfully!"
      );

      setError("");

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        streamRef.current = null;
      }

      if (video) {
        video.pause();
        video.srcObject = null;
      }

      setCameraOn(false);

      console.log(
        "AUTOMATIC CAPTURE SUCCESS"
      );
    } catch (err) {
      console.error(
        "CAPTURE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to capture handwriting."
      );
    }
  };

  // ==========================================
  // STOP CAMERA
  // ==========================================

  const stopCamera = () => {
    if (captureTimerRef.current) {
      clearInterval(
        captureTimerRef.current
      );

      captureTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setCountdown(0);
    setMessage("Camera is OFF");
  };

  // ==========================================
  // RETAKE
  // ==========================================

  const retake = () => {
    setCapturedImage(null);
    setError("");
    setCountdown(0);

    startCamera();
  };

  // ==========================================
  // RESET
  // ==========================================

  const reset = () => {
    if (captureTimerRef.current) {
      clearInterval(
        captureTimerRef.current
      );

      captureTimerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setCapturedImage(null);
    setCountdown(0);
    setError("");
    setMessage("Camera is OFF");
  };

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (captureTimerRef.current) {
        clearInterval(
          captureTimerRef.current
        );
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="camera-page">

      {/* PAGE STYLES */}

      <style>
        {`
          /* =====================================================
             CAMERA PAGE ALIGNMENT
             SAME ALIGNMENT STYLE AS HANDWRITING TO SPEECH
             ===================================================== */

          .camera-page-top {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }

          .camera-back-button {
            position: static !important;

            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;

            margin-top: 0 !important;
            margin-bottom: 0 !important;

            background: #0c1525 !important;
            border: 1px solid #26364a !important;
            color: #f1f5f9 !important;
          }

          .camera-back-button svg {
            color: #f1f5f9 !important;
          }

          /* =====================================================
             HEADER ALIGNMENT
             ===================================================== */

          .camera-intro.camera-header-fixed {
            margin-top: 32px !important;
            padding-top: 0 !important;
            margin-bottom: 0 !important;
          }

          .camera-page-logo {
            width: 58px;
            height: 58px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-top: 0;
            margin-bottom: 13px;

            color: #e2e8f0;

            background: transparent;
            border: 0;
          }

          .camera-page-logo svg {
            width: 46px;
            height: 46px;
            stroke-width: 1.7;
          }

          /* =====================================================
             CAMERA CONTENT SPACING
             ===================================================== */

          .camera-layout {
            margin-top: 28px !important;
          }

          /* =====================================================
             MOBILE
             ===================================================== */

          @media (max-width: 700px) {
            .camera-intro.camera-header-fixed {
              margin-top: 26px !important;
            }

            .camera-layout {
              margin-top: 24px !important;
            }
          }
        `}
      </style>


      {/* BACK TO DASHBOARD */}

      <div className="camera-page-top">

        <button
          type="button"
          className="btn ghost camera-back-button"
          onClick={() =>
            setActivePage("dashboard")
          }
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

      </div>


      {/* PAGE HEADER */}

      <div className="camera-intro camera-header-fixed">

        {/* LARGE CAMERA LOGO */}

        <div className="camera-page-logo">
          <Camera />
        </div>


        <span className="eyebrow">
          ADVANCED RECOGNITION
        </span>


        <h1>
          Camera Recognition
        </h1>


        <p>
          Show your handwriting to the camera.
          The image will be captured automatically.
        </p>

      </div>


      {/* CAMERA LAYOUT */}

      <div className="camera-layout">


        {/* CAMERA CARD */}

        <div className="camera-card">

          <div className="panel-head">

            <div>

              <span className="eyebrow">
                LIVE CAMERA
              </span>

              <h3>
                Handwriting Scanner
              </h3>

            </div>


            <span
              className={
                cameraOn
                  ? "camera-status"
                  : capturedImage
                  ? "camera-status"
                  : "camera-status offline"
              }
            >
              {cameraOn
                ? "Camera Active"
                : capturedImage
                ? "Image Captured"
                : "Camera Off"}
            </span>

          </div>


          {/* CAMERA PREVIEW */}

          <div
            className="camera-preview"
            style={{
              position: "relative",
              overflow: "hidden",
            }}
          >

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={
                cameraOn
                  ? "camera-video visible"
                  : "camera-video"
              }
            />


            {!cameraOn &&
              !capturedImage && (
                <div className="camera-placeholder">

                  <Camera size={50} />

                  <strong>
                    Camera is OFF
                  </strong>

                  <span>
                    Click Start Camera to
                    open your webcam.
                  </span>

                </div>
              )}


            {cameraOn && (
              <div className="scanner-frame">

                <span className="corner top-left" />
                <span className="corner top-right" />
                <span className="corner bottom-left" />
                <span className="corner bottom-right" />

                <div className="scan-line" />

                <div className="scanner-label">
                  PLACE HANDWRITING HERE
                </div>


                {countdown > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform:
                        "translate(-50%, -50%)",
                      zIndex: 20,
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "rgba(0,0,0,0.75)",
                      border:
                        "2px solid #ff9f43",
                      color: "#ffffff",
                      fontSize: "30px",
                      fontWeight: "800",
                    }}
                  >
                    {countdown}
                  </div>
                )}

              </div>
            )}


            {capturedImage && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 100,
                  background: "#050811",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >

                <img
                  src={capturedImage}
                  alt="Captured handwriting"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />


                <div
                  style={{
                    position: "absolute",
                    top: "15px",
                    left: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "9px 13px",
                    borderRadius: "9px",
                    background:
                      "rgba(0,0,0,0.82)",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >

                  <CheckCircle2 size={17} />

                  Handwriting Captured

                </div>

              </div>
            )}

          </div>


          {/* HIDDEN CANVAS */}

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />


          {/* ERROR */}

          {error && (
            <div className="camera-error">

              <AlertCircle size={18} />

              <div>

                <strong>
                  Camera Error
                </strong>

                <span>
                  {error}
                </span>

              </div>

            </div>
          )}


          {/* BUTTONS */}

          <div className="camera-actions">

            {!cameraOn &&
              !capturedImage && (
                <button
                  type="button"
                  className="btn primary"
                  onClick={startCamera}
                  disabled={loading}
                >

                  <Camera size={19} />

                  {loading
                    ? "Starting..."
                    : "Start Camera"}

                </button>
              )}


            {cameraOn && (
              <button
                type="button"
                className="btn danger"
                onClick={stopCamera}
              >

                <CameraOff size={19} />

                Stop Camera

              </button>
            )}


            {capturedImage && (
              <button
                type="button"
                className="btn primary"
                onClick={retake}
              >

                <Camera size={19} />

                Retake

              </button>
            )}


            <button
              type="button"
              className="btn ghost"
              onClick={reset}
            >

              <RotateCcw size={18} />

              Reset

            </button>

          </div>


          {/* MESSAGE */}

          <div className="camera-message">
            {message}
          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="camera-info-card">

          <div className="camera-info-heading">

            <ScanLine size={23} />

            <div>

              <span className="eyebrow">
                AUTOMATIC WORKFLOW
              </span>

              <h2>
                Camera → Capture → AI
              </h2>

            </div>

          </div>


          <div className="camera-steps">

            <div className="camera-step">

              <span>
                01
              </span>

              <div>

                <strong>
                  Start Camera
                </strong>

                <p>
                  Open the webcam and show
                  your handwriting.
                </p>

              </div>

            </div>


            <div className="camera-step">

              <span>
                02
              </span>

              <div>

                <strong>
                  Automatic Capture
                </strong>

                <p>
                  After 2 seconds, the
                  handwriting image is captured
                  automatically.
                </p>

              </div>

            </div>


            <div className="camera-step">

              <span>
                03
              </span>

              <div>

                <strong>
                  AI Recognition
                </strong>

                <p>
                  The captured image can then
                  be sent to the AI backend.
                </p>

              </div>

            </div>

          </div>


          <div className="camera-note">

            <strong>
              Current Status
            </strong>

            <p>
              {capturedImage
                ? "Handwriting captured successfully. Ready for AI recognition."
                : "Show handwriting inside the scanner frame. Capture happens automatically."}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

