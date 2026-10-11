import { useState } from "react";
import {
  Search,
  Trash2,
  Clock3,
  ArrowLeft,
} from "lucide-react";

export default function History({
  history,
  setHistory,
  setActivePage,
  onRefresh,
}) {
  const [query, setQuery] = useState("");

  const [clearing, setClearing] = useState(false);

  const filteredHistory = (history || []).filter((item) => {
    const searchText = query.toLowerCase();

    return (
      String(item.prediction ?? "")
        .toLowerCase()
        .includes(searchText) ||
      String(item.mode ?? "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // CLEAR HISTORY FROM SQLITE DATABASE
  const clearAllHistory = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all recognition history?"
    );

    if (!confirmed || clearing) return;

    setClearing(true);

    try {
      const response = await fetch(
        "https://ai-handwritten-digit-recognizer.onrender.com/api/history",
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to clear history."
        );
      }

      // Refresh history from the database
      if (onRefresh) {
        await onRefresh();
      } else {
        setHistory([]);
      }

      setQuery("");

      window.alert("History cleared successfully!");
    } catch (error) {
      console.error("Clear history error:", error);

      window.alert(
        "Could not clear history. Please make sure the Python backend is running."
      );
    } finally {
      setClearing(false);
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

      {/* HISTORY LOGO */}
      <div
        style={{
          width: "58px",
          height: "58px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: "28px",
          marginBottom: "13px",
          color: "#e2e8f0",
        }}
      >
        <Clock3
          size={46}
          strokeWidth={1.7}
        />
      </div>

      {/* PAGE HEADING */}
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            RECORDS
          </span>

          <h1 className="history-main-title">
            Recognition History
          </h1>

          <p>
            View and search your previous AI
            recognition results.
          </p>
        </div>

        {/* CLEAR ALL */}
        <button
          type="button"
          className="btn danger"
          onClick={clearAllHistory}
          disabled={!history?.length || clearing}
        >
          <Trash2 size={15} />
          {clearing ? "Clearing..." : "Clear All"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-line">
        <Search size={17} />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search prediction or mode..."
        />
      </div>

      {/* HISTORY TABLE */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="history-title">
                Prediction
              </th>

              <th className="history-title">
                Mode
              </th>

              <th className="history-title">
                Confidence
              </th>

              <th className="history-title">
                Date &amp; Time
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <tr key={item.id}>
                  <td className="strong">
                    {item.prediction}
                  </td>

                  <td>
                    {item.mode || "Draw"}
                  </td>

                  <td>
                    {Number(
                      item.confidence || 0
                    ).toFixed(1)}
                    %
                  </td>

                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Clock3 size={13} />
                      {item.date || item.created_at || "—"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="empty-cell"
                >
                  {query
                    ? "No matching history found."
                    : "No recognition history yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}