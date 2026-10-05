import { useState } from "react";
import {
  Volume2,
  Square,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function HandwritingSpeech({ setActivePage }) {
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [message, setMessage] = useState(
    "Enter recognized handwriting text and play it."
  );

  const speakText = () => {
    const cleanText = text.trim();

    if (!cleanText) {
      setMessage(
        "Please enter some recognized handwriting text."
      );
      return;
    }

    if (!("speechSynthesis" in window)) {
      setMessage(
        "Speech is not supported in this browser."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(cleanText);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onstart = () => {
      setSpeaking(true);
      setMessage(
        "AI is reading the recognized handwriting..."
      );
    };

    speech.onend = () => {
      setSpeaking(false);
      setMessage(
        "Speech completed successfully."
      );
    };

    speech.onerror = () => {
      setSpeaking(false);
      setMessage(
        "Unable to play speech."
      );
    };

    window.speechSynthesis.speak(speech);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setMessage("Speech stopped.");
  };

  const reset = () => {
    window.speechSynthesis.cancel();
    setText("");
    setSpeaking(false);
    setMessage(
      "Enter recognized handwriting text and play it."
    );
  };

  return (
    <div className="page-section">

      {/* LOGO STYLE */}

      <style>
        {`
          .speech-page-logo {
            width: 58px;
            height: 58px;

            display: flex;
            align-items: center;
            justify-content: center;

            margin-top: 32px;
            margin-bottom: 13px;

            color: #e2e8f0;
          }

          .speech-page-logo svg {
            width: 46px;
            height: 46px;
            stroke-width: 1.7;
          }
        `}
      </style>


      {/* BACK TO DASHBOARD */}

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


      {/* PAGE INTRO */}

      <div className="camera-intro">

        {/* LARGE SPEECH LOGO */}

        <div className="speech-page-logo">
          <Volume2 />
        </div>


        <span className="eyebrow">
          ADVANCED CAPABILITY
        </span>

        <h1>
          Handwriting to Speech
        </h1>

        <p>
          Convert recognized handwriting into spoken
          output using AI-assisted text recognition.
        </p>

      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(0, 1.4fr) minmax(280px, 0.8fr)",
          gap: "22px",
          marginTop: "28px",
        }}
      >

        {/* SPEECH CARD */}

        <div className="page-section">

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "20px",
            }}
          >

            <div className="brand-icon">
              <Volume2 size={22} />
            </div>

            <div>

              <span className="eyebrow">
                SPEECH ENGINE
              </span>

              <h2 style={{ margin: "4px 0 0" }}>
                Recognized Text
              </h2>

            </div>

          </div>


          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            placeholder="Enter recognized handwriting text here..."
            rows={8}
            style={{
              width: "100%",
              resize: "vertical",
              padding: "16px",
              borderRadius: "14px",
              border: "1px solid #26324a",
              background: "#080d19",
              color: "#eef2ff",
              fontSize: "16px",
              lineHeight: "1.6",
            }}
          />


          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginTop: "16px",
            }}
          >

            {!speaking ? (
              <button
                type="button"
                className="btn primary"
                onClick={speakText}
              >
                <Play size={18} />
                Read Aloud
              </button>
            ) : (
              <button
                type="button"
                className="btn danger"
                onClick={stopSpeech}
              >
                <Square size={17} />
                Stop Speech
              </button>
            )}


            <button
              type="button"
              className="btn ghost"
              onClick={reset}
            >
              <RotateCcw size={17} />
              Reset
            </button>

          </div>


          <div className="camera-message">
            {message}
          </div>

        </div>


        {/* WORKFLOW CARD */}

        <div className="page-section">

          <span className="eyebrow">
            WORKFLOW
          </span>

          <h2>
            How it works
          </h2>


          <div
            style={{
              display: "grid",
              gap: "14px",
              marginTop: "18px",
            }}
          >

            <div className="camera-step">

              <span>
                01
              </span>

              <div>

                <strong>
                  Handwriting Recognition
                </strong>

                <p>
                  Handwritten content is converted
                  into digital text.
                </p>

              </div>

            </div>


            <div className="camera-step">

              <span>
                02
              </span>

              <div>

                <strong>
                  Text Processing
                </strong>

                <p>
                  The recognized text is prepared
                  for speech output.
                </p>

              </div>

            </div>


            <div className="camera-step">

              <span>
                03
              </span>

              <div>

                <strong>
                  Voice Output
                </strong>

                <p>
                  The browser reads the recognized
                  text aloud.
                </p>

              </div>

            </div>

          </div>


          <div className="camera-note">

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >

              <CheckCircle2 size={18} />

              <strong>
                Current Status
              </strong>

            </div>

            <p>
              Speech conversion is available directly
              in the browser.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}