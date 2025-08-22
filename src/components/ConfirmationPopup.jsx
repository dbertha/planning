import React from 'react';

export function ConfirmationPopup({ fromAffectation, toAffectation, onConfirm, onCancel }) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Confirmer l'échange</h3>
        <p>Voulez-vous échanger :</p>
        <div className="exchange-details">
          <div className="exchange-item">
            <strong>De :</strong> {fromAffectation.famille}
            <br />
            <small>Semaine du {new Date(fromAffectation.semaineId).toLocaleDateString('fr-FR')}</small>
          </div>
          <div className="exchange-arrow">↔️</div>
          <div className="exchange-item">
            <strong>Avec :</strong> {toAffectation.famille}
            <br />
            <small>Semaine du {new Date(toAffectation.semaineId).toLocaleDateString('fr-FR')}</small>
          </div>
        </div>
        <div className="popup-actions">
          <button className="btn-cancel" onClick={onCancel}>Annuler</button>
          <button className="btn-confirm" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
} 