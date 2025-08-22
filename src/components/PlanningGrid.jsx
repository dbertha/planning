import React, { useState } from 'react';
import { WeekRow } from './WeekRow';
import { useAffectations } from '../hooks/useAffectations';
import { ConfirmationPopup } from './ConfirmationPopup';

export function PlanningGrid({ data, filters }) {
  const { filteredAffectations, moveAffectation } = useAffectations(data, filters);
  const [exchangeProposal, setExchangeProposal] = useState(null);

  const handleMove = (from, to) => {
    setExchangeProposal({ from, to });
  };

  const handleConfirmExchange = () => {
    // Ici, nous simulerons juste l'échange sans sauvegarder
    console.log('Échange confirmé:', exchangeProposal);
    setExchangeProposal(null);
  };

  return (
    <div className="planning-body">
      {data.semaines.map(semaine => (
        <WeekRow 
          key={semaine.id}
          semaine={semaine}
          classes={data.classes}
          affectations={filteredAffectations}
          onAffectationMove={handleMove}
        />
      ))}

      {exchangeProposal && (
        <ConfirmationPopup
          fromAffectation={exchangeProposal.from.affectation}
          toAffectation={exchangeProposal.to.affectation}
          onConfirm={handleConfirmExchange}
          onCancel={() => setExchangeProposal(null)}
        />
      )}
    </div>
  );
} 