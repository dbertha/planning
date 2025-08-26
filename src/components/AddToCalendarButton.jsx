import React from 'react';
import { useCalendarModal } from '../contexts/CalendarModalContext';

/**
 * Composant bouton pour ajouter une affectation au calendrier
 * Supporte Google Calendar, Outlook et téléchargement .ics
 */
export function AddToCalendarButton({ 
  affectation, 
  semaine, 
  classe, 
  famille, 
  size = 'small',
  showText = false,
  mode = 'normal' // 'normal' ou 'public'
}) {
  const { openCalendarModal } = useCalendarModal();

  // Vérifier que toutes les données nécessaires sont présentes
  if (!affectation || !semaine || !classe || !famille) {
    return null;
  }

  const handleButtonClick = () => {
    openCalendarModal({ affectation, semaine, classe, famille });
  };

  return (
    <div className="add-to-calendar">
      <button
        className={`calendar-btn ${size} ${mode === 'public' ? 'public-mode' : ''}`}
        onClick={handleButtonClick}
        title="Ajouter au calendrier"
      >
        📅{(showText || mode === 'public') && ' Ajouter'}
      </button>

      <style jsx>{`
        .add-to-calendar {
          position: relative;
          display: inline-block;
        }

        .calendar-btn {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.25);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .calendar-btn.small {
          padding: 6px 10px;
          font-size: 11px;
          border-radius: 6px;
        }

        .calendar-btn.medium {
          padding: 8px 12px;
          font-size: 13px;
          border-radius: 8px;
        }

        .calendar-btn.large {
          padding: 10px 16px;
          font-size: 14px;
          border-radius: 10px;
        }

        .calendar-btn:hover {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .calendar-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
        }

        .calendar-btn.public-mode {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
        }

        .calendar-btn.public-mode:hover {
          background: linear-gradient(135deg, #059669, #047857);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        }


      `}</style>
    </div>
  );
}

/**
 * Version simplifiée pour icône seulement
 */
export function AddToCalendarIcon({ affectation, semaine, classe, famille }) {
  return (
    <AddToCalendarButton 
      affectation={affectation}
      semaine={semaine}
      classe={classe}
      famille={famille}
      size="small"
      mode="public"
    />
  );
}