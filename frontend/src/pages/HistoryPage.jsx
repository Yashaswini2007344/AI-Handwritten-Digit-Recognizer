import History from "../components/History";

function HistoryPage({
  history,
  onClear,
}) {
  return (
    <div className="separate-page">

      <div className="page-header">

        <div>
          <span>ACTIVITY</span>

          <h1>Prediction History</h1>

          <p>
            View all your saved digit recognition
            results in one place.
          </p>
        </div>

        <div className="page-icon">
          ◫
        </div>

      </div>

      <History
        history={history}
        onClear={onClear}
      />

    </div>
  );
}

export default HistoryPage;