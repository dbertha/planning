import React from 'react';

export function ConfirmationPopup({ fromAffectation, toAffectation, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Confirmer l'échange</h3>
        <p>Voulez-vous échanger :</p>
        <div className="exchange-details">
          <div className="exchange-item">
            <div className="affectation-info">
              <strong>👥 {fromAffectation.familleNom}</strong>
              <div className="classe-info">
                <span 
                  className="classe-badge"
                  style={{ backgroundColor: fromAffectation.classeCouleur }}
                >
                  🏠 {fromAffectation.classeNom}
                </span>
              </div>
              <small className="semaine-info">
                📅 Semaine du {new Date(fromAffectation.semaineDebut).toLocaleDateString('fr-FR')}
              </small>
            </div>
          </div>
          <div className="exchange-arrow">↔️</div>
          <div className="exchange-item">
            <div className="affectation-info">
              <strong>👥 {toAffectation.familleNom}</strong>
              <div className="classe-info">
                <span 
                  className="classe-badge"
                  style={{ backgroundColor: toAffectation.classeCouleur }}
                >
                  🏠 {toAffectation.classeNom}
                </span>
              </div>
              <small className="semaine-info">
                📅 Semaine du {new Date(toAffectation.semaineDebut).toLocaleDateString('fr-FR')}
              </small>
            </div>
          </div>
        </div>
        <div className="popup-actions">
          <button className="btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="btn-confirm" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .popup-content h3 {
          margin: 0 0 16px 0;
          color: #333;
          text-align: center;
          font-size: 20px;
        }

        .popup-content p {
          margin: 0 0 20px 0;
          color: #666;
          text-align: center;
          font-size: 14px;
        }

        .exchange-details {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 20px 0;
          flex-wrap: wrap;
        }

        .exchange-item {
          flex: 1;
          min-width: 180px;
          padding: 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .affectation-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .affectation-info strong {
          color: #333;
          font-size: 16px;
        }

        .classe-info {
          margin: 4px 0;
        }

        .classe-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .semaine-info {
          color: #666;
          font-size: 12px;
          font-style: italic;
        }

        .exchange-arrow {
          font-size: 24px;
          color: #007bff;
          text-align: center;
          min-width: 40px;
          align-self: center;
        }

        .popup-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 24px;
        }

        .btn-cancel, .btn-confirm {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 100px;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
        }

        .btn-cancel:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

        .btn-confirm {
          background: #007bff;
          color: white;
        }

        .btn-confirm:hover {
          background: #0056b3;
          transform: translateY(-1px);
        }

        @media (max-width: 500px) {
          .exchange-details {
            flex-direction: column;
          }
          
          .exchange-arrow {
            transform: rotate(90deg);
          }
          
          .popup-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
} 