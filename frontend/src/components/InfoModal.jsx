function InfoModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="info-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="modal-icon">
          {item.icon}
        </div>

        <span className="section-tag">
          PROJECT INFORMATION
        </span>

        <h2>{item.title}</h2>

        <p className="modal-description">
          {item.description}
        </p>

        <div className="modal-points">
          {item.points?.map((point, index) => (
            <div
              className="modal-point"
              key={index}
            >
              <span>✓</span>
              <p>{point}</p>
            </div>
          ))}
        </div>

        <button
          className="primary-btn modal-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default InfoModal;