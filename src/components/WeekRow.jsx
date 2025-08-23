import React, { useState } from 'react';
import { AffectationCell } from './AffectationCell';
import { formatDate } from '../utils/dateUtils';

export function WeekRow({ semaine, classes, affectations, onAffectationMove, onFamilleDrop, onOverwriteRequest, isAdmin, canEdit, onAutoDistribute }) {
  const isPublished = semaine.is_published;
  const [isDistributing, setIsDistributing] = useState(false);

  // Calculer combien de classes sont libres
  const occupiedClasses = new Set(affectations.map(a => a.classeId));
  const freeClasses = classes.filter(classe => !occupiedClasses.has(classe.id));
  const canAutoDistribute = canEdit && freeClasses.length > 0;

  const handleAutoDistribute = async () => {
    if (!canAutoDistribute || !onAutoDistribute) return;

    setIsDistributing(true);
    try {
      await onAutoDistribute(semaine.id);
    } catch (error) {
      console.error('Erreur lors de la distribution automatique:', error);
    } finally {
      setIsDistributing(false);
    }
  };
  
  return (
    <div className={`semaine-row ${!isPublished ? 'unpublished' : ''}`}>
      <div className="semaine-info">
        <div className="semaine-dates">
          {formatDate(semaine.debut)} - {formatDate(semaine.fin)}
        </div>
        <div className="semaine-meta">
          {semaine.type === 'SPECIAL' && (
            <span className="semaine-special">{semaine.description}</span>
          )}
          {!isPublished && (
            <span className="unpublished-badge">🔒 Non publiée</span>
          )}
          {canAutoDistribute && (
            <button 
              onClick={handleAutoDistribute}
              disabled={isDistributing}
              className="auto-distribute-btn"
              title={`Remplir automatiquement ${freeClasses.length} classe(s) disponible(s)`}
            >
              {isDistributing ? '⏳' : '🎯'} Auto
            </button>
          )}
          {freeClasses.length === 0 && occupiedClasses.size > 0 && (
            <span className="all-occupied">✅ Complet</span>
          )}
        </div>
      </div>
      
      <div className="semaine-affectations">
        {classes.map(classe => (
          <AffectationCell
            key={`${semaine.id}-${classe.id}`}
            classe={classe}
            semaine={semaine}
            affectation={affectations.find(
              a => a.classeId === classe.id && a.semaineId === semaine.id
            )}
            onMove={onAffectationMove}
            onFamilleDrop={onFamilleDrop}
            onOverwriteRequest={onOverwriteRequest}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      <style jsx>{`
        .semaine-row {
          display: flex;
          border-bottom: 1px solid #eee;
          min-height: 80px;
          transition: all 0.2s;
        }

        .semaine-row.unpublished {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
        }

        .semaine-info {
          min-width: 180px;
          max-width: 180px;
          padding: 12px;
          background: #f8f9fa;
          border-right: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .semaine-dates {
          font-weight: 600;
          color: #333;
          font-size: 13px;
          line-height: 1.2;
        }

        .semaine-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .semaine-special {
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .unpublished-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .auto-distribute-btn {
          background: #28a745;
          color: white;
          border: none;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .auto-distribute-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }

        .auto-distribute-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .all-occupied {
          background: #d4edda;
          color: #155724;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .semaine-affectations {
          display: grid;
          grid-template-columns: repeat(${classes.length}, minmax(150px, 1fr));
          gap: 1px;
          flex: 1;
          background: #ddd;
          overflow-x: auto;
        }

        @media (max-width: 768px) {
          .semaine-info {
            min-width: 120px;
            max-width: 120px;
            padding: 8px;
          }

          .semaine-dates {
            font-size: 11px;
          }

          .semaine-affectations {
            grid-template-columns: repeat(${classes.length}, minmax(120px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .semaine-row {
            flex-direction: row; /* Gardons le layout horizontal même sur mobile */
            min-height: 70px;
          }

          .semaine-info {
            min-width: 100px;
            max-width: 100px;
            padding: 6px;
            font-size: 10px;
          }

          .semaine-dates {
            font-size: 10px;
            line-height: 1.1;
          }

          .semaine-affectations {
            grid-template-columns: repeat(${classes.length}, minmax(90px, 1fr));
            overflow-x: visible; /* Le scroll est géré par le parent */
          }

          .semaine-special,
          .unpublished-badge,
          .auto-distribute-btn,
          .all-occupied {
            font-size: 8px;
            padding: 1px 4px;
          }

          .auto-distribute-btn {
            padding: 2px 6px;
          }
        }
      `}</style>
    </div>
  );
} 