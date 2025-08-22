import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export function AffectationCell({ classe, semaine, affectation, onMove }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'affectation',
    item: { affectation, classe, semaine },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'affectation',
    drop: (item) => {
      if (affectation && item.affectation) {
        onMove(item, { affectation, classe, semaine });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
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
        drag(drop(node));
      }}
      className={`affectation-cell ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
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
            {truncateText(affectation.famille, window.innerWidth <= 768 ? 30 : 20)}
          </div>
          {showTooltip && window.innerWidth > 768 && (
            <div className="famille-nom-tooltip">
              {affectation.famille}
            </div>
          )}
          <div className="nettoyage-numero">#{affectation.numeroNettoyage}</div>
        </>
      )}
    </div>
  );
} 