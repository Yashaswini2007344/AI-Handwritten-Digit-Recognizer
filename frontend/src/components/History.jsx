
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
}) {
  const [query, setQuery] = useState("");

  const filteredHistory = history.filter((item) => {
    const searchText = query.toLowerCase();

    return (
      String(item.prediction)
        .toLowerCase()
        .includes(searchText) ||
      String(item.mode)
        .toLowerCase()
        .includes(searchText)
    );
  });

  const clearAllHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear all recognition history?"
    );

    if (confirmed) {
      setHistory([]);
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

      <div className="section-heading">
        <div>
          <span className="eyebrow">
            RECORDS
          </span>

          <h2>
            Recognition History
          </h2>

          <p>
            View and search your previous AI
            recognition results.
          </p>
        </div>

        <button
          type="button"
          className="btn danger"
          onClick={clearAllHistory}
          disabled={!history.length}
        >
          <Trash2 size={15} />
          Clear All
        </button>
      </div>

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

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prediction</th>
              <th>Mode</th>
              <th>Confidence</th>
              <th>Date & Time</th>
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
                    {item.mode}
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
                      {item.date}
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

