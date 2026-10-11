import {
  Camera,
  Hash,
  ScanLine,
  Calculator,
  Brain,
  BookOpen,
  Target,
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

const featureData = {
  "real-time": {
    title: "Real-Time Digit Recognition",
    icon: Camera,
    tag: "DIGIT AI",
    status: "AVAILABLE",
    description:
      "Recognize handwritten digits using camera-based AI recognition.",
    available: true,
  },

  "multi-digit": {
    title: "Multi-Digit Recognition",
    icon: Hash,
    tag: "MULTI-DIGIT AI",
    status: "AVAILABLE",
    description:
      "Recognize multiple handwritten digits from a single input.",
    available: true,
  },

  "number-extraction": {
    title: "Automatic Number Extraction",
    icon: ScanLine,
    tag: "NUMBER AI",
    status: "AVAILABLE",
    description:
      "Detect and extract numerical information from handwritten input.",
    available: true,
  },

  personalized: {
    title: "Personalized Handwriting Learning",
    icon: Brain,
    tag: "FUTURE AI",
    status: "COMING SOON",
    description:
      "Learn a user's handwriting style and improve digit recognition over time.",
    available: false,
  },

  batch: {
    title: "Batch Digit Recognition",
    icon: BookOpen,
    tag: "FUTURE AI",
    status: "COMING SOON",
    description:
      "Process multiple handwritten digit images together and generate predictions.",
    available: false,
  },

  correction: {
    title: "Digit Error Correction",
    icon: Target,
    tag: "FUTURE AI",
    status: "COMING SOON",
    description:
      "Suggest alternative digit predictions when the AI is uncertain.",
    available: false,
  },

  builder: {
    title: "Digit-to-Number Builder",
    icon: Calculator,
    tag: "FUTURE AI",
    status: "COMING SOON",
    description:
      "Combine individually recognized digits to build complete numbers.",
    available: false,
  },

  report: {
    title: "Digit Recognition Report",
    icon: FileText,
    tag: "FUTURE ANALYTICS",
    status: "COMING SOON",
    description:
      "Generate reports containing predictions, confidence and recognition history.",
    available: false,
  },
};

export default function AdvancedFeature({
  type,
  setActivePage,
}) {
  const feature = featureData[type];

  if (!feature) {
    return (
      <div className="page-section">

        <button
          type="button"
          className="btn ghost"
          onClick={() => setActivePage("dashboard")}
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div style={{ marginTop: "24px" }}>
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

  return (
    <div className="page-section advanced-detail-page">

      {/* =================================
          BACK BUTTON
      ================================= */}

      <button
        type="button"
        className="btn ghost"
        onClick={() => setActivePage("dashboard")}
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
          STATUS
      ================================= */}

      <div className="advanced-overview-grid">

        <div className="advanced-overview-card">

          <div className="advanced-overview-icon">
            {feature.available ? (
              <CheckCircle2 size={21} />
            ) : (
              <Clock3 size={21} />
            )}
          </div>

          <div>

            <strong>
              {feature.status}
            </strong>

            <p>
              {feature.available
                ? "This digit recognition capability is part of the current project workflow."
                : "This capability is planned as a future enhancement."}
            </p>

          </div>

        </div>

        <div className="advanced-overview-card">

          <div className="advanced-overview-icon">
            <Sparkles size={21} />
          </div>

          <div>

            <strong>
              Digit Recognition AI
            </strong>

            <p>
              This project focuses on handwritten digit recognition
              from 0 to 9.
            </p>

          </div>

        </div>

      </div>

      {/* =================================
          AVAILABLE FEATURE
      ================================= */}

      {feature.available && (
        <div className="advanced-section-block">

          <div className="section-title-row">

            <div>

              <span className="eyebrow">
                CURRENT CAPABILITY
              </span>

              <h2>
                {feature.title}
              </h2>

              <p>
                This feature is included in the current
                Digit Recognition system.
              </p>

            </div>

          </div>

          <div
            className="advanced-workflow"
            style={{
              marginTop: "18px",
            }}
          >

            <div className="camera-step">

              <div className="camera-step-number">
                01
              </div>

              <div>

                <strong>
                  Capture or Provide Digit
                </strong>

                <p>
                  Handwritten digit information is provided
                  to the recognition system.
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
                  The digit input is processed by the
                  handwritten digit recognition model.
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
                  The recognized numerical result and
                  confidence are displayed to the user.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================
          COMING SOON FEATURE
      ================================= */}

      {!feature.available && (
        <div className="advanced-section-block">

          <div className="section-title-row">

            <div>

              <span className="eyebrow">
                FUTURE SCOPE
              </span>

              <h2>
                Coming Soon
              </h2>

              <p>
                This feature can be added in a future
                version of the Digit Recognition project.
              </p>

            </div>

          </div>

          <div
            className="advanced-tech-grid"
            style={{
              marginTop: "18px",
            }}
          >

            <div className="advanced-tech-card">

              <Brain size={20} />

              <div>

                <strong>
                  AI Enhancement
                </strong>

                <span>
                  Advanced digit recognition capabilities
                  can be integrated in future versions.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <Target size={20} />

              <div>

                <strong>
                  Better Accuracy
                </strong>

                <span>
                  Future models can improve recognition
                  accuracy and handling of difficult handwriting.
                </span>

              </div>

            </div>

            <div className="advanced-tech-card">

              <Sparkles size={20} />

              <div>

                <strong>
                  Future Development
                </strong>

                <span>
                  The feature is planned but is not claimed
                  as fully implemented in the current version.
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* =================================
          REAL-LIFE APPLICATIONS
      ================================= */}

      <div className="advanced-section-block">

        <div className="section-title-row">

          <div>

            <span className="eyebrow">
              REAL-LIFE APPLICATIONS
            </span>

            <h2>
              Where Digit Recognition Can Be Used
            </h2>

            <p>
              Handwritten digit recognition can help
              convert numerical handwriting into digital data.
            </p>

          </div>

        </div>

        <div
          className="advanced-points-grid"
          style={{
            marginTop: "18px",
          }}
        >

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Banking and Cheques
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Hospital Records
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Shops and Billing
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Courier and Parcel Numbers
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Education and Marks
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Government Forms
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Exam and Answer Sheets
            </span>
          </div>

          <div className="advanced-point-card">
            <Hash size={18} />
            <span>
              Industrial Numerical Records
            </span>
          </div>

        </div>

      </div>

      {/* =================================
          FINAL NOTE
      ================================= */}

      <div
        className="camera-note"
        style={{
          marginTop: "24px",
        }}
      >

        <strong>
          Project Focus
        </strong>

        <p>
          The current project is focused on handwritten
          Digit Recognition. Additional advanced digit
          capabilities can be developed in future versions.
        </p>

      </div>

    </div>
  );
}