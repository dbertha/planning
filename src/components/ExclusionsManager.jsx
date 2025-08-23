import React, { useState, useEffect } from 'react';

const ExclusionsManager = ({ familleId, familleName, planningToken, onClose }) => {
  const [exclusions, setExclusions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newExclusion, setNewExclusion] = useState({
    date_debut: '',
    date_fin: '',
    type: 'indisponibilite',
    notes: ''
  });

  const EXCLUSION_TYPES = [
    { value: 'indisponibilite', label: '🚫 Indisponibilité', color: '#dc3545' },
    { value: 'vacances', label: '🏖️ Vacances', color: '#007bff' },
    { value: 'maladie', label: '🏥 Maladie', color: '#fd7e14' },
    { value: 'autre', label: '❓ Autre', color: '#6c757d' }
  ];

  // Charger les exclusions existantes
  useEffect(() => {
    loadExclusions();
  }, [familleId]);

  const loadExclusions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/familles?token=${planningToken}&action=get_exclusions&famille_id=${familleId}`);
      
      if (response.ok) {
        const data = await response.json();
        setExclusions(data);
      } else {
        console.error('Erreur lors du chargement des exclusions');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newExclusion.date_debut || !newExclusion.date_fin) {
      alert('Veuillez remplir les dates de début et fin');
      return;
    }

    if (new Date(newExclusion.date_debut) > new Date(newExclusion.date_fin)) {
      alert('La date de début doit être antérieure à la date de fin');
      return;
    }

    try {
      const response = await fetch(`/api/familles?token=${planningToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_exclusion',
          famille_id: familleId,
          ...newExclusion
        })
      });

      if (response.ok) {
        await loadExclusions();
        setNewExclusion({
          date_debut: '',
          date_fin: '',
          type: 'indisponibilite',
          notes: ''
        });
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'exclusion');
    }
  };

  const handleDelete = async (exclusionId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette exclusion ?')) return;

    try {
      const response = await fetch(`/api/familles/${exclusionId}?token=${planningToken}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_exclusion' })
      });

      if (response.ok) {
        await loadExclusions();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTypeInfo = (type) => {
    return EXCLUSION_TYPES.find(t => t.value === type) || EXCLUSION_TYPES[0];
  };

  if (loading) {
    return (
      <div className="exclusions-manager">
        <div className="exclusions-header">
          <h3>⏳ Chargement...</h3>
          <button onClick={onClose} className="btn btn-sm">✕</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exclusions-manager">
      <div className="exclusions-header">
        <h3>🚫 Contraintes - {familleName}</h3>
        <button onClick={onClose} className="btn btn-sm">✕</button>
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="exclusion-form">
        <h4>➕ Ajouter une contrainte</h4>
        
        <div className="form-row">
          <div className="form-group">
            <label>Date début :</label>
            <input
              type="date"
              value={newExclusion.date_debut}
              onChange={(e) => setNewExclusion(prev => ({ ...prev, date_debut: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Date fin :</label>
            <input
              type="date"
              value={newExclusion.date_fin}
              onChange={(e) => setNewExclusion(prev => ({ ...prev, date_fin: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Type :</label>
          <select 
            value={newExclusion.type}
            onChange={(e) => setNewExclusion(prev => ({ ...prev, type: e.target.value }))}
          >
            {EXCLUSION_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Notes (optionnel) :</label>
          <textarea
            value={newExclusion.notes}
            onChange={(e) => setNewExclusion(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Précisions sur la contrainte..."
            rows="2"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          ➕ Ajouter la contrainte
        </button>
      </form>

      {/* Liste des exclusions */}
      <div className="exclusions-list">
        <h4>📋 Contraintes existantes ({exclusions.length})</h4>
        
        {exclusions.length === 0 ? (
          <div className="no-exclusions">
            ✅ Aucune contrainte définie pour cette famille
          </div>
        ) : (
          <div className="exclusions-items">
            {exclusions.map(exclusion => {
              const typeInfo = getTypeInfo(exclusion.type);
              return (
                <div key={exclusion.id} className="exclusion-item">
                  <div className="exclusion-info">
                    <div className="exclusion-type" style={{ color: typeInfo.color }}>
                      {typeInfo.label}
                    </div>
                    <div className="exclusion-dates">
                      📅 Du {formatDate(exclusion.date_debut)} au {formatDate(exclusion.date_fin)}
                    </div>
                    {exclusion.notes && (
                      <div className="exclusion-notes">
                        💬 {exclusion.notes}
                      </div>
                    )}
                    <div className="exclusion-meta">
                      Créée le {formatDate(exclusion.created_at)}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(exclusion.id)}
                    className="btn btn-danger btn-sm"
                    title="Supprimer cette contrainte"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .exclusions-manager {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          z-index: 1000;
        }

        .exclusions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #ddd;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .exclusions-header h3 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        .exclusion-form {
          padding: 20px;
          border-bottom: 1px solid #eee;
          background: #f9f9f9;
        }

        .exclusion-form h4 {
          margin: 0 0 16px 0;
          color: #007bff;
          font-size: 16px;
        }

        .form-row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          flex: 1;
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #555;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 60px;
        }

        .exclusions-list {
          padding: 20px;
        }

        .exclusions-list h4 {
          margin: 0 0 16px 0;
          color: #333;
          font-size: 16px;
        }

        .no-exclusions {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          font-style: italic;
        }

        .exclusions-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .exclusion-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
        }

        .exclusion-info {
          flex: 1;
        }

        .exclusion-type {
          font-weight: 600;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .exclusion-dates {
          color: #333;
          margin-bottom: 4px;
          font-size: 14px;
        }

        .exclusion-notes {
          color: #666;
          font-size: 13px;
          margin-bottom: 4px;
          font-style: italic;
        }

        .exclusion-meta {
          color: #999;
          font-size: 12px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        @media (max-width: 768px) {
          .exclusions-manager {
            width: 95%;
            max-height: 90vh;
          }

          .form-row {
            flex-direction: column;
          }

          .exclusion-item {
            flex-direction: column;
            gap: 12px;
          }

          .exclusions-header {
            padding: 12px 16px;
          }

          .exclusion-form, .exclusions-list {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExclusionsManager;
