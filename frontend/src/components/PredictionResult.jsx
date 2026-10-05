import {
  Brain,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function PredictionResult({
  file,
  result,
  loading,
  error,
  onPredict,
}) {
  return (
    <div className="result-card">
      <div className="panel-head">
        <div>
          <span className="eyebrow">AI RESULT</span>
          <h3>Prediction</h3>
        </div>

        <Brain size={22} />
      </div>

      {!file && !loading && !error && (
        <div className="empty-state">
          <Brain size={32} />

          <span>
            Draw or upload handwriting
            to start.
          </span>
        </div>
      )}

      {file &&
        !result &&
        !loading &&
        !error && (
          <div className="empty-state">
            <CheckCircle2 size={30} />

            <span>
              Your image is ready.
              Click Predict.
            </span>
          </div>
        )}

      {loading && (
        <div className="empty-state">
          <Loader2
            className="spin"
            size={30}
          />

          <span>
            Sending image to AI backend...
          </span>
        </div>
      )}

      {error && (
        <div className="error-box">
          <AlertCircle size={19} />

          <span>{error}</span>
        </div>
      )}

      {result && !loading && (
        <div className="prediction-main">
          <div className="prediction-value">
            {result.prediction}
          </div>

          <div className="confidence">
            <div className="confidence-top">
              <span>
                Confidence
              </span>

              <b>
                {Number(
                  result.confidence || 0
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
                        result.confidence || 0
                      )
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="btn primary full"
        disabled={!file || loading}
        onClick={onPredict}
      >
        {loading
          ? "Predicting..."
          : "Predict Handwriting"}
      </button>
    </div>
  );
}