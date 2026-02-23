import { useState } from "react";
import "./confirmDialog.css";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onCancel, 150);
  };

  const handleConfirm = () => {
    setClosing(true);
    setTimeout(onConfirm, 150);
  };

  return (
    <div className={`confirm-overlay ${closing ? "closing" : ""}`}>
      <div className="confirm-box">
        <div className="confirm-header">
          <h5>Confirmação</h5>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        <p>{message}</p>

        <div className="confirm-footer">
          <button className="btn btn-outline-secondary" onClick={handleClose}>
            Cancelar
          </button>

          <button className="btn btn-danger btn-confirm" onClick={handleConfirm}>
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
