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

    let headerIntersecting = true;
    let gridIntersecting = false;

    const checkVisibility = () => {
      // Afficher sticky seulement si l'en-tête original n'est pas visible ET la grille est visible
      const shouldShow = !headerIntersecting && gridIntersecting;
      
      setIsVisible(shouldShow);
      if (shouldShow) {
        updateGridPosition();
      }
    };

    // Observer pour l'en-tête original
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        headerIntersecting = entry.isIntersecting;
        checkVisibility();
      },
      {
        root: null,
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0
      }
    );

    // Observer pour la grille de planning
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

    headerObserver.observe(originalHeaderRef.current);

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

    // Écouter le resize de la fenêtre
    window.addEventListener('resize', updateGridPosition);

    // Mise à jour initiale
    updateGridPosition();

    return () => {
      headerObserver.disconnect();
      if (gridObserver) {
        gridObserver.disconnect();
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', syncPosition);
      }
      window.removeEventListener('resize', updateGridPosition);
    };
  }, [originalHeaderRef, sidebarCollapsed]);

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
      </div>

      <style jsx>{`
        .sticky-classes-header {
          position: fixed;
          top: 64px; /* Sous le ViewSelector - compense ses 16px de margin-bottom */
          left: ${gridPosition.left}px; /* Position du conteneur de scroll */
          width: ${gridPosition.width}px; /* Largeur du conteneur visible */
          z-index: 70;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
          backdrop-filter: blur(8px);
          animation: slideDown 0.3s ease-out;
          overflow: hidden; /* Masquer les parties qui dépassent */
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
          gap: 1px;
          background: #ddd;
          width: 100%; /* Prend toute la largeur du wrapper */
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
