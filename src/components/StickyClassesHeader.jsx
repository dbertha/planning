import React, { useState, useEffect, useRef } from 'react';


export function StickyClassesHeader({ classes, originalHeaderRef, sidebarCollapsed }) {
  const [isVisible, setIsVisible] = useState(false);
  const [gridPosition, setGridPosition] = useState({ left: 0, width: 0 });
  const [gridWidth, setGridWidth] = useState(0);
  const wrapperRef = useRef(null);



  // Fonction pour mesurer la position de la grille originale
  const updateGridPosition = () => {
    if (!originalHeaderRef.current) return;
    
    const scrollContainer = originalHeaderRef.current.closest('.planning-scroll-container');
    
    if (!scrollContainer) return;
    
    // Position du conteneur de scroll par rapport à la viewport
    const containerRect = scrollContainer.getBoundingClientRect();
    const scrollLeft = scrollContainer.scrollLeft;
    
    // Mesurer la largeur réelle de la grille originale
    const gridWrapper = scrollContainer.querySelector('.planning-grid-wrapper');
    const actualGridWidth = gridWrapper ? gridWrapper.offsetWidth : 0;
    
    setGridPosition({
      left: containerRect.left, // Position fixe du conteneur
      width: containerRect.width // Largeur visible du conteneur
    });
    
    setGridWidth(actualGridWidth);
    
    // Mise à jour directe du DOM pour éviter les re-renders
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `translateX(-${scrollLeft}px)`;
    }
  };

  useEffect(() => {
    if (!originalHeaderRef.current) return;

    let gridIntersecting = false;

    const checkVisibility = () => {
      if (!originalHeaderRef.current) return;

      // Calculer les positions précises
      const viewSelector = document.querySelector('.view-selector');
      const originalHeader = originalHeaderRef.current;
      
      if (!viewSelector || !originalHeader) return;

      const viewSelectorRect = viewSelector.getBoundingClientRect();
      const originalHeaderRect = originalHeader.getBoundingClientRect();
      
      // Le sticky header doit apparaître quand l'en-tête original
      // passe sous le ViewSelector sticky (position top = viewSelectorHeight)
      const viewSelectorBottom = viewSelectorRect.bottom;
      const originalHeaderTop = originalHeaderRect.top;
      
      // Afficher le sticky si l'en-tête original est caché par le ViewSelector
      // ET si la grille est visible
      const headerHiddenBySticky = originalHeaderTop <= viewSelectorBottom;
      const shouldShow = headerHiddenBySticky && gridIntersecting;
      
      if (shouldShow !== isVisible) {
        setIsVisible(shouldShow);
        if (shouldShow) {
          updateGridPosition();
        }
      }
    };

    // Observer pour la grille de planning (pour s'assurer qu'elle est visible)
    const gridContainer = originalHeaderRef.current.closest('.planning-container')?.querySelector('.planning-grid-wrapper');
    let gridObserver = null;
    
    if (gridContainer) {
      gridObserver = new IntersectionObserver(
        ([entry]) => {
          gridIntersecting = entry.isIntersecting;
          checkVisibility();
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0
        }
      );
      gridObserver.observe(gridContainer);
    }

    // Écouter le scroll pour vérification en temps réel
    const handleScroll = () => {
      checkVisibility();
    };

    // Écouter le scroll horizontal et repositionner l'en-tête sticky
    const scrollContainer = originalHeaderRef.current.closest('.planning-scroll-container');
    
    const syncPosition = (event) => {
      // Mise à jour directe du DOM sans re-render
      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translateX(-${event.target.scrollLeft}px)`;
      }
    };
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', syncPosition, { passive: true });
    }

    // Écouter le scroll vertical global
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Écouter le resize de la fenêtre
    window.addEventListener('resize', () => {
      updateGridPosition();
      checkVisibility();
    });

    // Vérification initiale
    setTimeout(checkVisibility, 100); // Petit délai pour s'assurer que tout est rendu

    return () => {
      if (gridObserver) {
        gridObserver.disconnect();
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', syncPosition);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateGridPosition);
    };
  }, [originalHeaderRef, sidebarCollapsed, isVisible]);

  // Mise à jour supplémentaire quand la sidebar change (avec délai pour la transition)
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      updateGridPosition();
    }, 350); // Attendre la fin de la transition CSS

    return () => clearTimeout(timer);
  }, [sidebarCollapsed, isVisible]);

  // Synchronisation initiale du scroll quand l'en-tête devient visible
  useEffect(() => {
    if (isVisible && wrapperRef.current && originalHeaderRef.current) {
      const scrollContainer = originalHeaderRef.current.closest('.planning-scroll-container');
      if (scrollContainer) {
        wrapperRef.current.style.transform = `translateX(-${scrollContainer.scrollLeft}px)`;
      }
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div className="sticky-classes-header">
        <div ref={wrapperRef} className="sticky-classes-wrapper">
          <div className="classes-header-grid">
            {classes.map(classe => (
              <div 
                key={classe.id} 
                className="classe-header"
                style={{ backgroundColor: classe.couleur }}
                title={classe.description ? `${classe.nom}: ${classe.description}` : classe.nom}
              >
                <div className="classe-nom">{classe.nom}</div>
                {classe.description && (
                  <div className="classe-description">{classe.description}</div>
                )}
                {classe.instructions_pdf_url && (
                  <a 
                    href={classe.instructions_pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="pdf-instructions"
                    title="Instructions de nettoyage (PDF)"
                  >
                    📋
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .sticky-classes-header {
          position: fixed;
          top: var(--view-selector-height, 80px); /* Position dynamique sous le ViewSelector sticky */
          left: ${gridPosition.left}px; /* Position du conteneur de scroll */
          width: ${gridPosition.width}px; /* Largeur du conteneur visible */
          z-index: 65;
          box-shadow: 0 2px 8px rgba(116, 196, 66, 0.15);
          background: var(--color-bg-card);
          backdrop-filter: blur(12px);
          animation: slideDown 0.3s ease-out;
          overflow: hidden; /* Masquer les parties qui dépassent */
          border-bottom: 2px solid rgba(116, 196, 66, 0.2);
        }
        
        .sticky-classes-wrapper {
          width: ${gridWidth || (classes.length * 150 + 120)}px; /* Largeur mesurée ou calculée */
          transform: translateX(0px); /* Sera mis à jour via DOM direct */
          flex-shrink: 0; /* Empêcher la compression */
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
          grid-template-columns: repeat(${classes.length}, 1fr);
          gap: 2px;
          background: var(--color-bg-light);
          width: 100%; /* Prend toute la largeur du wrapper */
          box-sizing: border-box;
          padding: 2px;
        }

        .classe-header {
          padding: 8px 6px;
          color: var(--color-text-primary);
          font-weight: var(--font-weight-medium);
          text-align: center;
          min-height: 60px;
          min-width: 150px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
          position: relative;
          box-sizing: border-box;
          border-radius: var(--border-radius-small);
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          margin: 2px;
        }


        .classe-nom {
          line-height: 1.2;
          word-wrap: break-word;
          hyphens: auto;
          font-size: 12px;
          font-weight: var(--font-weight-bold);
        }

        .classe-description {
          font-size: 9px;
          line-height: 1.1;
          color: var(--color-text-secondary);
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          margin-top: 1px;
          font-weight: var(--font-weight-normal);
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
