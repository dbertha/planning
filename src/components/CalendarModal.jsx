import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { 
  generateICSFile, 
  generateGoogleCalendarLink, 
  generateOutlookCalendarLink,
  downloadICSFile,
  generateFilename 
} from '../utils/calendarUtils.js';

export function CalendarModal({ isOpen, onClose, affectation, semaine, classe, famille }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleGoogleCalendar = () => {
    const link = generateGoogleCalendarLink(affectation, semaine, classe, famille);
    window.open(link, '_blank');
    onClose();
  };

  const handleOutlookCalendar = () => {
    const link = generateOutlookCalendarLink(affectation, semaine, classe, famille);
    window.open(link, '_blank');
    onClose();
  };

  const handleDownloadICS = () => {
    const icsContent = generateICSFile(affectation, semaine, classe, famille);
    const filename = generateFilename(affectation, semaine, classe, famille);
    downloadICSFile(icsContent, filename);
    onClose();
  };

  if (!isOpen || !affectation || !semaine || !classe || !famille) {
    return null;
  }

  const modalContent = (
    <div className="calendar-modal-overlay">
      <div ref={modalRef} className="calendar-modal">
        <div className="modal-header">
          <h3>✨ Ajouter au calendrier</h3>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-content">
          <div className="modal-info">
            <div className="info-item">
              <span className="info-label">📋 Classe :</span>
              <span className="info-value">{classe.nom}</span>
            </div>
            <div className="info-item">
              <span className="info-label">👥 Famille :</span>
              <span className="info-value">{famille.nom}</span>
            </div>
            <div className="info-item">
              <span className="info-label">📅 Période :</span>
              <span className="info-value">
                {new Date(semaine.debut).toLocaleDateString('fr-FR')} - {new Date(semaine.fin).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="calendar-options">
            <button
              className="calendar-option google"
              onClick={handleGoogleCalendar}
            >
              <span className="option-icon">🌐</span>
              <div className="option-content">
                <span className="option-title">Google Calendar</span>
                <span className="option-desc">Ouvrir dans Google Calendar</span>
              </div>
            </button>
            
            <button
              className="calendar-option outlook"
              onClick={handleOutlookCalendar}
            >
              <span className="option-icon">📧</span>
              <div className="option-content">
                <span className="option-title">Outlook Calendar</span>
                <span className="option-desc">Ouvrir dans Outlook</span>
              </div>
            </button>
            
            <button
              className="calendar-option download"
              onClick={handleDownloadICS}
            >
              <span className="option-icon">💾</span>
              <div className="option-content">
                <span className="option-title">Fichier .ics</span>
                <span className="option-desc">Télécharger le fichier</span>
              </div>
            </button>
          </div>
        </div>

        <style jsx>{`
          .calendar-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
          }

          .calendar-modal {
            background: white;
            border-radius: 16px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 450px;
            width: 90%;
            max-height: 80vh;
            overflow: hidden;
            animation: slideIn 0.3s ease;
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px 16px 24px;
            border-bottom: 1px solid #e5e7eb;
            background: linear-gradient(135deg, #f9fafb, #f3f4f6);
          }

          .modal-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 18px;
            color: #6b7280;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }

          .close-btn:hover {
            background: #f3f4f6;
            color: #374151;
          }

          .modal-content {
            padding: 24px;
          }

          .modal-info {
            margin-bottom: 24px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }

          .info-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
          }

          .info-item:not(:last-child) {
            border-bottom: 1px solid #e5e7eb;
          }

          .info-label {
            font-weight: 500;
            color: #6b7280;
            font-size: 14px;
          }

          .info-value {
            font-weight: 600;
            color: #111827;
            font-size: 14px;
            text-align: right;
          }

          .calendar-options {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .calendar-option {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            width: 100%;
          }

          .calendar-option:hover {
            border-color: #d1d5db;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
          }

          .calendar-option.google:hover {
            border-color: #10b981;
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          }

          .calendar-option.outlook:hover {
            border-color: #3b82f6;
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
          }

          .calendar-option.download:hover {
            border-color: #f59e0b;
            background: linear-gradient(135deg, #fffbeb, #fef3c7);
          }

          .option-icon {
            font-size: 24px;
            min-width: 24px;
          }

          .option-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .option-title {
            font-weight: 600;
            color: #111827;
            font-size: 16px;
          }

          .option-desc {
            color: #6b7280;
            font-size: 14px;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
        `}</style>
      </div>
    </div>
  );

  // Utiliser un portal pour rendre le modal à la racine du DOM
  return ReactDOM.createPortal(modalContent, document.body);
}
