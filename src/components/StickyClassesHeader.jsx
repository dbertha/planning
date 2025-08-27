import React, { useState, useEffect, useRef } from 'react';

export function StickyClassesHeader({ classes, originalHeaderRef, sidebarCollapsed }) {
  const [isVisible, setIsVisible] = useState(false);
  const [gridPosition, setGridPosition] = useState({ left: 0, width: 0 });

  // Fonction pour mesurer la position de la grille originale
  const updateGridPosition = () => {
    if (!originalHeaderRef.current) return;
    
    const rect = originalHeaderRef.current.getBoundingClientRect();
    const scrollContainer = originalHeaderRef.current.closest('.planning-scroll-container');
    const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    
    setGridPosition({
      left: rect.left - scrollLeft, // Position ajustée selon le scroll horizontal
      width: rect.width
    });
  };

  useEffect(() => {
    if (!originalHeaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
        if (!entry.isIntersecting) {
          updateGridPosition(); // Mettre à jour la position quand visible
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
      }
    );

    observer.observe(originalHeaderRef.current);

    // Écouter le scroll horizontal
    const scrollContainer = originalHeaderRef.current.closest('.planning-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateGridPosition);
    }

    // Écouter le resize de la fenêtre
    window.addEventListener('resize', updateGridPosition);

    // Mise à jour initiale
    updateGridPosition();

    return () => {
      if (originalHeaderRef.current) {
        observer.unobserve(originalHeaderRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateGridPosition);
      }
      window.removeEventListener('resize', updateGridPosition);
    };
  }, [originalHeaderRef]);

  if (!isVisible) return null;

  return (
    <>
      <div className="sticky-classes-header">
        <div className="classes-header-grid">
          {classes.map(classe => (
            <div 
              key={classe.id} 
              className="classe-header"
              style={{ backgroundColor: classe.couleur }}
            >
              <div className="classe-nom">{classe.nom}</div>
              {classe.instructions_pdf_url && (
                <a 
                  href={classe.instructions_pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pdf-instructions"
                  title="Instructions de nettoyage (PDF)"
                >
                  📄
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .sticky-classes-header {
          position: fixed;
          top: 64px; /* Sous le ViewSelector - compense ses 16px de margin-bottom */
          left: ${gridPosition.left}px; /* Position exacte de la grille */
          width: ${gridPosition.width}px; /* Largeur exacte de la grille */
          z-index: 70;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
          backdrop-filter: blur(8px);
          animation: slideDown 0.3s ease-out;
          overflow: hidden; /* Pour gérer le scroll horizontal */
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .classes-header-grid {
          display: grid;
          grid-template-columns: repeat(${classes.length}, minmax(150px, 1fr));
          gap: 1px;
          background: #ddd;
          width: 100%; /* Prend toute la largeur du conteneur */
          box-sizing: border-box;
        }

        .classe-header {
          padding: 8px 4px;
          color: white;
          font-weight: 600;
          text-align: center;
          min-height: 70px;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
          position: relative;
          box-sizing: border-box;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .classe-nom {
          line-height: 1.2;
          word-wrap: break-word;
          hyphens: auto;
        }

        .pdf-instructions {
          font-size: 12px;
          text-decoration: none;
          opacity: 0.9;
          transition: opacity 0.2s;
        }

        .pdf-instructions:hover {
          opacity: 1;
          transform: scale(1.1);
        }


      `}</style>
    </>
  );
}
