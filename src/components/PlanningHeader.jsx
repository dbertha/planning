import React from 'react';

export function PlanningHeader({ classes }) {
  return (
    <div className="planning-header">
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

      <style jsx>{`
        .planning-header {
          display: grid;
          grid-template-columns: repeat(${classes.length}, minmax(150px, 1fr));
          gap: 1px;
          background: #ddd;
          border-radius: 6px 6px 0 0;
          overflow-x: auto;
          overflow-y: hidden;
          min-width: 100%;
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
    </div>
  );
} 