import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useDrag, useDrop } from 'react-dnd';
import { AddToCalendarIcon } from './AddToCalendarButton';

export function AffectationCell({ classe, semaine, affectation, realAffectation, onMove, onFamilleDrop, onOverwriteRequest, isAdmin, famille, filters }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Vérifier si l'affectation correspond aux préférences de la famille
  const isPreferredClass = () => {
    if (!affectation || !famille || !famille.classes_preferences) {
      return true; // Par défaut, on considère que c'est OK si pas d'info
    }
    
    // Si la famille n'a pas de préférences définies, c'est OK
    if (!famille.classes_preferences.length) {
      return true;
    }
    
    // Vérifier si la classe de l'affectation est dans les préférences
    return famille.classes_preferences.includes(classe.id);
  };

  // Vérifier si l'affectation viole une exclusion temporelle de la famille
  const violatesExclusion = () => {
    if (!affectation || !famille || !famille.exclusions || !semaine) {
      return false; // Pas d'info d'exclusion disponible
    }

    const semaineStart = new Date(semaine.debut);
    const semaineEnd = new Date(semaine.fin);

    return famille.exclusions.some(exclusion => {
      const exclusionStart = new Date(exclusion.date_debut);
      const exclusionEnd = new Date(exclusion.date_fin);
      
      // Vérifier s'il y a un chevauchement entre la semaine et l'exclusion
      return (
        (exclusionStart <= semaineStart && exclusionEnd >= semaineStart) ||
        (exclusionStart <= semaineEnd && exclusionEnd >= semaineEnd) ||
        (exclusionStart >= semaineStart && exclusionEnd <= semaineEnd)
      );
    });
  };

  const isOutOfPreference = isAdmin && affectation && !isPreferredClass();
  const hasExclusionViolation = isAdmin && affectation && violatesExclusion();

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'affectation',
    item: { affectation, classe, semaine },
    canDrag: () => {
      const canDragResult = isAdmin && affectation;
      // Debug: Log pour nouvelles affectations
      if (affectation && affectation._refreshKey) {
        console.log(`🔍 Nouvelle affectation draggable?`, {
          id: affectation.id,
          famille: affectation.familleNom,
          canDrag: canDragResult,
          isAdmin,
          hasAffectation: !!affectation
        });
      }
      return canDragResult;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['affectation', 'famille'],
    drop: (item) => {
      if (item.type === 'famille' && !realAffectation) {
        // Drop d'une famille sur une cellule vraiment vide
        onFamilleDrop(item.id, classe.id, semaine.id);
      } else if (item.type === 'famille' && realAffectation) {
        // Drop d'une famille sur une cellule occupée - demander confirmation
        onOverwriteRequest(item, realAffectation, classe, semaine);
      } else if (item.affectation && realAffectation) {
        // Drop d'une affectation sur une autre (échange)
        onMove(item, { affectation: realAffectation, classe, semaine });
      } else if (item.affectation && !realAffectation) {
        // Drop d'une affectation sur une cellule vide (déplacement)
        onMove(item, { affectation: null, classe, semaine });
      }
    },
    canDrop: (item) => {
      if (item.type === 'famille') {
        return isAdmin; // Accepter famille sur cellule vide OU occupée en mode admin
      }
      return isAdmin && item.affectation; // Accepter affectation sur cellule vide OU occupée
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  // Fonction pour tronquer le texte si nécessaire
  const truncateText = (text, maxLength = 20) => {
    if (text.length <= maxLength) return text;
    
    // Cherche le dernier espace avant maxLength
    const lastSpace = text.lastIndexOf(' ', maxLength);
    if (lastSpace === -1) return text.slice(0, maxLength) + '...';
    
    return text.slice(0, lastSpace) + '...';
  };

  return (
    <div 
      ref={(node) => {
        if (isAdmin) {
          drag(drop(node));
        } else {
          drop(node);
        }
      }}
              className={`affectation-cell ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'drop-target' : ''} ${!realAffectation && isAdmin ? 'droppable' : ''} ${affectation ? '' : 'filtered-hidden'} ${isOutOfPreference ? 'out-of-preference' : ''} ${hasExclusionViolation ? 'exclusion-violation' : ''}`}
      style={{ 
        backgroundColor: classe.couleur + '40',
        opacity: isDragging ? 0.5 : 1,
      }}
      data-classe={`Partie ${classe.id}`}
    >
      {affectation && (
        <>
          <div className="affectation-content">
            <div 
              className="famille-nom"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({
                  x: rect.left + rect.width / 2,
                  y: rect.top - 10
                });
                setShowTooltip(true);
              }}
              onMouseLeave={() => {
                setShowTooltip(false);
              }}
            >
              {truncateText(affectation.familleNom || 'Famille inconnue', window.innerWidth <= 768 ? 30 : 20)}
            </div>
            
            <div className="bottom-info">
              {affectation.numeroNettoyage && (
                <div className="nettoyage-numero">#{affectation.numeroNettoyage}</div>
              )}
              
              {/* Bouton calendrier - affiché en mode public pour la famille recherchée */}
              {!isAdmin && famille && filters?.search && (
                affectation?.familleNom?.toLowerCase().includes(filters.search.toLowerCase()) || 
                filters.search.toLowerCase().includes(affectation?.familleNom?.toLowerCase())
              ) && (
                <div className="calendar-actions">
                  <AddToCalendarIcon 
                    affectation={affectation}
                    semaine={semaine}
                    classe={classe}
                    famille={famille}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Tooltip via Portal */}
          {showTooltip && ReactDOM.createPortal(
            <div 
              className="famille-nom-tooltip-portal" 
              style={{
                position: 'fixed',
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
                transform: 'translateX(-50%)',
                zIndex: 10000,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                color: '#333',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                minWidth: '200px',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                pointerEvents: 'none',
                backdropFilter: 'blur(8px)'
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px', color: '#2c3e50' }}>
                {affectation.familleNom || 'Famille inconnue'}
              </div>
              {isAdmin && famille && famille.classes_preferences && famille.classes_preferences.length > 0 && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#6c757d' }}>
                  <strong style={{ color: '#495057' }}>Préférences :</strong> {famille.classes_preferences.join(', ')}
                  {isOutOfPreference && (
                    <div style={{ color: '#e67e22', fontWeight: 600, marginTop: '4px' }}>⚠️ Hors préférences</div>
                  )}
                </div>
              )}
              {isAdmin && famille && (!famille.classes_preferences || famille.classes_preferences.length === 0) && (
                <div style={{ fontStyle: 'italic', color: '#adb5bd', fontSize: '11px' }}>Aucune préférence définie</div>
              )}
              {isAdmin && hasExclusionViolation && famille && famille.exclusions && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: '#dc3545' }}>
                  <strong style={{ color: '#c62828' }}>🚫 Exclusion temporelle :</strong>
                  {famille.exclusions
                    .filter(exclusion => {
                      const exclusionStart = new Date(exclusion.date_debut);
                      const exclusionEnd = new Date(exclusion.date_fin);
                      const semaineStart = new Date(semaine.debut);
                      const semaineEnd = new Date(semaine.fin);
                      return (
                        (exclusionStart <= semaineStart && exclusionEnd >= semaineStart) ||
                        (exclusionStart <= semaineEnd && exclusionEnd >= semaineEnd) ||
                        (exclusionStart >= semaineStart && exclusionEnd <= semaineEnd)
                      );
                    })
                    .map((exclusion, index) => (
                      <div key={index} style={{ marginTop: '2px', fontSize: '10px' }}>
                        {new Date(exclusion.date_debut).toLocaleDateString()} - {new Date(exclusion.date_fin).toLocaleDateString()}
                        {exclusion.type && ` (${exclusion.type})`}
                      </div>
                    ))
                  }
                </div>
              )}
            </div>,
            document.body
          )}
        </>
      )}
      
      {/* Indicateur de zone de drop pour cellules vraiment vides en mode admin */}
      {!realAffectation && isAdmin && (
        <div className="drop-placeholder">
          Glisser une famille ici
        </div>
      )}
      
      {/* Indicateur pour cellules filtrées mais occupées */}
      {!affectation && realAffectation && isAdmin && (
        <div className="filtered-placeholder">
          👁️‍🗨️ Masquée par filtre<br/>
          <small>Cellule occupée</small>
        </div>
      )}

      <style jsx>{`
        .affectation-cell {
          min-height: 80px;
          position: relative;
          min-width: 150px;
          background: white;
          border: none;
          border-radius: 0;
          padding: 6px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          transition: all 0.2s;
          cursor: ${isAdmin && affectation ? 'grab' : 'default'};
          box-sizing: border-box;
          overflow: visible;
        }

        .affectation-cell.droppable {
          border: 2px dashed #007bff;
          background: rgba(0, 123, 255, 0.1);
        }

        .affectation-cell.drop-target {
          border: 2px solid #28a745 !important;
          background-color: rgba(40, 167, 69, 0.1) !important;
          transform: scale(1.02);
          transition: all 0.2s ease;
        }

        .affectation-cell.dragging {
          transform: rotate(5deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .famille-nom {
          font-weight: 600;
          font-size: 15px;
          text-align: center;
          color: #333;
          margin-bottom: 4px;
          position: relative;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .famille-nom-tooltip {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.95);
          color: white;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          min-width: 200px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          pointer-events: none;
        }

        .famille-nom-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: rgba(0, 0, 0, 0.95);
        }

        .tooltip-famille {
          font-weight: 600;
          margin-bottom: 6px;
          font-size: 13px;
        }

        .tooltip-preferences {
          margin-top: 6px;
          font-size: 11px;
          opacity: 0.9;
        }

        .tooltip-warning {
          color: #ff9800;
          font-weight: 600;
          margin-top: 4px;
        }

        .tooltip-no-prefs {
          font-style: italic;
          opacity: 0.7;
          font-size: 11px;
        }

        .tooltip-warning {
          color: #ffab91;
          font-weight: 600;
          margin-top: 2px;
        }

        .tooltip-no-prefs {
          font-size: 10px;
          color: #bdbdbd;
          font-style: italic;
        }

        .affectation-content {
          flex: 1;
        }

        .bottom-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .nettoyage-numero {
          font-size: 10px;
          color: #666;
          font-weight: 500;
        }

        .calendar-actions {
          display: inline-flex;
        }

        .drop-placeholder {
          color: #007bff;
          font-size: 11px;
          text-align: center;
          opacity: 0.7;
          font-style: italic;
        }

        .filtered-placeholder {
          color: #6c757d;
          font-size: 10px;
          text-align: center;
          font-weight: 500;
          font-style: italic;
          background: rgba(248, 249, 250, 0.9);
          padding: 4px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
        }

        .affectation-cell.filtered-hidden {
          border: 2px solid #dee2e6 !important;
          background-color: rgba(248, 249, 250, 0.8) !important;
          opacity: 0.7;
        }

        .affectation-cell.out-of-preference {
          border: 2px solid #fd7e14 !important;
          background: linear-gradient(135deg, 
            rgba(255, 193, 7, 0.15), 
            rgba(253, 126, 20, 0.15)
          ) !important;
          position: relative;
        }

        .affectation-cell.out-of-preference::before {
          content: "⚠️";
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 12px;
          z-index: 10;
          background: rgba(253, 126, 20, 0.9);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .affectation-cell.out-of-preference .famille-nom {
          color: #e8590c !important;
          font-weight: 600;
        }

        /* Styles pour les violations d'exclusion temporelle */
        .affectation-cell.exclusion-violation {
          border: 2px solid #dc3545 !important;
          background: linear-gradient(135deg, 
            rgba(220, 53, 69, 0.15), 
            rgba(248, 215, 218, 0.15)
          ) !important;
          position: relative;
        }

        .affectation-cell.exclusion-violation::before {
          content: "🚫";
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 12px;
          z-index: 10;
          background: rgba(220, 53, 69, 0.9);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .affectation-cell.exclusion-violation .famille-nom {
          color: #c62828 !important;
          font-weight: 600;
        }

        /* Cas spécial : violation d'exclusion ET hors préférences */
        .affectation-cell.exclusion-violation.out-of-preference {
          border: 2px solid #8e24aa !important;
          background: linear-gradient(135deg, 
            rgba(142, 36, 170, 0.15), 
            rgba(225, 190, 231, 0.15)
          ) !important;
        }

        .affectation-cell.exclusion-violation.out-of-preference::before {
          content: "⛔";
          background: rgba(142, 36, 170, 0.9);
        }

        .affectation-cell.exclusion-violation.out-of-preference .famille-nom {
          color: #6a1b9a !important;
        }

        @media (max-width: 768px) {
          .affectation-cell {
            min-height: 70px;
            min-width: 120px;
            padding: 4px;
          }
          
          .famille-nom {
            font-size: 10px;
          }
          
          .nettoyage-numero {
            font-size: 8px;
          }



          .drop-placeholder {
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .affectation-cell {
            min-height: 60px;
            min-width: 90px;
            padding: 3px;
          }
          
          .famille-nom {
            font-size: 9px;
            line-height: 1.1;
          }
          
          .nettoyage-numero {
            font-size: 7px;
          }

          .drop-placeholder {
            font-size: 8px;
          }

          .famille-nom-tooltip {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 280px;
            max-width: 90vw;
            white-space: normal;
            text-align: left;
            z-index: 9999;
          }

          .famille-nom-tooltip::after {
            display: none;
          }
        }
      `}</style>
    </div>
  );
} 