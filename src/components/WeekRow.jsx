import React, { useState } from 'react';
import { AffectationCell } from './AffectationCell';
import { formatDate } from '../utils/dateUtils';
import { useToast } from './Toast';

export function WeekRow({ semaine, classes, affectations, onAffectationMove, onFamilleDrop, onOverwriteRequest, isAdmin, canEdit, onAutoDistribute, onTogglePublish }) {
  const isPublished = semaine.is_published;
  const [isDistributing, setIsDistributing] = useState(false);
  const toast = useToast();

  // Calculer combien de classes sont libres pour CETTE semaine
  const semaineAffectations = affectations.filter(a => a.semaineId === semaine.id);
  const occupiedClasses = new Set(semaineAffectations.map(a => a.classeId));
  const freeClasses = classes.filter(classe => !occupiedClasses.has(classe.id));
  const isComplete = freeClasses.length === 0 && classes.length > 0;
  const canAutoDistribute = canEdit && freeClasses.length > 0;

  const handleAutoDistribute = async () => {
    if (!canAutoDistribute || !onAutoDistribute) return;

    setIsDistributing(true);
    try {
      const result = await onAutoDistribute(semaine.id);
      if (result && result.success) {
        toast.success(`Distribution automatique réussie ! ${result.affectations_created || 0} affectation(s) créée(s)`);
      } else {
        toast.success('Distribution automatique réussie !');
      }
    } catch (error) {
      console.error('Erreur lors de la distribution automatique:', error);
      toast.error('Erreur lors de la distribution automatique');
    } finally {
      setIsDistributing(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!canEdit || !onTogglePublish) return;
    
    try {
      await onTogglePublish(semaine.id, !isPublished);
      const action = isPublished ? 'dépubliée' : 'publiée';
      toast.success(`Semaine ${action} avec succès !`);
    } catch (error) {
      console.error('Erreur lors du changement de publication:', error);
      toast.error('Erreur lors du changement de publication');
    }
  };
  
  return (
    <div className={`semaine-row ${!isPublished ? 'unpublished' : ''}`}>
      <div className="semaine-header">
        <div className="semaine-info">
          <div className="semaine-dates">
            {formatDate(semaine.debut)} - {formatDate(semaine.fin)}
            {semaine.type === 'SPECIAL' && (
              <span className="semaine-special">{semaine.description}</span>
            )}
          </div>
        </div>
        
        <div className="semaine-actions">
          {canEdit && (
            <button 
              onClick={handleTogglePublish}
              className={`publish-toggle-btn ${isPublished ? 'published' : 'unpublished'}`}
              title={isPublished ? 'Dépublier cette semaine' : 'Publier cette semaine'}
            >
              {isPublished ? '👁️ Publiée' : '🔒 Non publiée'}
            </button>
          )}
          {!canEdit && !isPublished && (
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
          {isAdmin && isComplete && (
            <span className="all-occupied">✅ Complet</span>
          )}
        </div>
      </div>
      
      <div className="semaine-affectations">
        {classes.map(classe => {
          const cellAffectation = affectations.find(
            a => a.classeId === classe.id && a.semaineId === semaine.id
          );
          
          return (
            <AffectationCell
              key={`${semaine.id}-${classe.id}-${cellAffectation?.id || 'empty'}-${cellAffectation?._refreshKey || ''}`}
              classe={classe}
              semaine={semaine}
              affectation={cellAffectation}
              onMove={onAffectationMove}
              onFamilleDrop={onFamilleDrop}
              onOverwriteRequest={onOverwriteRequest}
              isAdmin={isAdmin}
            />
          );
        })}
      </div>

      <style jsx>{`
        .semaine-row {
          display: flex;
          flex-direction: column;
          border-bottom: 1px solid #eee;
          min-height: 80px;
          transition: all 0.2s;
        }

        .semaine-row.unpublished {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
        }

        .semaine-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: #f8f9fa;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          min-height: 60px;
        }

        .semaine-info {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .semaine-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          background: #f8f9fa;
          padding: 4px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .semaine-dates {
          font-weight: 600;
          color: #333;
          font-size: 13px;
          line-height: 1.2;
        }



        .semaine-special {
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          margin-left: 8px;
        }

        .unpublished-badge {
          background: #ffc107;
          color: #212529;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
        }

        .publish-toggle-btn {
          border: none;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .publish-toggle-btn.published {
          background: #28a745;
          color: white;
        }

        .publish-toggle-btn.unpublished {
          background: #ffc107;
          color: #212529;
        }

        .publish-toggle-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

        @media (max-width: 768px) {
          .semaine-header {
            padding: 8px;
            min-height: 50px;
          }

          .semaine-actions {
            gap: 4px;
            padding: 2px;
          }

          .semaine-dates {
            font-size: 12px;
          }

          .semaine-special,
          .unpublished-badge,
          .publish-toggle-btn,
          .auto-distribute-btn,
          .all-occupied {
            font-size: 10px;
            padding: 2px 6px;
          }
        }

        @media (max-width: 480px) {
          .semaine-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
            padding: 8px;
          }

          .semaine-actions {
            justify-content: center;
            flex-wrap: wrap;
          }

          .semaine-affectations {
            grid-template-columns: repeat(${classes.length}, minmax(90px, 1fr));
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
} 