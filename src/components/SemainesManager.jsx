import React, { useState, useEffect } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';

function SemainesManager({ token, canEdit, refreshData, toggleSemainePublication }) {
  const [semaines, setSemaines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, semaineId: null, semaineName: null });

  // Formulaire pour nouvelle semaine
  const [newSemaine, setNewSemaine] = useState({
    id: '',
    debut: '',
    fin: '',
    type: 'nettoyage',
    description: '',
    is_published: false
  });

  // Formulaire génération en lot
  const [bulkGeneration, setBulkGeneration] = useState({
    start_date: '',
    end_date: '',
    type: 'nettoyage',
    exclude_holidays: true,
    custom_weeks: []
  });

  useEffect(() => {
    loadSemaines();
  }, [token]);

  const loadSemaines = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/planning?token=${token}&type=semaines`, {
        headers: {
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des semaines');
      
      const data = await response.json();
      setSemaines(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSemaine = async (e) => {
    e.preventDefault();
    if (!newSemaine.id.trim() || !newSemaine.debut || !newSemaine.fin) {
      setError('ID, date de début et fin sont obligatoires');
      return;
    }

    // Vérifier que l'ID n'existe pas déjà
    if (semaines.some(semaine => semaine.id === newSemaine.id)) {
      setError('Cet ID de semaine existe déjà');
      return;
    }

    // Vérifier que la date de fin est après la date de début
    if (new Date(newSemaine.fin) <= new Date(newSemaine.debut)) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'semaine',
          data: newSemaine
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setNewSemaine({
        id: '',
        debut: '',
        fin: '',
        type: 'nettoyage',
        description: '',
        is_published: false
      });
      setShowAddForm(false);
      await loadSemaines();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublication = async (semaineId, currentStatus) => {
    try {
      setLoading(true);
      await toggleSemainePublication(semaineId, !currentStatus);
      // loadSemaines() supprimé car toggleSemainePublication met déjà à jour l'état
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSemaine = async (semaineId) => {
    const semaine = semaines.find(s => s.id === semaineId);
    setDeleteModal({
      isOpen: true,
      semaineId,
      semaineName: `${semaineId} (${semaine?.debut} - ${semaine?.fin})`
    });
  };

  const confirmDeleteSemaine = async () => {
    const semaineId = deleteModal.semaineId;
    
    try {
      setLoading(true);
      const response = await fetch('/api/planning', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'semaine',
          id: semaineId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await loadSemaines();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateWeekId = (debut) => {
    const date = new Date(debut);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateBulkSemaines = () => {
    if (!bulkGeneration.start_date || !bulkGeneration.end_date) {
      setError('Dates de début et fin requises pour la génération en lot');
      return;
    }

    const startDate = new Date(bulkGeneration.start_date);
    const endDate = new Date(bulkGeneration.end_date);
    const weeks = [];

    // Générer les semaines (chaque lundi)
    let currentDate = new Date(startDate);
    // Trouver le lundi de la semaine
    while (currentDate.getDay() !== 1) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    while (currentDate <= endDate) {
      const weekStart = new Date(currentDate);
      const weekEnd = new Date(currentDate);
      weekEnd.setDate(weekEnd.getDate() + 6); // Dimanche

      // Vérifier si cette semaine n'existe pas déjà
      const weekId = generateWeekId(weekStart);
      if (!semaines.some(s => s.id === weekId)) {
        weeks.push({
          id: weekId,
          debut: weekStart.toISOString().split('T')[0],
          fin: weekEnd.toISOString().split('T')[0],
          type: bulkGeneration.type,
          description: `Semaine du ${weekStart.toLocaleDateString('fr-FR')}`,
          is_published: false
        });
      }

      // Passer à la semaine suivante
      currentDate.setDate(currentDate.getDate() + 7);
    }

    setBulkGeneration({ ...bulkGeneration, custom_weeks: weeks });
  };

  const saveBulkSemaines = async () => {
    try {
      setLoading(true);
      
      for (const semaine of bulkGeneration.custom_weeks) {
        await fetch('/api/planning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Session': localStorage.getItem('adminSessionToken')
          },
          body: JSON.stringify({
            token,
            type: 'semaine',
            data: semaine
          })
        });
      }

      setBulkGeneration({
        start_date: '',
        end_date: '',
        type: 'nettoyage',
        exclude_holidays: true,
        custom_weeks: []
      });
      setShowBulkForm(false);
      await loadSemaines();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const publishedCount = semaines.filter(s => s.is_published).length;
  const unpublishedCount = semaines.length - publishedCount;

  return (
    <div className="semaines-manager">
      <div className="manager-header">
        <h3>📅 Gestion des Semaines</h3>
        <div className="header-actions">
          <button onClick={() => setShowBulkForm(!showBulkForm)} className="btn btn-secondary">
            📋 Génération en lot
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            ➕ Ajouter Semaine
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Statistiques */}
      <div className="stats-bar">
        <div className="stat">
          📊 Total: {semaines.length}
        </div>
        <div className="stat published">
          ✅ Publiées: {publishedCount}
        </div>
        <div className="stat unpublished">
          🔒 Non publiées: {unpublishedCount}
        </div>
      </div>

      {/* Génération en lot */}
      {showBulkForm && (
        <div className="bulk-form">
          <h4>📋 Génération en lot</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Date début</label>
              <input
                type="date"
                value={bulkGeneration.start_date}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, start_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Date fin</label>
              <input
                type="date"
                value={bulkGeneration.end_date}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, end_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select
                value={bulkGeneration.type}
                onChange={(e) => setBulkGeneration({ ...bulkGeneration, type: e.target.value })}
              >
                <option value="nettoyage">Nettoyage</option>
                <option value="vacances">Vacances</option>
                <option value="special">Spécial</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setShowBulkForm(false)}>
              Annuler
            </button>
            <button onClick={generateBulkSemaines} disabled={loading}>
              🔍 Prévisualiser
            </button>
            {bulkGeneration.custom_weeks.length > 0 && (
              <button onClick={saveBulkSemaines} disabled={loading} className="btn-success">
                💾 Créer {bulkGeneration.custom_weeks.length} semaines
              </button>
            )}
          </div>

          {bulkGeneration.custom_weeks.length > 0 && (
            <div className="preview">
              <h5>Prévisualisation ({bulkGeneration.custom_weeks.length} semaines) :</h5>
              <div className="preview-list">
                {bulkGeneration.custom_weeks.slice(0, 5).map(week => (
                  <div key={week.id} className="preview-item">
                    {week.id}: {week.debut} → {week.fin}
                  </div>
                ))}
                {bulkGeneration.custom_weeks.length > 5 && (
                  <div className="preview-item">... et {bulkGeneration.custom_weeks.length - 5} autres</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Formulaire d'ajout individuel */}
      {showAddForm && (
        <div className="add-form">
          <h4>➕ Nouvelle Semaine</h4>
          <form onSubmit={handleAddSemaine}>
            <div className="form-row">
              <div className="form-group">
                <label>ID semaine *</label>
                <input
                  type="text"
                  value={newSemaine.id}
                  onChange={(e) => setNewSemaine({ ...newSemaine, id: e.target.value })}
                  placeholder="2024-01-15"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newSemaine.type}
                  onChange={(e) => setNewSemaine({ ...newSemaine, type: e.target.value })}
                >
                  <option value="nettoyage">Nettoyage</option>
                  <option value="vacances">Vacances</option>
                  <option value="special">Spécial</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date début *</label>
                <input
                  type="date"
                  value={newSemaine.debut}
                  onChange={(e) => {
                    setNewSemaine({ 
                      ...newSemaine, 
                      debut: e.target.value,
                      id: generateWeekId(e.target.value)
                    });
                  }}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date fin *</label>
                <input
                  type="date"
                  value={newSemaine.fin}
                  onChange={(e) => setNewSemaine({ ...newSemaine, fin: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                value={newSemaine.description}
                onChange={(e) => setNewSemaine({ ...newSemaine, description: e.target.value })}
                placeholder="Semaine de nettoyage du..."
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newSemaine.is_published}
                  onChange={(e) => setNewSemaine({ ...newSemaine, is_published: e.target.checked })}
                />
                Publier immédiatement
              </label>
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setShowAddForm(false)}>
                Annuler
              </button>
              <button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des semaines */}
      <div className="semaines-list">
        <h4>📋 Semaines ({semaines.length})</h4>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="semaines-grid">
            {semaines.map(semaine => (
              <div key={semaine.id} className={`semaine-card ${semaine.is_published ? 'published' : 'unpublished'}`}>
                <div className="semaine-header">
                  <div className="semaine-id">
                    {semaine.id}
                  </div>
                  <div className="semaine-status">
                    {semaine.is_published ? '✅ Publiée' : '🔒 Privée'}
                  </div>
                  <button
                    onClick={() => handleDeleteSemaine(semaine.id)}
                    className="delete-btn"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>

                <div className="semaine-dates">
                  Du {new Date(semaine.debut).toLocaleDateString('fr-FR')} 
                  au {new Date(semaine.fin).toLocaleDateString('fr-FR')}
                </div>

                <div className="semaine-type">
                  Type: {semaine.type}
                </div>

                {semaine.description && (
                  <div className="semaine-description">
                    {semaine.description}
                  </div>
                )}

                {semaine.published_at && (
                  <div className="published-at">
                    Publiée le: {new Date(semaine.published_at).toLocaleDateString('fr-FR')}
                  </div>
                )}

                <div className="semaine-actions">
                  <button
                    onClick={() => handleTogglePublication(semaine.id, semaine.is_published)}
                    className={`btn ${semaine.is_published ? 'btn-warning' : 'btn-success'}`}
                    disabled={loading}
                  >
                    {semaine.is_published ? '🔒 Dépublier' : '✅ Publier'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {semaines.length === 0 && !loading && (
          <div className="empty-state">
            <p>Aucune semaine définie</p>
            <p>Utilisez la génération en lot ou créez des semaines individuellement.</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, semaineId: null, semaineName: null })}
        onConfirm={confirmDeleteSemaine}
        title="Supprimer la semaine"
        message="Êtes-vous sûr de vouloir supprimer cette semaine ? Cette action est irréversible."
        itemName={deleteModal.semaineName}
        confirmText="Supprimer la semaine"
        cancelText="Annuler"
      />

      <style jsx>{`
        .semaines-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .manager-header h3 {
          margin: 0;
          color: #333;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .stats-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 6px;
        }

        .stat {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }

        .stat.published {
          background: #d4edda;
          color: #155724;
        }

        .stat.unpublished {
          background: #f8d7da;
          color: #721c24;
        }

        .bulk-form,
        .add-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .bulk-form h4,
        .add-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: 500;
          color: #333;
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .preview {
          margin-top: 16px;
          padding: 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .preview h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .preview-list {
          font-size: 12px;
          color: #666;
        }

        .preview-item {
          padding: 2px 0;
        }

        .semaines-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .semaine-card {
          background: white;
          border: 2px solid #ddd;
          border-radius: 6px;
          padding: 16px;
          transition: all 0.2s;
        }

        .semaine-card.published {
          border-color: #28a745;
          background: #f8fff9;
        }

        .semaine-card.unpublished {
          border-color: #ffc107;
          background: #fffef8;
        }

        .semaine-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .semaine-id {
          font-weight: bold;
          color: #333;
        }

        .semaine-status {
          font-size: 12px;
          font-weight: 500;
        }

        .delete-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .delete-btn:hover {
          background: #f8d7da;
        }

        .semaine-dates {
          font-size: 14px;
          color: #333;
          margin-bottom: 8px;
        }

        .semaine-type {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .semaine-description {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
          font-style: italic;
        }

        .published-at {
          font-size: 11px;
          color: #999;
          margin-bottom: 12px;
        }

        .semaine-actions {
          display: flex;
          gap: 8px;
        }

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .empty-state p {
          margin: 8px 0;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-success {
          background: #28a745;
          color: white;
        }

        .btn-warning {
          background: #ffc107;
          color: #212529;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loading {
          text-align: center;
          color: #666;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}

export default SemainesManager; 