import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export function AffectationCell({ classe, semaine, affectation, onMove, onFamilleDrop, onOverwriteRequest, isAdmin }) {
  const [showTooltip, setShowTooltip] = useState(false);

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
      if (item.type === 'famille' && !affectation) {
        // Drop d'une famille sur une cellule vide
        onFamilleDrop(item.id, classe.id, semaine.id);
      } else if (item.type === 'famille' && affectation) {
        // Drop d'une famille sur une cellule occupée - demander confirmation
        onOverwriteRequest(item, affectation, classe, semaine);
      } else if (affectation && item.affectation) {
        // Drop d'une affectation sur une autre (échange)
        onMove(item, { affectation, classe, semaine });
      }
    },
    canDrop: (item) => {
      if (item.type === 'famille') {
        return isAdmin; // Accepter famille sur cellule vide OU occupée en mode admin
      }
      return isAdmin && affectation && item.affectation; // Échange d'affectations
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
      className={`affectation-cell ${isDragging ? 'dragging' : ''} ${isOver && canDrop ? 'drop-target' : ''} ${!affectation && isAdmin ? 'droppable' : ''}`}
      style={{ 
        backgroundColor: classe.couleur + '40',
        opacity: isDragging ? 0.5 : 1,
      }}
      data-classe={`Partie ${classe.id}`}
    >
      {affectation && (
        <>
          <div 
            className="famille-nom"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {truncateText(affectation.familleNom || 'Famille inconnue', window.innerWidth <= 768 ? 30 : 20)}
          </div>
          {showTooltip && window.innerWidth > 768 && (
            <div className="famille-nom-tooltip">
              {affectation.familleNom || 'Famille inconnue'}
            </div>
          )}
          {affectation.numeroNettoyage && (
            <div className="nettoyage-numero">#{affectation.numeroNettoyage}</div>
          )}
        </>
      )}
      
      {/* Indicateur de zone de drop pour cellules vides en mode admin */}
      {!affectation && isAdmin && (
        <div className="drop-placeholder">
          Glisser une famille ici
        </div>
      )}

      <style jsx>{`
        .affectation-cell {
          min-height: 80px;
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
          border-style: dashed;
          border-color: #007bff;
        }

        .affectation-cell.drop-target {
          border-color: #28a745;
          background-color: rgba(40, 167, 69, 0.1) !important;
          transform: scale(1.02);
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
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          white-space: nowrap;
          z-index: 10;
        }

        .nettoyage-numero {
          font-size: 10px;
          color: #666;
          font-weight: 500;
        }

        .drop-placeholder {
          color: #007bff;
          font-size: 11px;
          text-align: center;
          opacity: 0.7;
          font-style: italic;
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