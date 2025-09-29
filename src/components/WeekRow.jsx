import React, { useState } from 'react';
import { AffectationCell } from './AffectationCell';
import { formatDate, getCleaningDates } from '../utils/dateUtils';
import { useToast } from './Toast';

export function WeekRow({ semaine, classes, familles, affectations, allAffectations, filters, onAffectationMove, onFamilleDrop, onOverwriteRequest, isAdmin, canEdit, onAutoDistribute, onTogglePublish, nextSemaine }) {
  const isPublished = semaine.is_published;
  const [isDistributing, setIsDistributing] = useState(false);
  const toast = useToast();

  // Calculer combien de classes sont libres pour CETTE semaine (utiliser toutes les affectations)
  // Ajouter un identifiant unique pour forcer le re-calcul quand les données changent
  const realSemaineAffectations = allAffectations ? 
    allAffectations.filter(a => a.semaineId === semaine.id) :
    affectations.filter(a => a.semaineId === semaine.id);
  const occupiedClasses = new Set(realSemaineAffectations.map(a => a.classeId));
  const freeClasses = classes.filter(classe => !occupiedClasses.has(classe.id));
  const isComplete = freeClasses.length === 0 && classes.length > 0;
  const canAutoDistribute = canEdit && freeClasses.length > 0;

  // Debug pour vérifier les données
  console.log(`📊 WeekRow ${semaine.id}: ${realSemaineAffectations.length} affectations, ${freeClasses.length} classes libres`);

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
    <div 
      className={`semaine-row ${!isPublished ? 'unpublished' : ''}`}
      id={`week-${semaine.id}`}
    >
      {/* Colonne fixe avec informations et actions */}
      <div className="semaine-sidebar">
        <div className="semaine-info">
          <div className="semaine-dates">
            {(() => {
              const cleaningDates = getCleaningDates(semaine, nextSemaine);
              return `${cleaningDates.debutFormatted} - ${cleaningDates.finFormatted}`;
            })()}
          </div>
          {semaine.type === 'SPECIAL' && (
            <div className="semaine-special">{semaine.description}</div>
          )}
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
      
      {/* Zone scrollable avec affectations */}
      <div className="semaine-affectations">
        {classes.map(classe => {
          // Affectation filtrée à afficher
          const cellAffectation = affectations.find(
            a => a.classeId === classe.id && a.semaineId === semaine.id
          );
          
          // Affectation réelle (non-filtrée) pour déterminer si la cellule est occupée
          const realAffectation = allAffectations ? allAffectations.find(
            a => a.classeId === classe.id && a.semaineId === semaine.id
          ) : cellAffectation;
          
          // Trouver la famille correspondante à l'affectation
          let famille = cellAffectation && familles ? familles.find(
            f => f.id === cellAffectation.familleId
          ) : null;
          

          

          // Si famille non trouvée, créer un objet temporaire pour le calendrier
          if (cellAffectation && !famille && cellAffectation.familleNom) {
            famille = {
              id: cellAffectation.familleId,
              nom: cellAffectation.familleNom,
              email: '',
              telephone: ''
            };
          }
          

          return (
            <AffectationCell
              key={`${semaine.id}-${classe.id}-${cellAffectation?.id || realAffectation?.id || 'empty'}-${cellAffectation?._refreshKey || ''}`}
              classe={classe}
              semaine={semaine}
              affectation={cellAffectation}
              realAffectation={realAffectation}
              famille={famille}
              filters={filters}
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
          border-bottom: 1px solid #eee;
          min-height: 80px;
          transition: all 0.2s;
        }

        .semaine-row.unpublished {
          background: #fff9e6;
          border-left: 4px solid #ffc107;
        }

        .semaine-sidebar {
          width: 320px;
          min-width: 320px;
          background: #f8f9fa;
          border-right: 1px solid #ddd;
          padding: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          position: sticky;
          left: 0;
          z-index: 5;
          min-height: 40px;
        }

        .semaine-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .semaine-actions {
          display: flex;
          flex-direction: row;
          gap: 4px;
          align-items: center;
          flex-shrink: 0;
        }

        .semaine-dates {
          font-weight: 600;
          color: #333;
          font-size: 11px;
          line-height: 1.1;
          text-align: left;
          background: rgba(255, 255, 255, 0.6);
          padding: 3px 6px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          white-space: nowrap;
        }



        .semaine-special {
          background: #e7f3ff;
          color: #0066cc;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
          width: 100%;
          border: 1px solid rgba(0, 102, 204, 0.2);
          margin-top: 2px;
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
          border-radius: 4px;
          padding: 4px 6px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          white-space: nowrap;
          min-width: 70px;
        }

        .publish-toggle-btn.published {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
        }

        .publish-toggle-btn.unpublished {
          background: linear-gradient(135deg, #ffc107, #fd7e14);
          color: #212529;
          box-shadow: 0 2px 4px rgba(255, 193, 7, 0.2);
        }

        .publish-toggle-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .auto-distribute-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.2);
          white-space: nowrap;
          min-width: 50px;
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
          border-radius: 3px;
          font-size: 10px;
          font-weight: 500;
          text-align: center;
          white-space: nowrap;
          min-width: 50px;
        }

        .semaine-affectations {
          display: grid;
          grid-template-columns: repeat(${classes.length}, minmax(150px, 1fr));
          gap: 4px;
          flex: 1;
          background: var(--color-bg-light);
          overflow-x: auto;
          box-sizing: border-box;
          padding: 4px;
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