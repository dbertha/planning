import React, { useState } from 'react';
import { WeekRow } from './WeekRow';
import { useAffectations } from '../hooks/useAffectations';
import { ConfirmationPopup } from './ConfirmationPopup';
import { OverwriteConfirmModal } from './OverwriteConfirmModal';
import { useToast } from './Toast';

export function PlanningGrid({ data, filters, isAdmin, canEdit, onCreateAffectation, onDeleteAffectation, onAutoDistribute, onTogglePublish }) {
  const { filteredAffectations, moveAffectation } = useAffectations(data, filters);
  const toast = useToast();
  const [exchangeProposal, setExchangeProposal] = useState(null);
  const [overwriteModal, setOverwriteModal] = useState({ 
    isOpen: false, 
    newFamille: null, 
    existingAffectation: null, 
    classe: null, 
    semaine: null 
  });

  const handleMove = (from, to) => {
    setExchangeProposal({ from, to });
  };

  const handleConfirmExchange = async () => {
    if (!exchangeProposal || !canEdit) return;

    try {
      const { from, to } = exchangeProposal;
      
      // Données des deux affectations à échanger
      const fromAffectation = from.affectation;
      const toAffectation = to.affectation;
      
      console.log('🔄 Début de l\'échange:', {
        from: `${fromAffectation.familleNom} (${fromAffectation.classeNom})`,
        to: `${toAffectation.familleNom} (${toAffectation.classeNom})`
      });

      // Étape 1: Supprimer les deux affectations existantes
      await onDeleteAffectation(fromAffectation.id);
      await onDeleteAffectation(toAffectation.id);
      
      // Étape 2: Créer les nouvelles affectations avec familles échangées
      await onCreateAffectation(
        fromAffectation.familleId, 
        toAffectation.classeId, 
        toAffectation.semaineId,
        `Échange avec ${toAffectation.familleNom}`
      );
      
      await onCreateAffectation(
        toAffectation.familleId, 
        fromAffectation.classeId, 
        fromAffectation.semaineId,
        `Échange avec ${fromAffectation.familleNom}`
      );
      
      console.log('✅ Échange réussi !');
      toast.success(`Échange réussi ! ${fromAffectation.familleNom} ↔ ${toAffectation.familleNom}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'échange:', error);
      toast.error(`Erreur lors de l'échange : ${error.message}`);
    } finally {
      setExchangeProposal(null);
    }
  };

  const handleFamilleDrop = async (familleId, classeId, semaineId) => {
    if (!canEdit) return;
    
    try {
      await onCreateAffectation(familleId, classeId, semaineId);
    } catch (error) {
      console.error('Erreur lors de l\'affectation:', error);
    }
  };

  const handleOverwriteRequest = (newFamilleItem, existingAffectation, classe, semaine) => {
    setOverwriteModal({
      isOpen: true,
      newFamille: newFamilleItem,
      existingAffectation,
      classe,
      semaine
    });
  };

  const confirmOverwrite = async () => {
    const { newFamille, existingAffectation, classe, semaine } = overwriteModal;
    
    try {
      // Supprimer l'affectation existante
      await onDeleteAffectation(existingAffectation.id);
      // Créer la nouvelle affectation
      await onCreateAffectation(newFamille.id, classe.id, semaine.id);
    } catch (error) {
      console.error('Erreur lors du remplacement:', error);
    }
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
          onFamilleDrop={handleFamilleDrop}
          onOverwriteRequest={handleOverwriteRequest}
          isAdmin={isAdmin}
          canEdit={canEdit}
          onAutoDistribute={onAutoDistribute}
          onTogglePublish={onTogglePublish}
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

      {/* Modal de confirmation d'écrasement */}
      <OverwriteConfirmModal
        isOpen={overwriteModal.isOpen}
        onClose={() => setOverwriteModal({ isOpen: false, newFamille: null, existingAffectation: null, classe: null, semaine: null })}
        onConfirm={confirmOverwrite}
        existingAffectation={overwriteModal.existingAffectation}
        newFamille={overwriteModal.newFamille}
        classe={overwriteModal.classe}
        semaine={overwriteModal.semaine}
      />

      <style jsx>{`
        .planning-body {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
      `}</style>
    </div>
  );
} 