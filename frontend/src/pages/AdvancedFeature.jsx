import { useMemo, useState } from "react";

import {
  Languages,
  BookOpen,
  Cloud,
  Bot,
  Search,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Database,
  Lock,
  Sparkles,
  Upload,
  Play,
  RefreshCw,
} from "lucide-react";

const featureData = {
  multilingual: {
    title: "Marathi + Hindi + English",
    icon: Languages,
    tag: "MULTILINGUAL AI",
    description:
      "Recognize handwritten content in Marathi, Hindi and English.",
  },

  notebook: {
    title: "Notebook Digitization",
    icon: BookOpen,
    tag: "NOTEBOOK AI",
    description:
      "Convert handwritten notebook pages into organized digital content.",
  },

  cloud: {
    title: "Cloud Processing",
    icon: Cloud,
    tag: "CLOUD AI",
    description:
      "Prepare larger handwriting documents for scalable cloud-based processing.",
  },

  assistant: {
    title: "AI Document Assistant",
    icon: Bot,
    tag: "DOCUMENT AI",
    description:
      "Analyze recognized document information and provide useful assistance.",
  },

  "search-documents": {
    title: "Search Handwritten Documents",
    icon: Search,
    tag: "SMART SEARCH",
    description:
      "Search digitized handwritten documents using keywords.",
  },

  "privacy-ai": {
    title: "Privacy-Preserving AI",
    icon: ShieldCheck,
    tag: "PRIVACY AI",
    description:
      "Prepare sensitive handwriting for privacy-focused local processing.",
  },
};

const sampleDocuments = [
  {
    id: 1,
    name: "Student Notes",
    text: "Machine Learning and Artificial Intelligence",
  },
  {
    id: 2,
    name: "Shop Register",
    text: "Customer bill total 1250 and stock entry",
  },
  {
    id: 3,
    name: "Hospital Notes",
    text: "Patient record and appointment details",
  },
  {
    id: 4,
    name: "College Assignment",
    text: "Python Data Analysis and Neural Network",
  },
];

export default function AdvancedFeature({
  type,
  setActivePage,
}) {
  const feature = featureData[type];

  const [selectedLanguage, setSelectedLanguage] =
    useState("English");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [notebookFiles, setNotebookFiles] =
    useState([]);

  const [actionMessage, setActionMessage] =
    useState("");

  const [assistantText, setAssistantText] =
    useState("");

  const [assistantResult, setAssistantResult] =
    useState(null);

  const [searchText, setSearchText] =
    useState("");

  const [localProcessing, setLocalProcessing] =
    useState(true);

  const [privacyFile, setPrivacyFile] =
    useState(null);

  /* =====================================
     INVALID FEATURE
  ===================================== */

  if (!feature) {
    return (
      <div className="page-section">

        <button
          type="button"
          className="btn ghost"
          onClick={() =>
            setActivePage("dashboard")
          }
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div
          style={{
            marginTop: "24px",
          }}
        >
          <span className="eyebrow">
            ERROR
          </span>

          <h1>
            Feature Not Found
          </h1>

          <p className="large-description">
            The selected advanced feature is not available.
          </p>
        </div>

      </div>
    );
  }

  const Icon = feature.icon;

  /* =====================================
     SEARCH DATA
  ===================================== */

  const filteredDocuments = useMemo(() => {
    const query = searchText
      .trim()
      .toLowerCase();

    if (!query) {
      return sampleDocuments;
    }

    return sampleDocuments.filter(
      (document) =>
        document.name
          .toLowerCase()
          .includes(query) ||
        document.text
          .toLowerCase()
          .includes(query)
    );
  }, [searchText]);

  /* =====================================
     MULTILINGUAL
  ===================================== */

  const handleLanguageAnalyze = () => {
    if (!selectedFile) {
      setActionMessage(
        "Please select a handwriting image first."
      );
      return;
    }

    setActionMessage(
      `Handwriting image is ready for ${selectedLanguage} AI recognition.`
    );
  };

  /* =====================================
     NOTEBOOK
  ===================================== */

  const handleNotebookUpload = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    setNotebookFiles(files);

    setActionMessage(
      `${files.length} notebook page(s) selected successfully.`
    );
  };

  const handleNotebookProcess = () => {
    if (!notebookFiles.length) {
      setActionMessage(
        "Please select at least one notebook page."
      );
      return;
    }

    setActionMessage(
      `${notebookFiles.length} notebook page(s) are ready for digitization.`
    );
  };

  /* =====================================
     CLOUD
  ===================================== */

  const handleCloudProcess = () => {
    if (!selectedFile) {
      setActionMessage(
        "Please select a document before starting cloud processing."
      );
      return;
    }

    setActionMessage(
      "Document is prepared for cloud AI processing."
    );
  };

  /* =====================================
     AI ASSISTANT
  ===================================== */

  const handleAssistantAnalyze = () => {
    const text = assistantText.trim();

    if (!text) {
      setAssistantResult(null);

      setActionMessage(
        "Please enter some recognized document text."
      );

      return;
    }

    const words = text
      .split(/\s+/)
      .filter(Boolean);

    const numbers =
      text.match(/\d+/g) || [];

    const lines = text
      .split(/\n/)
      .filter(
        (line) => line.trim()
      ).length;

    setAssistantResult({
      words: words.length,
      numbers: numbers.length,
      lines,
      summary:
        words.length > 20
          ? "The document contains a detailed amount of text."
          : "The document contains a short amount of text.",
    });

    setActionMessage(
      "Document analysis completed on the frontend."
    );
  };

  /* =====================================
     PRIVACY
  ===================================== */

  const handlePrivacyCheck = () => {
    if (!privacyFile) {
      setActionMessage(
        "Please select a sensitive document first."
      );
      return;
    }

    if (localProcessing) {
      setActionMessage(
        "Local processing is selected. The file is ready for privacy-focused on-device AI."
      );
    } else {
      setActionMessage(
        "Local processing is currently disabled."
      );
    }
  };

  return (
    <div className="page-section advanced-detail-page">

      {/* =================================
          BACK BUTTON
      ================================= */}

      <button
        type="button"
        className="btn ghost"
        onClick={() =>
          setActivePage("dashboard")
        }
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* =================================
          HEADER
      ================================= */}

      <div className="advanced-detail-header">

        <div className="advanced-detail-icon">
          <Icon size={32} />
        </div>

        <div>
          <span className="eyebrow">
            {feature.tag}
          </span>

          <h1>
            {feature.title}
          </h1>

          <p className="large-description">
            {feature.description}
          </p>
        </div>

      </div>

      {/* =================================
          OVERVIEW
      ================================= */}

      <div className="advanced-overview-grid">

        <div className="advanced-overview-card">

          <div className="advanced-overview-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <strong>
              Advanced Capability
            </strong>

            <p>
              This module extends the AI handwriting
              recognition platform with an additional
              capability.
            </p>
          </div>

        </div>

        <div className="advanced-overview-card">

          <div className="advanced-overview-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <strong>
              Frontend Ready
            </strong>

            <p>
              Interactive controls and workflow are
              available in the React frontend.
            </p>
          </div>

        </div>

      </div>

      {/* ==================================================
          MARATHI + HINDI + ENGLISH
      ================================================== */}

      {type === "multilingual" && (
        <>
          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  LANGUAGE SELECTION
                </span>

                <h2>
                  Choose handwriting language
                </h2>

                <p>
                  Select the language before preparing
                  the handwriting for recognition.
                </p>

              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(0, 1fr))",
                gap: "12px",
                marginTop: "18px",
              }}
            >
              {[
                "Marathi",
                "Hindi",
                "English",
              ].map((language) => (
                <button
                  type="button"
                  key={language}
                  className={
                    selectedLanguage === language
                      ? "btn primary"
                      : "btn"
                  }
                  onClick={() => {
                    setSelectedLanguage(language);

                    setActionMessage(
                      `${language} selected successfully.`
                    );
                  }}
                >
                  <Languages size={17} />
                  {language}
                </button>
              ))}
            </div>

          </div>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  HANDWRITING IMAGE
                </span>

                <h2>
                  Upload handwriting
                </h2>

                <p>
                  Choose an image containing handwritten
                  content.
                </p>

              </div>
            </div>

            <label
              className="info-feature-card"
              style={{
                cursor: "pointer",
                marginTop: "18px",
              }}
            >

              <Upload size={21} />

              <div>
                <h3>
                  Choose Image
                </h3>

                <p>
                  Select a handwritten image for{" "}
                  {selectedLanguage} recognition.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {

                    const file =
                      event.target.files?.[0];

                    setSelectedFile(
                      file || null
                    );

                    if (file) {
                      setActionMessage(
                        `${file.name} selected successfully.`
                      );
                    }

                  }}
                />

              </div>

            </label>

            {selectedFile && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >
                <strong>
                  Selected File
                </strong>

                <p>
                  {selectedFile.name}
                </p>
              </div>
            )}

            <button
              type="button"
              className="btn primary"
              style={{
                marginTop: "14px",
              }}
              onClick={handleLanguageAnalyze}
            >
              <Play size={17} />
              Prepare for AI Recognition
            </button>

            {actionMessage && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >
                <strong>
                  Status
                </strong>

                <p>
                  {actionMessage}
                </p>
              </div>
            )}

          </div>
        </>
      )}

      {/* ==================================================
          NOTEBOOK DIGITIZATION
      ================================================== */}

      {type === "notebook" && (
        <>
          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  NOTEBOOK INPUT
                </span>

                <h2>
                  Upload notebook pages
                </h2>

                <p>
                  Select one or multiple handwritten
                  notebook pages.
                </p>

              </div>
            </div>

            {/* UPLOAD BOX */}

            <div
              className="info-feature-card"
              style={{
                marginTop: "18px",
              }}
            >

              <BookOpen size={21} />

              <div
                style={{
                  flex: 1,
                }}
              >

                <h3>
                  Select Notebook Pages
                </h3>

                <p>
                  Choose one or multiple handwritten
                  notebook images.
                </p>

                <label
                  className="btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px",
                    cursor: "pointer",
                  }}
                >

                  <Upload size={17} />
                  Choose Files

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleNotebookUpload}
                  />

                </label>

              </div>

            </div>

            {/* SELECTED FILES */}

            {notebookFiles.length > 0 && (
              <div
                className="advanced-section-block"
                style={{
                  marginTop: "24px",
                }}
              >

                <div className="section-title-row">
                  <div>

                    <span className="eyebrow">
                      SELECTED PAGES
                    </span>

                    <h2>
                      {notebookFiles.length} page(s) selected
                    </h2>

                  </div>
                </div>

                <div
                  className="advanced-points-grid"
                  style={{
                    marginTop: "18px",
                  }}
                >

                  {notebookFiles.map(
                    (file, index) => (
                      <div
                        className="advanced-point-card"
                        key={`${file.name}-${index}`}
                      >

                        <FileText size={18} />

                        <span>
                          {file.name}
                        </span>

                      </div>
                    )
                  )}

                </div>

                {/* START DIGITIZATION BUTTON */}

                <button
                  type="button"
                  className="btn primary"
                  style={{
                    marginTop: "18px",
                    position: "relative",
                    zIndex: 20,
                    pointerEvents: "auto",
                  }}
                  onClick={handleNotebookProcess}
                >
                  <Play size={17} />
                  Start Digitization
                </button>

                {/* BUTTON STATUS */}

                {actionMessage && (
                  <div
                    className="camera-note"
                    style={{
                      marginTop: "14px",
                    }}
                  >

                    <strong>
                      Status
                    </strong>

                    <p>
                      {actionMessage}
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>
        </>
      )}

      {/* ==================================================
          CLOUD PROCESSING
      ================================================== */}

      {type === "cloud" && (
        <>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  CLOUD DOCUMENT
                </span>

                <h2>
                  Prepare document for cloud processing
                </h2>

                <p>
                  Select a handwriting document for
                  cloud-based AI processing.
                </p>

              </div>
            </div>

            <label
              className="info-feature-card"
              style={{
                cursor: "pointer",
                marginTop: "18px",
              }}
            >

              <Cloud size={21} />

              <div>

                <h3>
                  Upload Document
                </h3>

                <p>
                  Select an image or document file.
                </p>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  hidden
                  onChange={(event) => {

                    const file =
                      event.target.files?.[0];

                    setSelectedFile(
                      file || null
                    );

                    if (file) {
                      setActionMessage(
                        `${file.name} selected successfully.`
                      );
                    }

                  }}
                />

              </div>

            </label>

            {selectedFile && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Document Ready
                </strong>

                <p>
                  {selectedFile.name}
                </p>

              </div>
            )}

            <button
              type="button"
              className="btn primary"
              style={{
                marginTop: "14px",
              }}
              onClick={handleCloudProcess}
            >

              <Cloud size={17} />
              Start Cloud Processing

            </button>

            {actionMessage && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Status
                </strong>

                <p>
                  {actionMessage}
                </p>

              </div>
            )}

          </div>

          <div className="advanced-tech-grid">

            <div className="advanced-tech-card">

              <Cloud size={20} />

              <div>

                <strong>
                  Scalable Processing
                </strong>

                <span>
                  Designed for larger document workloads.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <Database size={20} />

              <div>

                <strong>
                  AI Model
                </strong>

                <span>
                  Backend model can process uploaded content.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <RefreshCw size={20} />

              <div>

                <strong>
                  Result Delivery
                </strong>

                <span>
                  Processed results can be returned to the frontend.
                </span>

              </div>

            </div>

          </div>

        </>
      )}

      {/* ==================================================
          AI DOCUMENT ASSISTANT
      ================================================== */}

      {type === "assistant" && (
        <>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  DOCUMENT ANALYSIS
                </span>

                <h2>
                  Enter recognized document text
                </h2>

                <p>
                  Paste or type text obtained from
                  handwriting recognition.
                </p>

              </div>
            </div>

            <textarea
              className="feedback-box"
              rows="8"
              value={assistantText}
              onChange={(event) =>
                setAssistantText(
                  event.target.value
                )
              }
              placeholder="Example: Student name Ankita, marks 89, subject Artificial Intelligence..."
              style={{
                marginTop: "18px",
              }}
            />

            <button
              type="button"
              className="btn primary"
              style={{
                marginTop: "14px",
              }}
              onClick={handleAssistantAnalyze}
            >

              <Bot size={17} />
              Analyze Document

            </button>

            {actionMessage && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Status
                </strong>

                <p>
                  {actionMessage}
                </p>

              </div>
            )}

          </div>

          {assistantResult && (
            <div
              className="advanced-points-grid"
              style={{
                marginTop: "18px",
              }}
            >

              <div className="advanced-point-card">

                <FileText size={18} />

                <span>
                  Words:{" "}
                  {assistantResult.words}
                </span>

              </div>

              <div className="advanced-point-card">

                <Database size={18} />

                <span>
                  Numbers found:{" "}
                  {assistantResult.numbers}
                </span>

              </div>

              <div className="advanced-point-card">

                <FileText size={18} />

                <span>
                  Lines:{" "}
                  {assistantResult.lines}
                </span>

              </div>

              <div className="advanced-point-card">

                <CheckCircle2 size={18} />

                <span>
                  {assistantResult.summary}
                </span>

              </div>

            </div>
          )}

        </>
      )}

      {/* ==================================================
          SEARCH HANDWRITTEN DOCUMENTS
      ================================================== */}

      {type === "search-documents" && (
        <>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  SMART SEARCH
                </span>

                <h2>
                  Search handwritten documents
                </h2>

                <p>
                  Search through digitized document
                  content using a keyword.
                </p>

              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "18px",
                alignItems: "stretch",
              }}
            >

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                placeholder="Search keyword..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "14px 16px",
                  borderRadius: "12px",
                  border: "1px solid #202a3d",
                  background: "#0b1220",
                  color: "#eef2ff",
                }}
              />

              <button
                type="button"
                className="btn primary"
                onClick={() =>
                  setActionMessage(
                    searchText.trim()
                      ? `Search completed for "${searchText.trim()}".`
                      : "Showing all digitized documents."
                  )
                }
              >

                <Search size={17} />
                Search

              </button>

            </div>

            {actionMessage && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Status
                </strong>

                <p>
                  {actionMessage}
                </p>

              </div>
            )}

          </div>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  DOCUMENT RESULTS
                </span>

                <h2>
                  {filteredDocuments.length} result(s)
                </h2>

              </div>
            </div>

            <div
              className="advanced-workflow"
              style={{
                marginTop: "18px",
              }}
            >

              {filteredDocuments.map(
                (document) => (
                  <div
                    className="camera-step"
                    key={document.id}
                  >

                    <div className="camera-step-number">
                      <FileText size={17} />
                    </div>

                    <div>

                      <strong>
                        {document.name}
                      </strong>

                      <p>
                        {document.text}
                      </p>

                    </div>

                  </div>
                )
              )}

              {filteredDocuments.length === 0 && (
                <div className="camera-note">

                  <strong>
                    No matching document
                  </strong>

                  <p>
                    Try another keyword.
                  </p>

                </div>
              )}

            </div>

          </div>

        </>
      )}

      {/* ==================================================
          PRIVACY-PRESERVING AI
      ================================================== */}

      {type === "privacy-ai" && (
        <>

          <div className="advanced-section-block">

            <div className="section-title-row">
              <div>

                <span className="eyebrow">
                  PRIVACY MODE
                </span>

                <h2>
                  Protect sensitive handwriting
                </h2>

                <p>
                  Select local processing when sensitive
                  handwriting should stay on the device.
                </p>

              </div>
            </div>

            <div
              className="info-feature-card"
              style={{
                marginTop: "18px",
              }}
            >

              <Lock size={21} />

              <div>

                <h3>
                  On-device processing
                </h3>

                <p>
                  Prefer local processing for
                  privacy-sensitive handwriting data.
                </p>

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "12px",
                    cursor: "pointer",
                  }}
                >

                  <input
                    type="checkbox"
                    checked={localProcessing}
                    onChange={(event) =>
                      setLocalProcessing(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    Keep processing local
                  </span>

                </label>

              </div>

            </div>

          </div>

          <div className="advanced-section-block">

            <label
              className="info-feature-card"
              style={{
                cursor: "pointer",
              }}
            >

              <ShieldCheck size={21} />

              <div>

                <h3>
                  Select Sensitive File
                </h3>

                <p>
                  Choose a handwriting image for
                  privacy-focused processing.
                </p>

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {

                    const file =
                      event.target.files?.[0];

                    setPrivacyFile(
                      file || null
                    );

                    if (file) {
                      setActionMessage(
                        `${file.name} selected successfully.`
                      );
                    }

                  }}
                />

              </div>

            </label>

            {privacyFile && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Selected File
                </strong>

                <p>
                  {privacyFile.name}
                </p>

              </div>
            )}

            <button
              type="button"
              className="btn primary"
              style={{
                marginTop: "14px",
              }}
              onClick={handlePrivacyCheck}
            >

              <ShieldCheck size={17} />
              Check Privacy Mode

            </button>

            {actionMessage && (
              <div
                className="camera-note"
                style={{
                  marginTop: "14px",
                }}
              >

                <strong>
                  Status
                </strong>

                <p>
                  {actionMessage}
                </p>

              </div>
            )}

          </div>

          <div className="advanced-tech-grid">

            <div className="advanced-tech-card">

              <Lock size={20} />

              <div>

                <strong>
                  Local Data
                </strong>

                <span>
                  Designed to reduce unnecessary external transfer.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <ShieldCheck size={20} />

              <div>

                <strong>
                  Sensitive Content
                </strong>

                <span>
                  Useful for confidential handwritten information.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <Database size={20} />

              <div>

                <strong>
                  AI Model
                </strong>

                <span>
                  A compatible local model is required for actual recognition.
                </span>

              </div>

            </div>

          </div>

        </>
      )}

      {/* ==================================================
          GENERAL WORKFLOW
      ================================================== */}

      <div className="advanced-section-block">

        <div className="section-title-row">
          <div>

            <span className="eyebrow">
              WORKFLOW
            </span>

            <h2>
              How this feature fits into the project
            </h2>

            <p>
              Input → AI processing → Digital information
            </p>

          </div>
        </div>

        <div className="advanced-workflow">

          <div className="camera-step">

            <div className="camera-step-number">
              01
            </div>

            <div>

              <strong>
                Capture or Upload
              </strong>

              <p>
                Handwritten information is provided
                through an image, document or recognized text.
              </p>

            </div>

          </div>

          <div className="camera-step">

            <div className="camera-step-number">
              02
            </div>

            <div>

              <strong>
                AI Processing
              </strong>

              <p>
                The appropriate AI model or backend can
                process the handwriting data.
              </p>

            </div>

          </div>

          <div className="camera-step">

            <div className="camera-step-number">
              03
            </div>

            <div>

              <strong>
                Digital Result
              </strong>

              <p>
                Recognized information can be searched,
                analyzed, stored or used in other workflows.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          FINAL NOTE
      ================================================== */}

      <div
        className="camera-note"
        style={{
          marginTop: "24px",
        }}
      >

        <strong>
          Feature Status
        </strong>

        <p>
          Frontend interface and interactions are ready.
          Actual handwriting recognition for these advanced
          capabilities requires the corresponding Python /
          Flask backend and AI models.
        </p>

      </div>

    </div>
  );
}