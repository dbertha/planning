import React from 'react';

export function OverwriteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  existingAffectation,
  newFamille,
  classe,
  semaine
}) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔄 Remplacer l'affectation</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="warning-icon">
            ⚠️
          </div>
          <div className="message">
            <p>Cette cellule est déjà occupée. Voulez-vous remplacer l'affectation existante ?</p>
            
            <div className="affectation-details">
              <div className="cell-info">
                <strong>📍 Cellule :</strong> {classe?.nom} - Semaine du {new Date(semaine?.debut).toLocaleDateString('fr-FR')}
              </div>
              
              <div className="change-summary">
                <div className="current-affectation">
                  <span className="label">👤 Actuellement :</span>
                  <div className="famille-info">
                    <strong>{existingAffectation?.familleNom}</strong>
                    {existingAffectation?.numeroNettoyage && (
                      <span className="nettoyage-badge">#{existingAffectation.numeroNettoyage}</span>
                    )}
                  </div>
                </div>
                
                <div className="arrow">⬇️</div>
                
                <div className="new-affectation">
                  <span className="label">🔄 Remplacer par :</span>
                  <div className="famille-info">
                    <strong>{newFamille?.nom}</strong>
                    <span className="new-badge">Nouveau</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Annuler
          </button>
          <button 
            className="btn btn-warning"
            onClick={handleConfirm}
          >
            🔄 Remplacer
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
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #666;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        .modal-body {
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .warning-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .message {
          flex: 1;
        }

        .message p {
          margin: 0 0 16px 0;
          color: #555;
          line-height: 1.5;
        }

        .affectation-details {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
        }

        .cell-info {
          background: #e9ecef;
          padding: 8px 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #495057;
        }

        .change-summary {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }

        .current-affectation,
        .new-affectation {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          text-align: center;
        }

        .current-affectation {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
        }

        .new-affectation {
          background: #d4edda;
          border: 1px solid #c3e6cb;
        }

        .label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .famille-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 14px;
        }

        .nettoyage-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .new-badge {
          background: #28a745;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .arrow {
          font-size: 20px;
          color: #007bff;
        }

        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          border-top: 1px solid #eee;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn-warning:hover {
          background: #e0a800;
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 20px;
            width: calc(100% - 40px);
          }
          
          .modal-body {
            padding: 20px;
          }
          
          .modal-footer {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 