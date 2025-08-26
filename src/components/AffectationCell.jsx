import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { AddToCalendarIcon } from './AddToCalendarButton';

export function AffectationCell({ classe, semaine, affectation, realAffectation, onMove, onFamilleDrop, onOverwriteRequest, isAdmin, famille, filters }) {
  const [showTooltip, setShowTooltip] = useState(false);

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

  const isOutOfPreference = isAdmin && affectation && !isPreferredClass();

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
      className={`affectation-cell ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'drop-target' : ''} ${!realAffectation && isAdmin ? 'droppable' : ''} ${affectation ? '' : 'filtered-hidden'} ${isOutOfPreference ? 'out-of-preference' : ''}`}
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
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
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
          
          {showTooltip && window.innerWidth > 768 && (
            <div className="famille-nom-tooltip">
              <div className="tooltip-famille">{affectation.familleNom || 'Famille inconnue'}</div>
              {isAdmin && famille && famille.classes_preferences && famille.classes_preferences.length > 0 && (
                <div className="tooltip-preferences">
                  <strong>Préférences :</strong> {famille.classes_preferences.join(', ')}
                  {isOutOfPreference && (
                    <div className="tooltip-warning">⚠️ Hors préférences</div>
                  )}
                </div>
              )}
              {isAdmin && famille && (!famille.classes_preferences || famille.classes_preferences.length === 0) && (
                <div className="tooltip-no-prefs">Aucune préférence définie</div>
              )}
            </div>
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
          font-size: 11px;
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
          top: -70px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 10;
          min-width: 200px;
          text-align: center;
        }

        .tooltip-famille {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .tooltip-preferences {
          font-size: 10px;
          color: #e3f2fd;
          margin-bottom: 2px;
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
            display: none; /* Masquer les tooltips sur très petit écran */
          }
        }
      `}</style>
    </div>
  );
} 