import { useEffect, useState, useCallback } from "react";
import { Settings, BarChart3, Hash } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DrawCanvas from "./components/DrawCanvas";
import UploadImage from "./components/UploadImage";
import PredictionResult from "./components/PredictionResult";
import History from "./components/History";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CameraRecognition from "./pages/CameraRecognition";
import Feedback from "./pages/Feedback";

import { predictImage } from "./services/predictionApi";
import "./App.css";

const API_BASE_URL =
  "https://ai-handwritten-digit-recognizer.onrender.com";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Automatic Number Extraction
  const [paperFile, setPaperFile] = useState(null);
  const [paperNumber, setPaperNumber] = useState("");
  const [paperLoading, setPaperLoading] = useState(false);
  const [paperError, setPaperError] = useState("");

  // SQLite Database History
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  // Load history from Flask + SQLite
  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/history`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not load history.");
      }

      const records = (data.history || [])
        .filter(
          (item) =>
            item.prediction !== null &&
            item.prediction !== undefined &&
            String(item.prediction).trim() !== ""
        )
        .map((item) => ({
          ...item,
          prediction: String(item.prediction),
          confidence: Number(item.confidence) || 0,
          date: item.date || item.created_at || "",
          mode: item.mode || "digit",
        }));

      setHistory(records);
    } catch (err) {
      console.error("History loading error:", err);
      setHistoryError(
        "History load झाली नाही. Python Flask backend सुरू आहे का ते तपास."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Load history when the app starts
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Close mobile sidebar when changing pages
  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  // Reset digit recognition page
  useEffect(() => {
    if (activePage === "digit") {
      setFile(null);
      setResult(null);
      setError("");
      setLoading(false);
    }
  }, [activePage]);

  // File Ready
  const handleFileReady = (selectedFile, recognitionMode = "digit") => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError("");
    setActivePage(recognitionMode);
  };

  // Clear prediction
  const clearPrediction = () => {
    setFile(null);
    setResult(null);
    setError("");
    setLoading(false);
  };

  // Digit Prediction
  const handlePredict = async () => {
    if (!file) {
      setError("Please draw or upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prediction = await predictImage(file, "digit");

      const cleanResult = {
        prediction: prediction.prediction ?? prediction.digit,
        confidence: Number(prediction.confidence || 0),
        mode: "digit",
      };

      if (
        cleanResult.prediction === undefined ||
        cleanResult.prediction === null ||
        String(cleanResult.prediction).trim() === ""
      ) {
        throw new Error("The backend did not return a prediction.");
      }

      setResult(cleanResult);

      // Backend saves the prediction to SQLite.
      // Reload the history from the database.
      await loadHistory();
    } catch (err) {
      setError(
        err?.message ||
          "Backend is not connected. Please start the Python Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  // Multi-Digit Prediction
  const handleMultiDigitPredict = async () => {
    if (!file) {
      setError("Please draw or upload a complete number first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prediction = await predictImage(file, "multi_digit");

      const cleanResult = {
        prediction:
          prediction.prediction ??
          prediction.digit ??
          prediction.number ??
          prediction.label,
        confidence: Number(prediction.confidence || 0),
        mode: "multi_digit",
      };

      if (
        cleanResult.prediction === undefined ||
        cleanResult.prediction === null ||
        String(cleanResult.prediction).trim() === ""
      ) {
        throw new Error("The backend did not return a number.");
      }

      setResult(cleanResult);

      // Refresh history from SQLite
      await loadHistory();
    } catch (err) {
      setError(
        err?.message ||
          "Multi-digit recognition failed. Check the Flask backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatic Number Extraction
  const handleAutomaticNumberExtraction = async () => {
    if (!paperFile) {
      setPaperError("Please upload a paper photo first.");
      return;
    }

    setPaperLoading(true);
    setPaperError("");
    setPaperNumber("");

    try {
      const response = await predictImage(
        paperFile,
        "automatic_number_extraction"
      );

      const extractedNumber =
        response.number ??
        response.prediction ??
        response.raw?.number ??
        response.raw?.prediction;

      if (
        extractedNumber === undefined ||
        extractedNumber === null ||
        String(extractedNumber).trim() === ""
      ) {
        throw new Error("No number was returned by the AI backend.");
      }

      const numberText = String(extractedNumber);
      setPaperNumber(numberText);

      // Refresh history from SQLite
      await loadHistory();
    } catch (err) {
      setPaperError(
        err?.message ||
          "Number extraction failed. Please check the backend."
      );
    } finally {
      setPaperLoading(false);
    }
  };

  // Analytics calculations
  const totalPredictions = history.length;

  const confidenceValues = history.map(
    (item) => Number(item.confidence) || 0
  );

  const averageConfidence =
    totalPredictions > 0
      ? (
          confidenceValues.reduce((sum, value) => sum + value, 0) /
          totalPredictions
        ).toFixed(1)
      : "0.0";

  const highestConfidence =
    totalPredictions > 0
      ? Math.max(...confidenceValues).toFixed(1)
      : "0.0";

  const lowestConfidence =
    totalPredictions > 0
      ? Math.min(...confidenceValues).toFixed(1)
      : "0.0";

  const topPredictions = Object.entries(
    history.reduce((counts, item) => {
      const prediction = String(
        item.prediction ?? item.digit ?? "Unknown"
      );

      counts[prediction] = (counts[prediction] || 0) + 1;
      return counts;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Page Rendering
  const renderPage = () => {
    // Dashboard
    if (activePage === "dashboard") {
      return (
        <Home
          setActivePage={setActivePage}
          file={file}
          result={result}
        />
      );
    }

    // Digit Recognition
    if (activePage === "digit") {
      return (
        <div className="recognition-page">
          <div className="page-section recognition-intro">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setActivePage("dashboard")}
            >
              ← Back to Dashboard
            </button>

            <div className="recognition-heading">
              <div className="recognition-page-logo">
                <Hash />
              </div>
              <span className="eyebrow">AI RECOGNITION</span>
              <h1>Digit Recognition</h1>
              <p>
                Draw or upload handwritten digits and send them
                to the AI backend.
              </p>
            </div>
          </div>

          <div className="recognition-grid">
            <DrawCanvas
              key="digit"
              mode="digit"
              onFileReady={(selectedFile) =>
                handleFileReady(selectedFile, "digit")
              }
              onClear={clearPrediction}
            />

            <UploadImage
              file={file}
              onFileReady={(selectedFile) =>
                handleFileReady(selectedFile, "digit")
              }
              onClear={clearPrediction}
            />

            <PredictionResult
              file={file}
              result={result}
              loading={loading}
              error={error}
              onPredict={handlePredict}
            />
          </div>
        </div>
      );
    }

    // Multi-Digit Recognition
    if (activePage === "multi_digit") {
      return (
        <div className="recognition-page">
          <div className="page-section recognition-intro">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setActivePage("dashboard")}
            >
              ← Back to Dashboard
            </button>

            <div className="recognition-heading">
              <div className="recognition-page-logo">
                <Hash />
              </div>
              <span className="eyebrow">AI NUMBER RECOGNITION</span>
              <h1>Multi-Digit Recognition</h1>
              <p>
                Draw or upload a complete handwritten number,
                such as 12345, and send it to the AI backend.
              </p>
            </div>
          </div>

          <div className="recognition-grid">
            <DrawCanvas
              key="multi_digit"
              mode="multi_digit"
              onFileReady={(selectedFile) => {
                setFile(selectedFile);
                setResult(null);
                setError("");
              }}
              onClear={clearPrediction}
            />

            <UploadImage
              file={file}
              onFileReady={(selectedFile) => {
                setFile(selectedFile);
                setResult(null);
                setError("");
              }}
              onClear={clearPrediction}
            />

            <PredictionResult
              file={file}
              result={result}
              loading={loading}
              error={error}
              onPredict={handleMultiDigitPredict}
            />
          </div>
        </div>
      );
    }

    // Automatic Number Extraction
    if (activePage === "automatic_number_extraction") {
      return (
        <div className="recognition-page">
          <div className="page-section recognition-intro">
            <button
              type="button"
              className="btn ghost"
              onClick={() => setActivePage("dashboard")}
            >
              ← Back to Dashboard
            </button>

            <div className="recognition-heading">
              <div className="recognition-page-logo">
                <Hash />
              </div>
              <span className="eyebrow">AI IMAGE PROCESSING</span>
              <h1>Automatic Number Extraction</h1>
              <p>
                Upload a photo of handwritten numbers on paper.
                The AI will try to extract the complete number.
              </p>
            </div>
          </div>

          <div
            className="recognition-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 0.8fr",
              alignItems: "stretch",
            }}
          >
            <div className="canvas-card" style={{ minWidth: 0 }}>
              <div className="panel-head">
                <div>
                  <span className="eyebrow">UPLOAD</span>
                  <h3>Paper Photo</h3>
                </div>
                <Hash size={21} />
              </div>

              <label className="upload-box">
                <span style={{ fontSize: 28 }}>📄</span>
                <strong>
                  {paperFile ? paperFile.name : "Choose a paper photo"}
                </strong>
                <span>PNG, JPG or JPEG</span>

                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={(event) => {
                    const selectedFile = event.target.files?.[0];
                    if (!selectedFile) return;

                    const allowedTypes = [
                      "image/png",
                      "image/jpeg",
                      "image/jpg",
                    ];

                    if (!allowedTypes.includes(selectedFile.type)) {
                      setPaperError(
                        "Please upload a PNG, JPG or JPEG image."
                      );
                      event.target.value = "";
                      return;
                    }

                    setPaperFile(selectedFile);
                    setPaperNumber("");
                    setPaperError("");
                  }}
                />
              </label>

              {paperFile && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={URL.createObjectURL(paperFile)}
                    alt="Uploaded paper preview"
                    style={{
                      display: "block",
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "contain",
                      borderRadius: 12,
                      background: "#ffffff",
                    }}
                  />
                </div>
              )}

              <div
                className="canvas-actions"
                style={{
                  marginTop: 18,
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn primary"
                  disabled={!paperFile || paperLoading}
                  onClick={handleAutomaticNumberExtraction}
                >
                  {paperLoading ? "Extracting Number..." : "Extract Number"}
                </button>

                <button
                  type="button"
                  className="btn primary"
                  disabled={paperLoading}
                  onClick={() => {
                    setPaperFile(null);
                    setPaperNumber("");
                    setPaperError("");
                  }}
                >
                  Clear Image
                </button>
              </div>
            </div>

            <div className="canvas-card" style={{ minWidth: 0 }}>
              <div className="panel-head">
                <div>
                  <span className="eyebrow">AI PREDICTION</span>
                  <h3>Prediction Result</h3>
                </div>
                <Hash size={21} />
              </div>

              <div
                style={{
                  marginTop: 20,
                  padding: 24,
                  minHeight: 180,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 14,
                  border: "1px solid rgba(148, 163, 184, 0.25)",
                  background: "rgba(148, 163, 184, 0.06)",
                  textAlign: "center",
                }}
              >
                {paperLoading ? (
                  <p>AI is extracting the number...</p>
                ) : paperError ? (
                  <p role="alert" style={{ color: "#f87171" }}>
                    {paperError}
                  </p>
                ) : paperNumber !== "" ? (
                  <>
                    <span className="eyebrow">EXTRACTED NUMBER</span>
                    <h1
                      style={{
                        fontSize: "clamp(36px, 6vw, 54px)",
                        margin: "12px 0",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {paperNumber}
                    </h1>
                    <p>Please verify the result against your photo.</p>
                  </>
                ) : (
                  <p>
                    Upload a paper photo and click Extract Number.
                    Your prediction will appear here.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // History
    if (activePage === "history") {
      return (
        <div>
          {historyLoading && (
            <p style={{ padding: "8px 20px" }}>
              Loading recognition history...
            </p>
          )}

          {historyError && (
            <div style={{ padding: "8px 20px" }}>
              <p role="alert">{historyError}</p>
              <button
                type="button"
                className="btn primary"
                onClick={loadHistory}
              >
                Retry Loading History
              </button>
            </div>
          )}

          <History
            history={history}
            setHistory={setHistory}
            setActivePage={setActivePage}
            onRefresh={loadHistory}
          />
        </div>
      );
    }

    // Profile
    if (activePage === "profile") {
      return <Profile setActivePage={setActivePage} />;
    }

    // Feedback
    if (activePage === "feedback") {
      return <Feedback setActivePage={setActivePage} />;
    }

    // Analytics
    if (activePage === "analytics") {
      return (
        <div className="page-section analytics-page">
          <button
            type="button"
            className="btn ghost"
            onClick={() => setActivePage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="analytics-title-row">
            <div className="analytics-logo">
              <BarChart3 size={46} strokeWidth={1.7} />
            </div>
            <span className="eyebrow analytics-eyebrow">ANALYTICS</span>
            <h1>Recognition Analytics</h1>
            <p className="large-description">
              Understand your handwritten digit recognition activity,
              prediction performance and recognition patterns.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Total Predictions</span>
                <div className="analytics-stat-icon">#</div>
              </div>
              <strong>{totalPredictions}</strong>
              <p>Total digit recognition attempts</p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Average Confidence</span>
                <div className="analytics-stat-icon">%</div>
              </div>
              <strong>{averageConfidence}%</strong>
              <p>Average AI confidence</p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Highest Confidence</span>
                <div className="analytics-stat-icon">↑</div>
              </div>
              <strong>{highestConfidence}%</strong>
              <p>Best prediction confidence</p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Lowest Confidence</span>
                <div className="analytics-stat-icon">↓</div>
              </div>
              <strong>{lowestConfidence}%</strong>
              <p>Lowest prediction confidence</p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="analytics-empty-card">
              <div className="analytics-empty-icon">#</div>
              <h2>No Analytics Data Yet</h2>
              <p>
                Make your first handwritten digit prediction
                to see analytics here.
              </p>
            </div>
          ) : (
            <>
              <div className="analytics-two-column">
                <div className="analytics-card">
                  <span className="eyebrow">PREDICTION DISTRIBUTION</span>
                  <h2>Most Recognized Digits</h2>

                  <div className="prediction-list">
                    {topPredictions.map(([prediction, count]) => {
                      const percentage =
                        totalPredictions > 0
                          ? Math.round((count / totalPredictions) * 100)
                          : 0;

                      return (
                        <div className="prediction-row" key={prediction}>
                          <div className="prediction-row-top">
                            <strong>{prediction}</strong>
                            <span>
                              {count} prediction{count !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <div className="prediction-progress">
                            <div
                              className="prediction-progress-fill"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <small>{percentage}% of total</small>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="analytics-card">
                  <span className="eyebrow">PROJECT MODE</span>
                  <h2>Digit Recognition</h2>
                  <p className="large-description">
                    Current AI model is focused on handwritten digits from 0 to 9.
                  </p>
                </div>
              </div>

              <div className="analytics-card analytics-recent-card">
                <span className="eyebrow">RECENT ACTIVITY</span>
                <h2>Latest Recognition Results</h2>

                <div className="analytics-recent-list">
                  {history.slice(0, 5).map((item, index) => {
                    const prediction =
                      item.prediction ?? item.digit ?? "Unknown";
                    const confidence = (
                      Number(item.confidence) || 0
                    ).toFixed(1);

                    return (
                      <div
                        className="analytics-recent-item"
                        key={item.id || `${prediction}-${index}`}
                      >
                        <div className="recent-number">{prediction}</div>
                        <div className="recent-details">
                          <strong>Prediction: {prediction}</strong>
                          <span>Confidence: {confidence}%</span>
                        </div>
                        <div className="recent-confidence">
                          <div className="confidence-dot" />
                          {confidence}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }

    // Settings
    if (activePage === "settings") {
      return (
        <div className="page-section analytics-page settings-page">

          <button
            type="button"
            className="btn ghost"
            onClick={() => setActivePage("dashboard")}
          >
            ← Back to Dashboard
          </button>

          <div className="analytics-title-row settings-title-row">
            <div className="analytics-logo">
              <Settings size={46} strokeWidth={1.7} />
            </div>

            <span className="eyebrow analytics-eyebrow">
              SETTINGS
            </span>

            <h1>Project Settings</h1>

            <p className="large-description">
              Manage application preferences and digit recognition
              settings.
            </p>
          </div>

          {/* Keep your existing settings-list here,
              including all three settings-item cards. */}

          <div className="settings-list">
            <div className="settings-item">
              <div>
                <strong>AI Recognition Mode</strong>
                <p>Current mode: Digit Recognition</p>
              </div>
              <span className="feature-status">Active</span>
            </div>

            <div className="settings-item">
              <div>
                <strong>Backend API</strong>
                <p>Python Flask prediction API</p>
              </div>
             <span className="feature-status">
                   ai-handwritten-digit-recognizer.onrender.com
            </span>

            <div className="settings-item">
              <div>
                <strong>History Storage</strong>
                <p>
                  Recognition history is stored in the SQLite database.
                </p>
              </div>
              <span className="feature-status">SQLite</span>
            </div>
          </div>
        </div>
      );
    }

    // Fallback
    return (
      <Home
        setActivePage={setActivePage}
        file={file}
        result={result}
      />
    );
  };

  // Main App
  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
      />

      <div className="main-area">
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          onMenuClick={() =>
            setSidebarOpen((previous) => !previous)
          }
        />

        <main className="content-area">{renderPage()}</main>
      </div>
    </div>
  );
}