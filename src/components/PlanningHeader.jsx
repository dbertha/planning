import React, { forwardRef } from 'react';


export const PlanningHeader = forwardRef(({ classes }, ref) => {
  return (
    <>
      <div ref={ref} className="classes-header">
        {/* Colonnes des classes */}
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

      <style jsx>{`
        .classes-header {
          background: var(--color-bg-card);
          border-radius: var(--border-radius-small) var(--border-radius-small) 0 0;
          overflow: hidden;
        }
        
        .classes-header-grid {
          display: grid;
          grid-template-columns: repeat(${classes.length}, 1fr);
          gap: 2px;
          background: var(--color-bg-light);
          width: 100%;
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
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
          white-space: nowrap;
          overflow: hidden;
          box-sizing: border-box;
          border-radius: var(--border-radius-small);
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }

        .classe-header:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-light);
        }


        .classe-nom {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 1.2;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
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
          color: var(--color-text-primary);
          text-decoration: none;
          font-size: 16px;
          opacity: 0.8;
          transition: all 0.2s ease;
          padding: 4px;
          border-radius: var(--border-radius-small);
          position: absolute;
          top: 4px;
          right: 4px;
        }

        .pdf-instructions:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.15);
        }

        @media (max-width: 768px) {
          .classe-header {
            padding: 10px 6px;
            min-height: 60px;
            font-size: 12px;
            gap: 4px;
          }


          .classe-nom {
            font-size: 11px;
          }

          .classe-description {
            font-size: 9px;
          }
          
          .pdf-instructions {
            font-size: 14px;
            top: 2px;
            right: 2px;
            padding: 2px;
          }
        }
      `}</style>
    </>
  );
}); 