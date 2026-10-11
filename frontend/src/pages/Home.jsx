
import {
  Hash,
  Activity,
  ArrowRight,
  CheckCircle2,
  Brain,
  Building2,
  HeartPulse,
  GraduationCap,
  ShoppingBag,
  Truck,
  Landmark,
  Sparkles,
  FileSearch,
  Cloud,
  ScanText,
} from "lucide-react";

/* =========================================================
   RECOGNITION MODES
========================================================= */

const recognitionCards = [
  {
    id: "digit",
    title: "Digit Recognition",
    description:
      "Recognize handwritten digits from 0 to 9 using the AI digit model.",
    icon: Hash,
    color: "orange",
    status: "WORKING",
  },
  {
    id: "multi-digit",
    title: "Multi-Digit Recognition",
    description:
      "Recognize multiple handwritten digits from a single input.",
    icon: Hash,
    color: "purple",
    status: "WORKING",
  },
  {
    id: "number-extraction",
    title: "Automatic Number Extraction",
    description:
      "Detect and extract numerical information from handwritten input.",
    icon: ScanText,
    color: "green",
    status: "WORKING",
  },
];

/* =========================================================
   REAL-LIFE APPLICATIONS
========================================================= */

const applications = [
  {
    icon: Building2,
    title: "Banking & Financial Forms",
    use: "Handwritten numerical information can be digitized.",
    example:
      "Account numbers and numerical entries can be processed digitally.",
  },
  {
    icon: HeartPulse,
    title: "Hospital & Medical Records",
    use: "Handwritten numerical records can be stored digitally.",
    example:
      "Patient numbers and numerical records can be organized digitally.",
  },
  {
    icon: GraduationCap,
    title: "Education",
    use: "Handwritten marks and numerical information can be processed.",
    example:
      "Student marks written by hand can be converted into digital information.",
  },
  {
    icon: ShoppingBag,
    title: "Shops & Business Records",
    use: "Handwritten quantities and product numbers can be digitized.",
    example:
      "Stock quantities and numerical entries can be processed.",
  },
  {
    icon: Truck,
    title: "Courier & Delivery",
    use: "Handwritten numerical delivery information can be processed.",
    example:
      "Parcel numbers and numerical entries can be digitized.",
  },
  {
    icon: Landmark,
    title: "Government Forms",
    use: "Handwritten numerical information from forms can be digitized.",
    example:
      "Application numbers and numerical fields can be processed digitally.",
  },
];

/* =========================================================
   RECOGNITION CARD
========================================================= */

function FeatureCard({ item, onOpen }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      className={`recognition-card ${item.color}`}
      onClick={() => onOpen(item.id)}
    >
      <div className="recognition-card-top">
        <div className="feature-icon">
          <Icon size={21} />
        </div>

        <span className="feature-status">{item.status}</span>
      </div>

      <h3>{item.title}</h3>

      <p>{item.description}</p>

      <span className="card-action">
        Open Feature
        <ArrowRight size={15} />
      </span>
    </button>
  );
}

/* =========================================================
   INFORMATION CARD
========================================================= */

function InfoCard({ item }) {
  const Icon = item.icon;

  return (
    <div className="info-feature-card">
      <div className="info-feature-icon">
        <Icon size={19} />
      </div>

      <div>
        <h3>{item.title}</h3>

        {item.use ? (
          <>
            <p>
              <strong>Use:</strong> {item.use}
            </p>

            <p>
              <strong>Example:</strong> {item.example}
            </p>
          </>
        ) : (
          <p>{item.text}</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HOME COMPONENT
========================================================= */

export default function Home({ setActivePage, result }) {
  /* =======================================================
     PREDICTION HISTORY COUNT
  ======================================================= */

  let totalPredictions = 0;

  try {
    const saved = localStorage.getItem("ai-handwriting-history");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        totalPredictions = parsed.length;
      }
    }
  } catch (error) {
    console.error("Unable to read prediction history:", error);
  }

  /* =======================================================
     OPEN RECOGNITION
  ======================================================= */

  const openRecognition = (page) => {
    const pageMap = {
      digit: "digit",
      "multi-digit": "multi_digit",
      "number-extraction": "automatic_number_extraction",
    };

    setActivePage(pageMap[page] || "dashboard");
  };

  /* =======================================================
     HOME UI
  ======================================================= */

  return (
    <div className="home-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">
            AI HANDWRITING RECOGNITION
          </span>

          <h1>
            Turn Handwriting
            <br />
            Into <span>Intelligent Data.</span>
          </h1>

          <p>
            An AI-powered platform designed to recognize handwritten
            digits and transform numerical handwriting into useful
            digital information.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn primary"
              onClick={() => setActivePage("digit")}
            >
              <Brain size={17} />
              Start Recognition
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => setActivePage("history")}
            >
              <Activity size={17} />
              View History
            </button>
          </div>

          <div className="hero-points">
            <span>
              <CheckCircle2 size={15} />
              React Frontend
            </span>

            <span>
              <CheckCircle2 size={15} />
              Python + Flask Backend
            </span>

            <span>
              <CheckCircle2 size={15} />
              Digit AI Model
            </span>
          </div>
        </div>

        {/* HERO VISUAL */}

        <div className="hero-visual">
          <div className="ai-orb">
            <Brain size={62} />
          </div>

          <div className="floating-card floating-one">
            <Hash size={17} />
            <div>
              <b>Digit</b>
              <small>0 — 9</small>
            </div>
          </div>

          <div className="floating-card floating-three">
            <CheckCircle2 size={17} />
            <div>
              <b>AI</b>
              <small>Prediction</small>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          RECOGNITION MODES
      ================================================= */}

      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">RECOGNITION MODES</span>

            <h2>What can the AI recognize?</h2>

            <p>
              Choose a recognition feature to continue.
            </p>
          </div>
        </div>

        <div className="recognition-cards">
          {recognitionCards.map((item) => (
            <FeatureCard
              key={item.id}
              item={item}
              onOpen={openRecognition}
            />
          ))}
        </div>
      </section>

      {/* =================================================
          QUICK STATISTICS
      ================================================= */}

      <section className="dashboard-section">
        <div className="mini-dashboard-grid">

          {/* STATISTICS */}

          <div className="dashboard-card statistics-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="eyebrow">STATISTICS</span>
                <h3>Statistics Overview</h3>
              </div>

              <Activity size={20} />
            </div>

            <div className="stats-number">
              {totalPredictions}
            </div>

            <p>Total digit predictions recorded</p>

            <div className="stats-row">
              <div>
                <b>0–9</b>
                <span>Digits</span>
              </div>

              <div>
                <b>AI</b>
                <span>Engine</span>
              </div>
            </div>
          </div>

          {/* PREDICTION TREND */}

          <div className="dashboard-card trend-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="eyebrow">SAMPLE VISUALIZATION</span>
                <h3>Prediction Trend</h3>
              </div>

              <span className="trend-label">Mon — Sun</span>
            </div>

            <div className="trend-chart">
              {[28, 48, 35, 65, 52, 76, 58].map(
                (height, index) => (
                  <div className="trend-column" key={index}>
                    <div className="trend-bar-area">
                      <div
                        className="trend-bar"
                        style={{ height: `${height}%` }}
                      />
                    </div>

                    <span>
                      {[
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun",
                      ][index]}
                    </span>
                  </div>
                )
              )}
            </div>

            <p>
              Illustrative chart; actual daily history is not connected.
            </p>
          </div>

          {/* RECENT ACTIVITY */}

          <div className="dashboard-card activity-card">
            <div className="dashboard-card-heading">
              <div>
                <span className="eyebrow">ACTIVITY</span>
                <h3>Recent Activity</h3>
              </div>

              <button
                type="button"
                className="text-button"
                onClick={() => setActivePage("history")}
              >
                View all
              </button>
            </div>

            {result ? (
              <div className="activity-item">
                <div className="activity-icon">
                  <Hash size={17} />
                </div>

                <div>
                  <b>Prediction: {result.prediction}</b>

                  <span>
                    Confidence:{" "}
                    {Number(result.confidence || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="activity-item">
                <div className="activity-icon">
                  <Brain size={17} />
                </div>

                <div>
                  <b>AI Studio Ready</b>
                  <span>Waiting for prediction</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PROJECT INFORMATION */}

<section className="dashboard-section">
  <div className="section-title-row">
    <div>
      <span className="section-eyebrow">PROJECT INFORMATION</span>
      <h2>What works in the project?</h2>
      <p>
        An overview of the current handwritten digit recognition
        capabilities.
      </p>
    </div>
  </div>

  <div className="project-status-grid">
    {/* WORKING NOW */}

    <div className="project-status-card">
      <div className="project-status-header">
        <h3>Working Now</h3>
        <span className="status-label">
          <span className="status-dot"></span>
          Available
        </span>
      </div>

      <ul className="digit-feature-list">
        <li>Handwritten digit drawing (0–9)</li>
        <li>Upload handwritten digit image</li>
        <li>AI-based digit prediction</li>
        <li>Predicted digit display</li>
        <li>Prediction confidence score</li>
        <li>Clear and redraw digit</li>
        <li>Prediction history</li>
        <li>Digit recognition analytics</li>
        <li>Python backend integration</li>
      </ul>
    </div>

    {/* CURRENT LIMITATIONS */}

    <div className="project-status-card">
      <div className="project-status-header">
        <h3>Current Limitations</h3>
        <span className="status-label warning">
          <span className="status-dot warning"></span>
          Limitations
        </span>
      </div>

      <p>
        The AI model currently focuses on handwritten digit
        recognition from 0 to 9.
      </p>

      <ul className="digit-feature-list">
        <li>Alphabet recognition is not supported.</li>
        <li>Word recognition is not included.</li>
        <li>Full sentence recognition is not supported.</li>
        <li>
          Prediction accuracy depends on handwriting quality
          and image clarity.
        </li>
        <li>
          Similar-looking digits may sometimes be misclassified.
        </li>
      </ul>
    </div>
  </div>
</section>
      {/* =================================================
          REAL-LIFE APPLICATIONS
      ================================================= */}

      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">REAL-LIFE APPLICATIONS</span>

            <h2>Where can this technology be used?</h2>

            <p>
              Examples of how handwritten numerical information
              could be converted into digital data.
            </p>
          </div>
        </div>

        <div className="info-feature-grid">
          {applications.map((item) => (
            <InfoCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      {/* =================================================
          FUTURE SCOPE
      ================================================= */}

      <section className="dashboard-section">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">FUTURE SCOPE</span>

            <h2>Advanced Digit Recognition</h2>

            <p>
              Planned improvements for the AI Handwritten
              Digit Recognizer.
            </p>
          </div>
        </div>

        <div className="info-feature-grid">
          <InfoCard
            item={{
              icon: Brain,
              title: "Improved AI Accuracy",
              text:
                "Explore model improvements to recognize handwritten digits from 0 to 9 more accurately.",
            }}
          />

          <InfoCard
            item={{
              icon: ScanText,
              title: "Better Image Processing",
              text:
                "Improve preprocessing to handle unclear, tilted, or noisy handwritten digits.",
            }}
          />

          <InfoCard
            item={{
              icon: Activity,
              title: "Confidence Analysis",
              text:
                "Present prediction confidence clearly and help users understand model results.",
            }}
          />

          <InfoCard
            item={{
              icon: FileSearch,
              title: "Prediction Reports",
              text:
                "Explore reports containing recognized digits and their prediction results.",
            }}
          />

          <InfoCard
            item={{
              icon: Cloud,
              title: "Cloud Integration",
              text:
                "Deploy the application online so users can access it through a web browser.",
            }}
          />

          <InfoCard
            item={{
              icon: Sparkles,
              title: "AI Model Improvements",
              text:
                "Explore better training methods and datasets to improve digit recognition.",
            }}
          />
        </div>
      </section>

      {/* =================================================
          PROJECT DEVELOPMENT
      ================================================= */}

      <section className="development-section">
        <div className="development-heading">
          <span className="eyebrow">PROJECT DEVELOPMENT</span>

          <h2>How We Built the AI Digit Recognizer</h2>

          <p>
            An overview of the development process, from
            handwritten digit input to AI predictions.
          </p>
        </div>

        <div className="development-grid">

          <article className="development-card">
            <span className="development-number">01</span>

            <h3>Frontend Development</h3>

            <p>
              React and Vite are used to build an interactive
              interface for drawing digits, uploading images,
              and displaying predictions.
            </p>

            <span className="development-tag">
              React · Vite · CSS
            </span>
          </article>

          <article className="development-card">
            <span className="development-number">02</span>

            <h3>Backend Development</h3>

            <p>
              Python Flask receives digit images from the
              frontend, processes prediction requests, and
              returns the results.
            </p>

            <span className="development-tag">
              Python · Flask · API
            </span>
          </article>

          <article className="development-card">
            <span className="development-number">03</span>

            <h3>Image Preprocessing</h3>

            <p>
              The input image is processed and prepared
              according to the trained model's input
              requirements before prediction.
            </p>

            <span className="development-tag">
              Image Processing · NumPy
            </span>
          </article>

          <article className="development-card">
            <span className="development-number">04</span>

            <h3>AI Digit Prediction</h3>

            <p>
              The trained digit classification model analyzes
              the processed image and predicts a digit from
              0 to 9.
            </p>

            <span className="development-tag">
              TensorFlow · AI Model
            </span>
          </article>

          <article className="development-card">
            <span className="development-number">05</span>

            <h3>Testing and Validation</h3>

            <p>
              Drawing, image uploads, prediction results,
              and error handling are tested to identify
              incorrect predictions.
            </p>

            <span className="development-tag">
              Testing · Debugging
            </span>
          </article>

          <article className="development-card">
            <span className="development-number">06</span>

            <h3>Frontend and Backend Integration</h3>

            <p>
              The React frontend communicates with the
              Python backend through an API to display
              prediction results.
            </p>

            <span className="development-tag">
              React + Python API
            </span>
          </article>

        </div>
      </section>

    </div>
  );
}
