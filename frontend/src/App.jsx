
import { useEffect, useState } from "react";

import {
  Settings,
  BarChart3,
  History as HistoryIcon,
  UserRound,
  MessageSquare,
  Hash,
  Type,
  AlignLeft,
  FileText,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DrawCanvas from "./components/DrawCanvas";
import UploadImage from "./components/UploadImage";
import PredictionResult from "./components/PredictionResult";
import History from "./components/History";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CameraRecognition from "./pages/CameraRecognition";
import HandwritingSpeech from "./pages/HandwritingSpeech";
import AdvancedFeature from "./pages/AdvancedFeature";
import Feedback from "./pages/Feedback";
import PrivacyPreservingAI from "./pages/PrivacyPreservingAI";

import { predictImage } from "./services/predictionApi";

import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "ai-handwriting-history"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  /* SAVE HISTORY */
  useEffect(() => {
    localStorage.setItem(
      "ai-handwriting-history",
      JSON.stringify(history)
    );
  }, [history]);

  /* CLOSE MOBILE SIDEBAR WHEN PAGE CHANGES */
  useEffect(() => {
    setSidebarOpen(false);
  }, [activePage]);

  /* =========================================================
     IMPORTANT:
     KEEP DIGIT / CHARACTER / WORD / TEXT SEPARATE
     ========================================================= */

  useEffect(() => {
    const recognitionPages = [
      "digit",
      "character",
      "word",
      "text",
    ];

    if (recognitionPages.includes(activePage)) {
      setFile(null);
      setResult(null);
      setError("");
      setLoading(false);
    }
  }, [activePage]);

  /* FILE READY */
  const handleFileReady = (
    selectedFile,
    recognitionMode = "digit"
  ) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setResult(null);
    setError("");
    setActivePage(recognitionMode);
  };

  /* CLEAR PREDICTION */
  const clearPrediction = () => {
    setFile(null);
    setResult(null);
    setError("");
    setLoading(false);
  };

  /* PREDICT */
  const handlePredict = async () => {
    if (!file) {
      setError("Please draw or upload an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const prediction = await predictImage(
        file,
        "digit"
      );

      const cleanResult = {
        prediction: prediction.prediction,
        confidence: Number(
          prediction.confidence || 0
        ),
        mode: prediction.mode,
      };

      setResult(cleanResult);

      const newRecord = {
        id:
          globalThis.crypto?.randomUUID?.() ||
          `${Date.now()}-${Math.random()}`,

        prediction: cleanResult.prediction,
        confidence: cleanResult.confidence,
        mode: cleanResult.mode,
        date: new Date().toLocaleString(),
      };

      setHistory((previous) =>
        [newRecord, ...previous].slice(0, 100)
      );
    } catch (err) {
      setError(
        err?.message ||
          "Backend is not connected. Please start the Python Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  /* PAGE CONTENT */
  const renderPage = () => {
    /* DASHBOARD */
    if (activePage === "dashboard") {
      return (
        <Home
          setActivePage={setActivePage}
          file={file}
          result={result}
        />
      );
    }

    /* PROFILE */
    if (activePage === "profile") {
      return (
        <Profile
          setActivePage={setActivePage}
        />
      );
    }

    /* CAMERA */
    if (activePage === "camera") {
      return (
        <CameraRecognition
          setActivePage={setActivePage}
        />
      );
    }

    /* HANDWRITING TO SPEECH */
    if (activePage === "speech") {
      return (
        <HandwritingSpeech
          setActivePage={setActivePage}
        />
      );
    }

    /* PRIVACY-PRESERVING AI */
    if (activePage === "privacy-ai") {
      return (
        <PrivacyPreservingAI
          setActivePage={setActivePage}
        />
      );
    }

    /* ADVANCED FEATURES */
    if (
      activePage === "multilingual" ||
      activePage === "notebook" ||
      activePage === "cloud" ||
      activePage === "assistant" ||
      activePage === "search-documents"
    ) {
      return (
        <AdvancedFeature
          type={activePage}
          setActivePage={setActivePage}
        />
      );
    }

    /* FEEDBACK */
    if (activePage === "feedback") {
      return (
        <Feedback
          setActivePage={setActivePage}
        />
      );
    }

    /* HISTORY */
    if (activePage === "history") {
      return (
        <History
          history={history}
          setHistory={setHistory}
          setActivePage={setActivePage}
        />
      );
    }

    /* ANALYTICS */
    if (activePage === "analytics") {
      const totalPredictions = history.length;

      const averageConfidence =
        history.length > 0
          ? (
              history.reduce(
                (sum, item) =>
                  sum +
                  Number(item.confidence || 0),
                0
              ) / history.length
            ).toFixed(1)
          : "0.0";

      const highestConfidence =
        history.length > 0
          ? Math.max(
              ...history.map((item) =>
                Number(item.confidence || 0)
              )
            ).toFixed(1)
          : "0.0";

      const lowestConfidence =
        history.length > 0
          ? Math.min(
              ...history.map((item) =>
                Number(item.confidence || 0)
              )
            ).toFixed(1)
          : "0.0";

      const digitPredictions = history.filter(
        (item) =>
          item.mode === "digit" ||
          !item.mode
      ).length;

      const characterPredictions = history.filter(
        (item) => item.mode === "character"
      ).length;

      const wordPredictions = history.filter(
        (item) => item.mode === "word"
      ).length;

      const textPredictions = history.filter(
        (item) => item.mode === "text"
      ).length;

      const predictionCounts = {};

      history.forEach((item) => {
        const value =
          item.prediction ??
          item.digit ??
          item.label ??
          "Unknown";

        const key = String(value);

        predictionCounts[key] =
          (predictionCounts[key] || 0) + 1;
      });

      const topPredictions = Object.entries(
        predictionCounts
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return (
        <div className="page-section analytics-page">

          {/* BACK TO DASHBOARD */}
          <button
            type="button"
            className="btn ghost"
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          {/* PAGE HEADER */}
          <div className="section-title-row">
            <div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                  marginBottom: "8px",
                }}
              >
                <BarChart3
                  size={22}
                  strokeWidth={1.8}
                />

                <span className="eyebrow">
                  ANALYTICS
                </span>
              </div>

              <h1>
                Recognition Analytics
              </h1>

              <p className="large-description">
                Understand your handwriting
                recognition activity, prediction
                performance and recognition patterns.
              </p>

            </div>
          </div>

          {/* MAIN STATS */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Total Predictions</span>

                <div className="analytics-stat-icon">
                  #
                </div>
              </div>

              <strong>
                {totalPredictions}
              </strong>

              <p>
                Total recognition attempts
              </p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Average Confidence</span>

                <div className="analytics-stat-icon">
                  %
                </div>
              </div>

              <strong>
                {averageConfidence}%
              </strong>

              <p>
                Average AI prediction confidence
              </p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Highest Confidence</span>

                <div className="analytics-stat-icon">
                  ↑
                </div>
              </div>

              <strong>
                {highestConfidence}%
              </strong>

              <p>
                Best prediction confidence
              </p>
            </div>

            <div className="stat-card">
              <div className="analytics-stat-top">
                <span>Lowest Confidence</span>

                <div className="analytics-stat-icon">
                  ↓
                </div>
              </div>

              <strong>
                {lowestConfidence}%
              </strong>

              <p>
                Lowest prediction confidence
              </p>
            </div>

          </div>

          {/* ANALYTICS DATA */}
          {history.length === 0 ? (

            <div className="analytics-empty-card">

              <div className="analytics-empty-icon">
                #
              </div>

              <h2>
                No Analytics Data Yet
              </h2>

              <p>
                Make your first handwriting prediction
                to see analytics and recognition
                statistics here.
              </p>

            </div>

          ) : (

            <>

              <div className="analytics-two-column">

                {/* PREDICTION DISTRIBUTION */}
                <div className="analytics-card">

                  <div className="analytics-card-header">

                    <div>
                      <span className="eyebrow">
                        PREDICTION DISTRIBUTION
                      </span>

                      <h2>
                        Most Recognized Values
                      </h2>
                    </div>

                  </div>

                  <div className="prediction-list">

                    {topPredictions.map(
                      ([prediction, count]) => {

                        const percentage =
                          totalPredictions > 0
                            ? Math.round(
                                (count /
                                  totalPredictions) *
                                  100
                              )
                            : 0;

                        return (
                          <div
                            className="prediction-row"
                            key={prediction}
                          >

                            <div className="prediction-row-top">

                              <strong>
                                {prediction}
                              </strong>

                              <span>
                                {count} prediction
                                {count !== 1
                                  ? "s"
                                  : ""}
                              </span>

                            </div>

                            <div className="prediction-progress">

                              <div
                                className="prediction-progress-fill"
                                style={{
                                  width:
                                    `${percentage}%`,
                                }}
                              />

                            </div>

                            <small>
                              {percentage}% of total
                            </small>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>

                {/* RECOGNITION MODES */}
                <div className="analytics-card">

                  <div className="analytics-card-header">

                    <div>
                      <span className="eyebrow">
                        RECOGNITION MODES
                      </span>

                      <h2>
                        Usage Overview
                      </h2>
                    </div>

                  </div>

                  <div className="mode-list">

                    <div className="mode-item">

                      <div className="mode-info">
                        <span>
                          Digit Recognition
                        </span>

                        <strong>
                          {digitPredictions}
                        </strong>
                      </div>

                      <div className="mode-bar">

                        <div
                          className="mode-fill"
                          style={{
                            width:
                              totalPredictions > 0
                                ? `${
                                    (digitPredictions /
                                      totalPredictions) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        />

                      </div>

                    </div>

                    <div className="mode-item">

                      <div className="mode-info">
                        <span>
                          Character Recognition
                        </span>

                        <strong>
                          {characterPredictions}
                        </strong>
                      </div>

                      <div className="mode-bar">

                        <div
                          className="mode-fill"
                          style={{
                            width:
                              totalPredictions > 0
                                ? `${
                                    (characterPredictions /
                                      totalPredictions) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        />

                      </div>

                    </div>

                    <div className="mode-item">

                      <div className="mode-info">
                        <span>
                          Word Recognition
                        </span>

                        <strong>
                          {wordPredictions}
                        </strong>
                      </div>

                      <div className="mode-bar">

                        <div
                          className="mode-fill"
                          style={{
                            width:
                              totalPredictions > 0
                                ? `${
                                    (wordPredictions /
                                      totalPredictions) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        />

                      </div>

                    </div>

                    <div className="mode-item">

                      <div className="mode-info">
                        <span>
                          Text Recognition
                        </span>

                        <strong>
                          {textPredictions}
                        </strong>
                      </div>

                      <div className="mode-bar">

                        <div
                          className="mode-fill"
                          style={{
                            width:
                              totalPredictions > 0
                                ? `${
                                    (textPredictions /
                                      totalPredictions) *
                                    100
                                  }%`
                                : "0%",
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* RECENT ACTIVITY */}
              <div className="analytics-card analytics-recent-card">

                <div className="analytics-card-header">

                  <div>
                    <span className="eyebrow">
                      RECENT ACTIVITY
                    </span>

                    <h2>
                      Latest Recognition Results
                    </h2>
                  </div>

                </div>

                <div className="analytics-recent-list">

                  {history
                    .slice(0, 5)
                    .map((item, index) => {

                      const prediction =
                        item.prediction ??
                        item.digit ??
                        item.label ??
                        "Unknown";

                      const confidence =
                        Number(
                          item.confidence || 0
                        ).toFixed(1);

                      return (
                        <div
                          className="analytics-recent-item"
                          key={
                            item.id ||
                            `${prediction}-${index}`
                          }
                        >

                          <div className="recent-number">
                            {prediction}
                          </div>

                          <div className="recent-details">

                            <strong>
                              Prediction:{" "}
                              {prediction}
                            </strong>

                            <span>
                              Confidence:{" "}
                              {confidence}%
                            </span>

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

              {/* PERFORMANCE SUMMARY */}
              <div className="analytics-summary-card">

                <div>

                  <span className="eyebrow">
                    PERFORMANCE SUMMARY
                  </span>

                  <h2>
                    Recognition Performance
                  </h2>

                  <p>
                    Your system has completed{" "}
                    <strong>
                      {totalPredictions}
                    </strong>{" "}
                    recognition attempt
                    {totalPredictions !== 1
                      ? "s"
                      : ""}{" "}
                    with an average confidence
                    of{" "}
                    <strong>
                      {averageConfidence}%
                    </strong>.
                  </p>

                </div>

                <div className="summary-highlight">

                  <span>
                    Best Confidence
                  </span>

                  <strong>
                    {highestConfidence}%
                  </strong>

                </div>

              </div>

            </>

          )}

        </div>
      );
    }

    /* SETTINGS */
    if (activePage === "settings") {
      return (
        <div className="page-section">

          {/* BACK TO DASHBOARD */}
          <button
            type="button"
            className="btn ghost"
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          {/* SETTINGS HEADER */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginTop: "20px",
              marginBottom: "8px",
            }}
          >
            <Settings
              size={22}
              strokeWidth={1.8}
            />

            <span className="eyebrow">
              SETTINGS
            </span>
          </div>

          <h1>
            Project Settings
          </h1>

          <p className="large-description">
            Manage the application preferences and
            recognition settings.
          </p>

          <div className="settings-list">

            <div className="settings-item">

              <div>
                <strong>
                  AI Recognition Mode
                </strong>

                <p>
                  Current mode: Digit Recognition
                </p>
              </div>

              <span className="feature-status">
                Active
              </span>

            </div>

            <div className="settings-item">

              <div>
                <strong>
                  Backend API
                </strong>

                <p>
                  Python Flask prediction API
                </p>
              </div>

              <span className="feature-status">
                127.0.0.1:5000
              </span>

            </div>

            <div className="settings-item">

              <div>
                <strong>
                  History Storage
                </strong>

                <p>
                  Recognition history is stored
                  locally in this browser.
                </p>
              </div>

              <span className="feature-status">
                Local
              </span>

            </div>

          </div>
        </div>
      );
    }

    /* =========================================================
       RECOGNITION PAGES
       ========================================================= */

    if (
      activePage === "digit" ||
      activePage === "character" ||
      activePage === "word" ||
      activePage === "text"
    ) {
      let title = "Digit Recognition";
      let Logo = Hash;

      if (activePage === "character") {
        title = "Character Recognition";
        Logo = Type;
      }

      if (activePage === "word") {
        title = "Word Recognition";
        Logo = AlignLeft;
      }

      if (activePage === "text") {
        title = "Handwritten Text Recognition";
        Logo = FileText;
      }

      return (
        <div className="recognition-page">

          <style>
            {`
              .recognition-page-logo {
                width: 58px;
                height: 58px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 32px;
                margin-bottom: 13px;
                color: #e2e8f0;
              }

              .recognition-page-logo svg {
                width: 46px;
                height: 46px;
                stroke-width: 1.7;
              }

              .recognition-heading h1 {
                margin: 8px 0 8px;
                color: #f5f7ff;
              }

              .recognition-heading p {
                margin: 0;
                max-width: 720px;
                line-height: 1.7;
              }
            `}
          </style>

          <div className="page-section recognition-intro">

            {/* BACK TO DASHBOARD */}
            <button
              type="button"
              className="btn ghost"
              onClick={() =>
                setActivePage("dashboard")
              }
            >
              ← Back to Dashboard
            </button>

            {/* AI RECOGNITION + LOGO */}
            <div className="recognition-heading">

              <div className="recognition-page-logo">
                <Logo />
              </div>

              <span className="eyebrow">
                AI RECOGNITION
              </span>

              <h1>
                {title}
              </h1>

              <p>
                Draw or upload handwriting and send it
                to the AI backend.
              </p>

            </div>

          </div>

          <div className="recognition-grid">

            <DrawCanvas
              key={activePage}
              mode={activePage}
              onFileReady={(selectedFile) =>
                handleFileReady(
                  selectedFile,
                  activePage
                )
              }
              onClear={clearPrediction}
            />

            <UploadImage
              file={file}
              onFileReady={(selectedFile) =>
                handleFileReady(
                  selectedFile,
                  activePage
                )
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

    /* FALLBACK */
    return (
      <Home
        setActivePage={setActivePage}
        file={file}
        result={result}
      />
    );
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        open={sidebarOpen}
      />

      {/* MAIN AREA */}
      <div className="main-area">

        {/* HEADER */}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          onMenuClick={() =>
            setSidebarOpen(
              (previous) => !previous
            )
          }
        />

        {/* PAGE */}
        <main className="content-area">
          {renderPage()}
        </main>

      </div>

    </div>
  );
}

