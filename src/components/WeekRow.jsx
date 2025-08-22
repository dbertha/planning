import React from 'react';
import { AffectationCell } from './AffectationCell';
import { formatDate } from '../utils/dateUtils';

export function WeekRow({ semaine, classes, affectations, onAffectationMove }) {
  return (
    <div className="semaine-row">
      <div className="semaine-dates">
        {formatDate(semaine.debut)} - {formatDate(semaine.fin)}
        {semaine.type === 'SPECIAL' && (
          <div className="semaine-special">{semaine.description}</div>
        )}
      </div>
      <div className="semaine-affectations">
        {classes.map(classe => (
          <AffectationCell
            key={`${semaine.id}-${classe.id}`}
            classe={classe}
            semaine={semaine}
            affectation={affectations.find(
              a => a.classeId === classe.id && a.semaineId === semaine.id
            )}
            onMove={onAffectationMove}
          />
        ))}
      </div>
    </div>
  );
} 