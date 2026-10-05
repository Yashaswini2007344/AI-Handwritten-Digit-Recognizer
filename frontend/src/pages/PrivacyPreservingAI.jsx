import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  Upload,
  Trash2,
  FileLock2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const SECURITY_API = "http://127.0.0.1:5000/api/security";

export default function PrivacyPreservingAI({ setActivePage }) {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${SECURITY_API}/documents`);

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch {
      setError("Secure storage backend is not connected.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setMessage("");
    setError("");
  };

  const encryptDocument = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${SECURITY_API}/encrypt`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Encryption failed."
        );
      }

      setMessage("Document encrypted and stored securely.");

      setFile(null);

      const input = document.getElementById(
        "privacy-file-input"
      );

      if (input) {
        input.value = "";
      }

      loadDocuments();
    } catch (err) {
      setError(
        err.message ||
          "Encryption failed. Check the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const decryptAndView = async (id) => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${SECURITY_API}/documents/${id}/view`
      );

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setMessage("Document decrypted successfully.");
    } catch {
      setError("Unable to decrypt the document.");
    }
  };

  const deleteDocument = async (id) => {
    try {
      const response = await fetch(
        `${SECURITY_API}/documents/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error();
      }

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== id)
      );

      setMessage("Document deleted successfully.");
    } catch {
      setError("Unable to delete the document.");
    }
  };

  return (
    <>
      <style>
        {`
          /* =====================================================
             PRIVACY PAGE HEADER
             ===================================================== */

          .privacy-back-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 9px;

            height: 50px;
            padding: 0 20px;

            border: 1px solid #26364a;
            border-radius: 12px;

            background: #0c1525;
            color: #f1f5f9;

            font-family: inherit;
            font-size: 16px;
            font-weight: 600;

            cursor: pointer;

            transition:
              background 0.2s ease,
              border-color 0.2s ease,
              transform 0.15s ease;
          }

          .privacy-back-btn:hover {
            background: #111d30;
            border-color: #3b526d;
          }

          .privacy-back-btn:active {
            transform: translateY(1px);
          }

          .privacy-back-arrow {
            font-size: 25px;
            line-height: 1;
            font-weight: 400;
          }


          /* =====================================================
             PRIVACY HEADER - SAME STYLE AS SEARCH PAGE
             ===================================================== */

          .privacy-modern-header {
            margin-top: 34px;
            margin-bottom: 34px;
          }

          .privacy-modern-icon {
            width: 58px;
            height: 58px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-bottom: 13px;

            color: #e2e8f0;

            background: transparent;

            border: 0;
          }

          .privacy-modern-icon svg {
            width: 46px;
            height: 46px;

            stroke-width: 1.7;
          }

          .privacy-modern-eyebrow {
            display: block;

            margin-bottom: 10px;

            color: #ff8a1f;

            font-size: 13px;
            font-weight: 800;

            letter-spacing: 1.6px;
            text-transform: uppercase;
          }

          .privacy-modern-header h1 {
            margin: 0 0 10px;

            color: #f8fafc;

            font-size: 32px;
            line-height: 1.15;

            font-weight: 800;
            letter-spacing: -0.7px;
          }

          .privacy-modern-header p {
            margin: 0;

            color: #8ea7c5;

            font-size: 15px;
            line-height: 1.55;
          }


          /* =====================================================
             RESPONSIVE HEADER
             ===================================================== */

          @media (max-width: 700px) {
            .privacy-modern-header {
              margin-top: 26px;
              margin-bottom: 28px;
            }

            .privacy-modern-header h1 {
              font-size: 27px;
            }

            .privacy-modern-header p {
              font-size: 14px;
            }
          }
        `}
      </style>

      <div className="privacy-page">

        {/* =====================================================
            BACK TO DASHBOARD
            ===================================================== */}

        <button
          type="button"
          className="privacy-back-btn"
          onClick={() => setActivePage("dashboard")}
        >
          <span className="privacy-back-arrow">←</span>

          <span>
            Back to Dashboard
          </span>
        </button>


        {/* =====================================================
            PAGE HEADER
            ===================================================== */}

        <div className="privacy-modern-header">

          {/* Large Privacy / Security Logo */}

          <div className="privacy-modern-icon">
            <ShieldCheck />
          </div>

          {/* Orange Category */}

          <span className="privacy-modern-eyebrow">
            ADVANCED SECURITY
          </span>

          {/* Main Title */}

          <h1>
            Privacy-Preserving AI
          </h1>

          {/* Description */}

          <p>
            Secure handwritten documents using encryption
            and protected storage.
          </p>

        </div>


        {/* =====================================================
            ALERTS
            ===================================================== */}

        {message && (
          <div className="privacy-alert success">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="privacy-alert error">
            <AlertCircle size={17} />
            {error}
          </div>
        )}


        {/* =====================================================
            SECURITY PROCESS
            ===================================================== */}

        <section className="dashboard-section">

          <div className="section-title-row">

            <div>

              <span className="eyebrow">
                SECURE WORKFLOW
              </span>

              <h2>
                Protect your handwritten information
              </h2>

              <p>
                Upload, encrypt, store and securely view
                sensitive documents.
              </p>

            </div>

          </div>


          <div className="privacy-process-grid">

            {/* 01 */}

            <div className="privacy-process-card">

              <span>01</span>

              <Upload size={20} />

              <h3>
                Upload
              </h3>

              <p>
                Select your document
              </p>

            </div>


            {/* 02 */}

            <div className="privacy-process-card">

              <span>02</span>

              <Lock size={20} />

              <h3>
                Encrypt
              </h3>

              <p>
                Protect the document
              </p>

            </div>


            {/* 03 */}

            <div className="privacy-process-card">

              <span>03</span>

              <FileLock2 size={20} />

              <h3>
                Secure Storage
              </h3>

              <p>
                Store encrypted data
              </p>

            </div>


            {/* 04 */}

            <div className="privacy-process-card">

              <span>04</span>

              <Unlock size={20} />

              <h3>
                Decrypt & View
              </h3>

              <p>
                Access when required
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            UPLOAD + SECURITY
            ===================================================== */}

        <div className="privacy-feature-grid">


          {/* =================================================
              ENCRYPT DOCUMENT
              ================================================= */}

          <section className="info-feature-card privacy-main-card">

            <div className="info-feature-icon">
              <Lock size={19} />
            </div>


            <div className="privacy-card-content">

              <h3>
                Encrypt Document
              </h3>

              <p>
                Upload a handwritten document and encrypt
                it before storing it securely.
              </p>


              {/* Upload Box */}

              <label
                htmlFor="privacy-file-input"
                className="privacy-upload-box"
              >

                <Upload size={25} />

                <strong>
                  {file
                    ? file.name
                    : "Choose a document"}
                </strong>

                <span>
                  Click to upload a file
                </span>

              </label>


              <input
                id="privacy-file-input"
                type="file"
                hidden
                onChange={handleFileChange}
              />


              {/* Selected File */}

              {file && (
                <div className="privacy-file-selected">

                  <div>

                    <FileLock2 size={17} />

                    <span>
                      {file.name}
                    </span>

                  </div>

                  <CheckCircle2 size={17} />

                </div>
              )}


              {/* Encrypt Button */}

              <button
                type="button"
                className="privacy-action-btn"
                onClick={encryptDocument}
                disabled={!file || loading}
              >

                <Lock size={16} />

                {loading
                  ? "Encrypting..."
                  : "Encrypt & Store"}

              </button>

            </div>

          </section>


          {/* =================================================
              PRIVACY & SECURITY
              ================================================= */}

          <section className="info-feature-card privacy-main-card">

            <div className="info-feature-icon">
              <ShieldCheck size={19} />
            </div>


            <div className="privacy-card-content">

              <h3>
                Privacy & Security
              </h3>

              <p>
                Sensitive handwritten information can be
                protected before it is stored.
              </p>


              {/* Document Encryption */}

              <div className="privacy-security-item">

                <Lock size={17} />

                <div>

                  <strong>
                    Document Encryption
                  </strong>

                  <span>
                    Protect documents before storage.
                  </span>

                </div>

              </div>


              {/* Secure Storage */}

              <div className="privacy-security-item">

                <FileLock2 size={17} />

                <div>

                  <strong>
                    Secure Storage
                  </strong>

                  <span>
                    Keep encrypted documents separately.
                  </span>

                </div>

              </div>


              {/* Controlled Access */}

              <div className="privacy-security-item">

                <Unlock size={17} />

                <div>

                  <strong>
                    Controlled Access
                  </strong>

                  <span>
                    Decrypt documents only when required.
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>


        {/* =====================================================
            SECURE STORAGE
            ===================================================== */}

        <section className="dashboard-section privacy-storage">

          <div className="section-title-row">

            <div>

              <span className="eyebrow">
                SECURE STORAGE
              </span>

              <h2>
                Encrypted Documents
              </h2>

              <p>
                Documents protected using the privacy
                workflow.
              </p>

            </div>


            <span className="privacy-count">
              {documents.length} Documents
            </span>

          </div>


          {/* No Documents */}

          {documents.length === 0 ? (

            <div className="privacy-empty">

              <FileLock2 size={28} />

              <h3>
                No secure documents yet
              </h3>

              <p>
                Upload and encrypt a document to see it here.
              </p>

            </div>

          ) : (

            /* Documents */

            <div className="privacy-document-list">

              {documents.map((doc) => (

                <div
                  className="privacy-document"
                  key={doc.id}
                >

                  {/* Document Name */}

                  <div className="privacy-document-name">

                    <div className="info-feature-icon">

                      <FileLock2 size={17} />

                    </div>


                    <div>

                      <strong>
                        {doc.name}
                      </strong>

                      <span>
                        Encrypted document
                      </span>

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="privacy-document-actions">

                    <button
                      type="button"
                      className="privacy-view-btn"
                      onClick={() =>
                        decryptAndView(doc.id)
                      }
                    >

                      <Unlock size={15} />

                      Decrypt & View

                    </button>


                    <button
                      type="button"
                      className="privacy-delete-btn"
                      onClick={() =>
                        deleteDocument(doc.id)
                      }
                    >

                      <Trash2 size={15} />

                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>
    </>
  );
}