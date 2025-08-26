import React, { useState } from 'react';
import { useToast } from './Toast';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmModal } from './ConfirmModal';

export function PlanningManager({ currentPlanning, isAdmin, onSwitchPlanning }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSwitchForm, setShowSwitchForm] = useState(false);
  const toast = useToast();
  const { confirm, confirmState, closeConfirm } = useConfirm();
  const [createData, setCreateData] = useState({
    name: '',
    description: '',
    year: new Date().getFullYear(),
    customToken: ''
  });
  const [switchToken, setSwitchToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreatePlanning = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_planning',
          data: createData
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      setSuccess(`Planning "${result.planning.name}" créé avec succès !`);
      setCreateData({
        name: '',
        description: '',
        year: new Date().getFullYear(),
        customToken: ''
      });
      setShowCreateForm(false);

      // Proposer de basculer vers le nouveau planning
      const switchNow = await confirm({
        title: 'Planning créé !',
        message: `Le planning "${result.planning.name}" a été créé avec succès.\n\nVoulez-vous basculer vers ce nouveau planning maintenant ?`,
        type: 'info',
        confirmText: 'Basculer',
        cancelText: 'Rester ici'
      });

      if (switchNow) {
        window.location.href = `?token=${result.planning.token}`;
      } else {
        toast.success('Planning créé avec succès ! Vous pouvez le retrouver dans la liste des plannings.');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchPlanning = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Vérifier que le token existe
      const response = await fetch(`/api/auth?action=planning_info&token=${switchToken}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Token invalide');
      }

      // Basculer vers le planning
      window.location.href = `?token=${switchToken}`;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomToken = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateData(prev => ({ ...prev, customToken: result }));
  };

  return (
    <div className="planning-manager">
      <div className="current-planning-info">
        <h3>📋 Planning Actuel</h3>
        <div className="planning-details">
          <div className="planning-name">{currentPlanning?.name || 'Planning sans nom'}</div>
          {currentPlanning?.description && (
            <div className="planning-description">{currentPlanning.description}</div>
          )}
          <div className="planning-meta">
            <span className="planning-year">📅 Année: {currentPlanning?.year || 'Non définie'}</span>
            <span className="planning-token">🔑 Token: {currentPlanning?.token || 'Non défini'}</span>
          </div>
        </div>
      </div>

      <div className="planning-actions">
        <button 
          onClick={() => setShowSwitchForm(!showSwitchForm)}
          className="switch-btn"
        >
          🔄 Basculer vers un autre planning
        </button>

        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-btn"
        >
          ➕ Créer un nouveau planning
        </button>
      </div>

      {/* Formulaire de basculement */}
      {showSwitchForm && (
        <div className="switch-form">
          <h4>🔄 Basculer vers un autre planning</h4>
          <form onSubmit={handleSwitchPlanning}>
            <div className="form-group">
              <label>Token du planning :</label>
              <input
                type="text"
                value={switchToken}
                onChange={(e) => setSwitchToken(e.target.value)}
                placeholder="Entrez le token du planning"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? '⏳ Vérification...' : '🔄 Basculer'}
              </button>
              <button type="button" onClick={() => setShowSwitchForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="create-form">
          <h4>➕ Créer un nouveau planning</h4>
          <form onSubmit={handleCreatePlanning}>
            <div className="form-group">
              <label>Nom du planning * :</label>
              <input
                type="text"
                value={createData.name}
                onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Planning École Primaire 2024-2025"
                required
              />
            </div>

            <div className="form-group">
              <label>Description :</label>
              <textarea
                value={createData.description}
                onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description optionnelle du planning"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Année scolaire :</label>
              <input
                type="number"
                value={createData.year}
                onChange={(e) => setCreateData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                min="2020"
                max="2040"
              />
            </div>

            <div className="form-group">
              <label>Token personnalisé (optionnel) :</label>
              <div className="token-input">
                <input
                  type="text"
                  value={createData.customToken}
                  onChange={(e) => setCreateData(prev => ({ ...prev, customToken: e.target.value }))}
                  placeholder="Laissez vide pour un token automatique"
                />
                <button type="button" onClick={generateRandomToken} className="generate-btn">
                  🎲 Générer
                </button>
              </div>
              <small>Utilisez des lettres minuscules et chiffres uniquement</small>
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? '⏳ Création...' : '➕ Créer le planning'}
              </button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      <style jsx>{`
        .planning-manager {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .current-planning-info {
          margin-bottom: 20px;
        }

        .current-planning-info h3 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .planning-details {
          background: white;
          padding: 16px;
          border-radius: 6px;
          border-left: 4px solid #007bff;
        }

        .planning-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 4px;
        }

        .planning-description {
          color: #666;
          margin-bottom: 8px;
        }

        .planning-meta {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #666;
        }

        .planning-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .switch-btn, .create-btn {
          padding: 10px 16px;
          border: 2px solid;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .switch-btn {
          background: white;
          color: #007bff;
          border-color: #007bff;
        }

        .switch-btn:hover {
          background: #007bff;
          color: white;
        }

        .create-btn {
          background: #28a745;
          color: white;
          border-color: #28a745;
        }

        .create-btn:hover {
          background: #218838;
          border-color: #218838;
        }

        .switch-form, .create-form {
          background: white;
          padding: 20px;
          border-radius: 6px;
          border: 1px solid #ddd;
          margin-bottom: 16px;
        }

        .switch-form h4, .create-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
        }

        .token-input {
          display: flex;
          gap: 8px;
        }

        .token-input input {
          flex: 1;
        }

        .generate-btn {
          padding: 8px 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .generate-btn:hover {
          background: #5a6268;
        }

        .form-group small {
          color: #666;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .form-actions button {
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .form-actions button[type="submit"] {
          background: #007bff;
          color: white;
        }

        .form-actions button[type="submit"]:hover:not(:disabled) {
          background: #0056b3;
        }

        .form-actions button[type="submit"]:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .form-actions button[type="button"] {
          background: #6c757d;
          color: white;
        }

        .form-actions button[type="button"]:hover {
          background: #5a6268;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-top: 16px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-top: 16px;
        }

        @media (max-width: 768px) {
          .planning-actions {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .planning-meta {
            flex-direction: column;
            gap: 8px;
          }

          .token-input {
            flex-direction: column;
          }
        }
      `}</style>
      
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        type={confirmState.type}
      />
    </div>
  );
}
