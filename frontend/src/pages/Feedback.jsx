
import { useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  Trash2,
  ThumbsUp,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

const FEEDBACK_KEY = "ai-handwriting-feedback";

const ratingOptions = [
  {
    value: 1,
    label: "Poor",
  },
  {
    value: 2,
    label: "Needs Improvement",
  },
  {
    value: 3,
    label: "Good",
  },
  {
    value: 4,
    label: "Very Good",
  },
  {
    value: 5,
    label: "Excellent",
  },
];

export default function Feedback({ setActivePage }) {
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem(FEEDBACK_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      FEEDBACK_KEY,
      JSON.stringify(feedbacks)
    );
  }, [feedbacks]);

  const totalFeedback = feedbacks.length;

  const averageRating = useMemo(() => {
    if (!feedbacks.length) {
      return "0.0";
    }

    const total = feedbacks.reduce(
      (sum, item) => sum + Number(item.rating || 0),
      0
    );

    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const positiveFeedback = feedbacks.filter(
    (item) => Number(item.rating) >= 4
  ).length;

  const needsImprovement = feedbacks.filter(
    (item) => Number(item.rating) <= 2
  ).length;

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return;
    }

    const newFeedback = {
      id:
        globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random()}`,

      rating,

      message: cleanMessage,

      date: new Date().toLocaleString(),
    };

    setFeedbacks((previous) => [
      newFeedback,
      ...previous,
    ]);

    setMessage("");
    setRating(5);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  const deleteFeedback = (id) => {
    setFeedbacks((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const clearAllFeedback = () => {
    if (!feedbacks.length) {
      return;
    }

    const confirmed = window.confirm(
      "Delete all feedback?"
    );

    if (confirmed) {
      setFeedbacks([]);
    }
  };

  return (
    <div className="page-section">

      {/* BACK TO DASHBOARD */}
      <button
        type="button"
        className="btn ghost"
        onClick={() => setActivePage("dashboard")}
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      {/* PAGE HEADER */}
      <div className="section-title-row">
        <div>

          {/* FEEDBACK LOGO */}
          <div
            style={{
              width: "58px",
              height: "58px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "13px",
              color: "#e2e8f0",
            }}
          >
            <MessageSquare
              size={46}
              strokeWidth={1.7}
            />
          </div>

          <span className="eyebrow">
            FEEDBACK
          </span>

          <h1>
            Project Feedback
          </h1>

          <p className="large-description">
            Collect user feedback and understand how
            people feel about the AI Handwriting
            Recognition system.
          </p>
        </div>
      </div>


      {/* FEEDBACK STATISTICS */}
      <div className="feedback-stats-grid">

        <div className="feedback-stat-card">
          <div className="feedback-stat-icon">
            <MessageSquare size={20} />
          </div>

          <div>
            <span>
              Total Feedback
            </span>

            <strong>
              {totalFeedback}
            </strong>
          </div>
        </div>


        <div className="feedback-stat-card">
          <div className="feedback-stat-icon">
            <Star size={20} />
          </div>

          <div>
            <span>
              Average Rating
            </span>

            <strong>
              {averageRating} / 5
            </strong>
          </div>
        </div>


        <div className="feedback-stat-card">
          <div className="feedback-stat-icon">
            <ThumbsUp size={20} />
          </div>

          <div>
            <span>
              Positive Feedback
            </span>

            <strong>
              {positiveFeedback}
            </strong>
          </div>
        </div>


        <div className="feedback-stat-card">
          <div className="feedback-stat-icon">
            <BarChart3 size={20} />
          </div>

          <div>
            <span>
              Needs Improvement
            </span>

            <strong>
              {needsImprovement}
            </strong>
          </div>
        </div>

      </div>


      {/* MAIN FEEDBACK AREA */}
      <div className="feedback-layout">


        {/* FEEDBACK FORM */}
        <div className="feedback-form-card">

          <div className="feedback-card-header">

            <div>
              <span className="eyebrow">
                GIVE FEEDBACK
              </span>

              <h2>
                How was your experience?
              </h2>
            </div>

            <MessageSquare size={22} />

          </div>


          <form onSubmit={handleSubmit}>

            {/* RATING */}
            <label>
              Rating
            </label>


            {/* STARS + INDIVIDUAL LABELS */}
            <div className="rating-options">

              {ratingOptions.map((item) => (
                <div
                  className="rating-option"
                  key={item.value}
                >

                  <button
                    type="button"
                    className={
                      rating === item.value
                        ? "rating-star active"
                        : "rating-star"
                    }
                    onClick={() =>
                      setRating(item.value)
                    }
                    aria-label={`${item.value} star rating`}
                  >

                    <Star
                      size={24}
                      fill={
                        rating >= item.value
                          ? "currentColor"
                          : "none"
                      }
                    />

                  </button>


                  <span className="rating-label">
                    {item.label}
                  </span>

                </div>
              ))}

            </div>


            {/* SELECTED RATING */}
            <p className="rating-text">
              {rating === 1 && "Poor"}
              {rating === 2 && "Needs Improvement"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>


            {/* FEEDBACK MESSAGE */}
            <label htmlFor="feedback-message">
              Your Feedback
            </label>

            <textarea
              id="feedback-message"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Tell us what you liked or what can be improved..."
              rows={6}
            />


            {/* SUBMIT */}
            <button
              type="submit"
              className="btn primary feedback-submit"
              disabled={!message.trim()}
            >

              <Send size={17} />

              Submit Feedback

            </button>


            {/* SUCCESS */}
            {submitted && (
              <div className="feedback-success">

                <ThumbsUp size={17} />

                Thank you! Your feedback has been saved.

              </div>
            )}

          </form>

        </div>


        {/* FEEDBACK HISTORY */}
        <div className="feedback-list-card">

          <div className="feedback-card-header">

            <div>
              <span className="eyebrow">
                FEEDBACK HISTORY
              </span>

              <h2>
                Recent Feedback
              </h2>
            </div>


            {feedbacks.length > 0 && (
              <button
                type="button"
                className="feedback-clear-button"
                onClick={clearAllFeedback}
              >

                <Trash2 size={15} />

                Clear All

              </button>
            )}

          </div>


          {/* NO FEEDBACK */}
          {feedbacks.length === 0 ? (

            <div className="feedback-empty">

              <MessageSquare size={30} />

              <h3>
                No feedback yet
              </h3>

              <p>
                Submitted feedback will appear here.
              </p>

            </div>

          ) : (

            /* FEEDBACK LIST */
            <div className="feedback-list">

              {feedbacks.map((item) => (

                <div
                  className="feedback-item"
                  key={item.id}
                >

                  <div className="feedback-item-top">

                    <div className="feedback-rating">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={14}
                            fill={
                              star <= item.rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        )
                      )}

                    </div>


                    <button
                      type="button"
                      className="feedback-delete"
                      onClick={() =>
                        deleteFeedback(item.id)
                      }
                      aria-label="Delete feedback"
                    >

                      <Trash2 size={15} />

                    </button>

                  </div>


                  <p>
                    {item.message}
                  </p>


                  <span className="feedback-date">
                    {item.date}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

