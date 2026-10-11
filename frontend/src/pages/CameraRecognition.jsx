import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api/predict";

export default function CameraRecognition({ setActivePage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =================================================
  // ATTACH CAMERA STREAM TO VIDEO
  // =================================================

  useEffect(() => {
    const attachStream = async () => {
      if (!cameraOn) {
        return;
      }

      const video = videoRef.current;
      const stream = streamRef.current;

      if (!video || !stream) {
        return;
      }

      try {
        video.srcObject = stream;

        await video.play();

        console.log(
          "Camera stream attached successfully."
        );
      } catch (err) {
        console.error(
          "Video play error:",
          err
        );

        setError(
          "Unable to display the camera preview."
        );
      }
    };

    attachStream();
  }, [cameraOn]);

  // =================================================
  // START CAMERA
  // =================================================

  const startCamera = async () => {
    setError("");
    setPrediction(null);
    setConfidence(null);
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access is not supported by this browser."
        );
      }

      // Stop previous stream
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
              ideal: 640,
            },
            height: {
              ideal: 480,
            },
            facingMode: "user",
          },
          audio: false,
        });

      streamRef.current = stream;

      console.log(
        "Camera stream received:",
        stream
      );

      setCameraOn(true);
    } catch (err) {
      console.error(
        "Camera error:",
        err
      );

      if (err?.name === "NotAllowedError") {
        setError(
          "Camera permission was denied. Please allow camera access."
        );
      } else if (err?.name === "NotFoundError") {
        setError(
          "No camera was found on this device."
        );
      } else if (err?.name === "NotReadableError") {
        setError(
          "Camera is already being used by another application."
        );
      } else if (err?.name === "OverconstrainedError") {
        setError(
          "The requested camera settings are not supported."
        );
      } else {
        setError(
          err?.message ||
            "Unable to start camera."
        );
      }

      setCameraOn(false);
    }
  };

  // =================================================
  // STOP CAMERA
  // =================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  };

  // =================================================
  // CAPTURE IMAGE
  // =================================================

  const captureImage = () => {
    setError("");
    setPrediction(null);
    setConfidence(null);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setError(
        "Camera is not ready."
      );
      return;
    }

    if (
      video.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      setError(
        "Camera image is not ready yet. Please wait a moment and try again."
      );
      return;
    }

    const videoWidth =
      video.videoWidth || 640;

    const videoHeight =
      video.videoHeight || 480;

    if (
      videoWidth === 0 ||
      videoHeight === 0
    ) {
      setError(
        "Camera frame is not available yet. Please try again."
      );
      return;
    }

    // =================================================
    // CAPTURE CENTER AREA
    // =================================================

    const cropWidth =
      Math.floor(videoWidth * 0.70);

    const cropHeight =
      Math.floor(videoHeight * 0.75);

    const cropX =
      Math.floor(
        (videoWidth - cropWidth) / 2
      );

    const cropY =
      Math.floor(
        (videoHeight - cropHeight) / 2
      );

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      setError(
        "Unable to capture camera image."
      );
      return;
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

    const imageData =
      canvas.toDataURL(
        "image/png",
        1.0
      );

    setCapturedImage(
      imageData
    );

    stopCamera();
  };

  // =================================================
  // RECOGNIZE DIGIT
  // =================================================

  const recognizeDigit =
    async () => {
      setError("");

      if (!capturedImage) {
        setError(
          "Please capture an image first."
        );
        return;
      }

      setLoading(true);
      setPrediction(null);
      setConfidence(null);

      try {
        // Convert base64 image to Blob
        const response =
          await fetch(
            capturedImage
          );

        const blob =
          await response.blob();

        const file =
          new File(
            [blob],
            "camera-digit.png",
            {
              type: "image/png",
            }
          );

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        formData.append(
          "mode",
          "digit"
        );

        // Send image to Flask
        const apiResponse =
          await fetch(
            API_URL,
            {
              method: "POST",
              body: formData,
            }
          );

        if (!apiResponse.ok) {
          let message =
            `Backend error (${apiResponse.status})`;

          try {
            const data =
              await apiResponse.json();

            if (data?.message) {
              message =
                data.message;
            }

            if (data?.error) {
              message =
                data.error;
            }
          } catch {
            // Ignore JSON error
          }

          throw new Error(
            message
          );
        }

        const data =
          await apiResponse.json();

        console.log(
          "Camera API response:",
          data
        );

        const predictedDigit =
          data?.digit ??
          data?.prediction ??
          data?.label ??
          data?.result;

        if (
          predictedDigit ===
            undefined ||
          predictedDigit === null
        ) {
          throw new Error(
            "Backend response does not contain a valid digit prediction."
          );
        }

        const confidenceValue =
          Number(
            data?.confidence ??
              data?.score ??
              0
          );

        // =================================================
        // ALWAYS SHOW PREDICTED NUMBER
        // No confidence threshold
        // =================================================

        setPrediction(
          predictedDigit
        );

        setConfidence(
          Number.isFinite(
            confidenceValue
          )
            ? confidenceValue
            : 0
        );
      } catch (err) {
        console.error(
          "Prediction error:",
          err
        );

        if (
          err instanceof TypeError ||
          err?.message?.includes(
            "Failed to fetch"
          )
        ) {
          setError(
            "Backend is not connected. Please start the Python Flask server."
          );
        } else {
          setError(
            err?.message ||
              "Unable to recognize the digit."
          );
        }
      } finally {
        setLoading(false);
      }
    };

  // =================================================
  // RETAKE
  // =================================================

  const retake = async () => {
    setCapturedImage(null);
    setPrediction(null);
    setConfidence(null);
    setError("");

    await startCamera();
  };

  // =================================================
  // CLEANUP
  // =================================================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        streamRef.current = null;
      }
    };
  }, []);

  // =================================================
  // UI
  // =================================================

  return (
    <div className="page camera-page">

      {/* HEADER */}

      <button
  type="button"
  className="btn ghost"
  onClick={() => setActivePage("dashboard")}
  style={{ marginBottom: "20px" }}
>
  ← Back to Dashboard
</button>

      <div className="page-header">
        <div>
          <span className="eyebrow">
            CAMERA AI
          </span>

          <h1>
            Camera Recognition
          </h1>

          <p>
            Capture a handwritten digit
            using your camera and let
            the AI model recognize it.
          </p>
        </div>

        <Camera size={32} />
      </div>

      {/* CAMERA AREA */}

      <div className="camera-layout">

        {/* CAMERA CARD */}

        <div className="camera-card">

          <div className="panel-head">

            <div>
              <span className="eyebrow">
                LIVE CAMERA
              </span>

              <h3>
                Capture Handwritten Digit
              </h3>
            </div>

            {cameraOn ? (
              <span className="camera-status">
                <span className="status-dot green"></span>
                Camera On
              </span>
            ) : (
              <span className="camera-status">
                <span className="status-dot"></span>
                Camera Off
              </span>
            )}

          </div>

          {/* CAMERA PREVIEW */}

          {!capturedImage && (
            <div
              className="camera-preview"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "330px",
                background: "#050914",
              }}
            >

              {/* VIDEO IS ALWAYS MOUNTED */}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => {
                  if (
                    videoRef.current
                  ) {
                    videoRef.current
                      .play()
                      .catch(
                        (err) =>
                          console.error(
                            "Video play error:",
                            err
                          )
                      );
                  }
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  display: "block",
                  visibility: "visible",
                  opacity: 1,
                  objectFit: "cover",
                  zIndex: 2,
                  background:
                    "#050914",
                }}
              />

              {/* CAMERA OFF MESSAGE */}

              {!cameraOn && (
                <div
                  className="camera-placeholder"
                  style={{
                    position:
                      "absolute",
                    inset: 0,
                    zIndex: 3,
                  }}
                >
                  <Camera size={48} />

                  <span>
                    Click Start Camera
                    to begin.
                  </span>
                </div>
              )}

            </div>
          )}

          {/* CAPTURED IMAGE */}

          {capturedImage && (
            <div className="camera-preview">

              <img
                src={capturedImage}
                alt="Captured handwritten digit"
              />

            </div>
          )}

          {/* HIDDEN CANVAS */}

          <canvas
            ref={canvasRef}
            style={{
              display: "none",
            }}
          />

          {/* ERROR */}

          {error && (
            <div className="error-box">

              <AlertCircle
                size={19}
              />

              <span>
                {error}
              </span>

            </div>
          )}

          {/* CONTROLS */}

          <div className="camera-actions">

            {!cameraOn &&
              !capturedImage && (
                <button
                  type="button"
                  className="btn primary"
                  onClick={
                    startCamera
                  }
                >
                  <Camera
                    size={18}
                  />

                  Start Camera
                </button>
              )}

            {cameraOn && (
              <>
                <button
                  type="button"
                  className="btn primary"
                  onClick={
                    captureImage
                  }
                >
                  <Camera
                    size={18}
                  />

                  Capture
                </button>

                <button
                  type="button"
                  className="btn secondary"
                  onClick={
                    stopCamera
                  }
                >
                  <CameraOff
                    size={18}
                  />

                  Stop Camera
                </button>
              </>
            )}

            {capturedImage && (
              <>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={retake}
                  disabled={loading}
                >
                  <RotateCcw
                    size={18}
                  />

                  Retake
                </button>

                <button
                  type="button"
                  className="btn primary"
                  onClick={
                    recognizeDigit
                  }
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={18}
                        className="spin"
                      />

                      Recognizing...
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={18}
                      />

                      Recognize Digit
                    </>
                  )}
                </button>
              </>
            )}

          </div>

        </div>

        {/* RESULT CARD */}

        <div className="result-card">

          <div className="panel-head">

            <div>
              <span className="eyebrow">
                AI RESULT
              </span>

              <h3>
                Prediction
              </h3>
            </div>

            <Sparkles size={22} />

          </div>

          {!prediction &&
            !loading &&
            !error && (
              <div className="empty-state">

                <Camera size={32} />

                <span>
                  Capture a digit and
                  click Recognize Digit.
                </span>

              </div>
            )}

          {loading && (
            <div className="empty-state">

              <Loader2
                size={32}
                className="spin"
              />

              <span>
                AI is recognizing
                the digit...
              </span>

            </div>
          )}

          {prediction !== null &&
            !loading && (
              <div className="prediction-main">

                <div className="prediction-value">
                  {prediction}
                </div>

                <div className="confidence">

                  <div className="confidence-top">

                    <span>
                      Confidence
                    </span>

                    <b>
                      {Number(
                        confidence || 0
                      ).toFixed(1)}
                      %
                    </b>

                  </div>

                  <div className="bar">

                    <i
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            Number(
                              confidence ||
                                0
                            )
                          )
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="success-box">

                  <CheckCircle2
                    size={19}
                  />

                  <span>
                    Digit recognized
                    successfully.
                  </span>

                </div>

              </div>
            )}

        </div>

      </div>

      {/* INFO */}

      <div className="camera-info">

        <div>

          <Camera size={20} />

          <div>

            <strong>
              How it works
            </strong>

            <p>
              Start the camera → write
              a digit clearly → capture
              the image → click
              Recognize Digit.
            </p>

          </div>

        </div>

        <div>

          <Sparkles size={20} />

          <div>

            <strong>
              AI Recognition
            </strong>

            <p>
              The captured image is sent
              to the Python Flask backend,
              where the trained digit model
              predicts the handwritten digit
              and confidence.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}