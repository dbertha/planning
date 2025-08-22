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
          {classe.nom}
        </div>
      ))}
    </div>
  );
} 