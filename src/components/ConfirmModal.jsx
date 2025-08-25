import React from 'react';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "danger" // "danger", "warning", "info"
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'danger': return '🗑️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '❓';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'warning': return 'btn-warning';
      case 'info': return 'btn-primary';
      default: return 'btn-primary';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getIcon()} {title}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${getButtonColor()}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(2px);
        }

        .confirm-modal {
          background: white;
          border-radius: 12px;
          min-width: 400px;
          max-width: 500px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.2s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          padding: 20px 24px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: none;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        .modal-body {
          padding: 20px 24px;
        }

        .confirm-message {
          margin: 0;
          line-height: 1.5;
          color: #555;
          font-size: 15px;
        }

        .modal-footer {
          padding: 0 24px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 80px;
        }

        .btn-outline {
          background: white;
          color: #666;
          border: 1px solid #ddd;
        }

        .btn-outline:hover {
          background: #f5f5f5;
          color: #333;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-warning {
          background: #f59e0b;
          color: white;
        }

        .btn-warning:hover {
          background: #d97706;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        @media (max-width: 480px) {
          .confirm-modal {
            min-width: 320px;
            margin: 20px;
          }
          
          .modal-header,
          .modal-body,
          .modal-footer {
            padding-left: 16px;
            padding-right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
