import React from 'react';

export function PlanningHeader({ classes }) {
  return (
    <>
      <div className="planning-header">
        {/* Colonnes des classes */}
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
        .planning-header {
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
        }
        
        .classes-header-grid {
          display: grid;
          grid-template-columns: repeat(${classes.length}, minmax(150px, 1fr));
          gap: 1px;
          background: #ddd;
          width: 100%;
          box-sizing: border-box;
        }

        .classe-header {
          padding: 8px 4px;
          color: #333;
          font-weight: 600;
          text-align: center;
          min-height: 70px;
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
        }

        .classe-nom {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          line-height: 1.3;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .pdf-instructions {
          color: #333;
          text-decoration: none;
          font-size: 16px;
          opacity: 0.8;
          transition: all 0.2s;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .pdf-instructions:hover {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .classe-header {
            padding: 8px;
            min-height: 50px;
            font-size: 12px;
          }
          
          .pdf-instructions {
            font-size: 14px;
          }
        }
      `}</style>
    </>
  );
} 