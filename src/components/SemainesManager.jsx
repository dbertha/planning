import React, { useState, useEffect } from 'react';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { WeekCreator } from './WeekCreator';

function SemainesManager({ token, canEdit, refreshData, refreshPlanningGrid, toggleSemainePublication, sessionToken }) {
  const [semaines, setSemaines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkForm, setShowBulkForm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, semaineId: null, semaineName: null });
  const [editCodesModal, setEditCodesModal] = useState({ isOpen: false, semaine: null });
  const [editCodes, setEditCodes] = useState('');
  const [inlineEditingCodes, setInlineEditingCodes] = useState(null); // ID de la semaine en cours d'édition inline
  const [inlineEditCodesValue, setInlineEditCodesValue] = useState('');
  const [editModal, setEditModal] = useState({ isOpen: false, semaine: null });
  const [editFormData, setEditFormData] = useState({
    debut: '',
    fin: '',
    type: '',
    description: '',
    code_cles: '',
    is_published: false
  });

  // Formulaire pour nouvelle semaine
  const [newSemaine, setNewSemaine] = useState({
    id: '',
    debut: '',
    fin: '',
    type: 'nettoyage',
    description: '',
    code_cles: '',
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
        code_cles: '',
        is_published: false
      });
      setShowAddForm(false);
      await loadSemaines();
      refreshPlanningGrid(); // Recharger seulement la grille de planning
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

  const handleEditCodes = (semaine) => {
    setEditCodesModal({ isOpen: true, semaine });
    setEditCodes(semaine.code_cles || '');
  };

  const handleInlineEditCodes = (semaine) => {
    setInlineEditingCodes(semaine.id);
    setInlineEditCodesValue(semaine.code_cles || '');
  };

  const handleSaveInlineCodes = async (semaineId) => {
    try {
      setLoading(true);
      const response = await fetch('/api/planning', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'semaine',
          id: semaineId,
          data: { code_cles: inlineEditCodesValue }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      setInlineEditingCodes(null);
      setInlineEditCodesValue('');
      await loadSemaines();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInlineCodes = () => {
    setInlineEditingCodes(null);
    setInlineEditCodesValue('');
  };

  const saveCodes = async () => {
    if (!editCodesModal.semaine) return;

    try {
      setLoading(true);
      const response = await fetch('/api/planning', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'semaine',
          id: editCodesModal.semaine.id,
          data: { code_cles: editCodes }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      setEditCodesModal({ isOpen: false, semaine: null });
      setEditCodes('');
      await loadSemaines();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSemaine = (semaine) => {
    setEditFormData({
      debut: semaine.debut,
      fin: semaine.fin,
      type: semaine.type,
      description: semaine.description || '',
      code_cles: semaine.code_cles || '',
      is_published: semaine.is_published
    });
    setEditModal({ isOpen: true, semaine });
  };

  const saveEditSemaine = async () => {
    if (!editModal.semaine) return;

    // Validation basique
    if (!editFormData.debut || !editFormData.fin) {
      setError('Les dates de début et fin sont obligatoires');
      return;
    }

    if (new Date(editFormData.fin) <= new Date(editFormData.debut)) {
      setError('La date de fin doit être après la date de début');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/planning', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'semaine',
          id: editModal.semaine.id,
          data: editFormData
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la mise à jour');
      }

      setEditModal({ isOpen: false, semaine: null });
      setEditFormData({
        debut: '',
        fin: '',
        type: '',
        description: '',
        code_cles: '',
        is_published: false
      });
      await loadSemaines();
      refreshPlanningGrid(); // Recharger la grille de planning
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
      refreshPlanningGrid(); // Recharger seulement la grille de planning
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

      {/* Création rapide de semaines */}
      <WeekCreator
        token={token}
        isAdmin={canEdit}
        sessionToken={sessionToken}
        onWeekCreated={(newWeek) => {
          loadSemaines(); // Recharger la liste des semaines
          refreshPlanningGrid(); // Recharger seulement la grille de planning
        }}
      />

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
              <label>Codes clés</label>
              <input
                type="text"
                value={newSemaine.code_cles}
                onChange={(e) => setNewSemaine({ ...newSemaine, code_cles: e.target.value })}
                placeholder="1234, 5678, 9012 (codes à 4 chiffres séparés par des virgules)"
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Codes de boîtes à clés (4 chiffres). Disponibles dans les SMS via {'{codes_cles}'}
              </small>
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

                {/* Codes clés - affichage inline ou édition */}
                <div className="semaine-codes-section">
                  {inlineEditingCodes === semaine.id ? (
                    <div className="inline-codes-edit">
                      <label>Codes clés:</label>
                      <div className="inline-codes-input">
                        <input
                          type="text"
                          value={inlineEditCodesValue}
                          onChange={(e) => setInlineEditCodesValue(e.target.value)}
                          placeholder="1234, 5678, 9012"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveInlineCodes(semaine.id);
                            } else if (e.key === 'Escape') {
                              handleCancelInlineCodes();
                            }
                          }}
                          autoFocus
                        />
                        <div className="inline-codes-actions">
                          <button
                            onClick={() => handleSaveInlineCodes(semaine.id)}
                            className="btn-save-inline"
                            disabled={loading}
                            title="Sauvegarder (Entrée)"
                          >
                            ✅
                          </button>
                          <button
                            onClick={handleCancelInlineCodes}
                            className="btn-cancel-inline"
                            title="Annuler (Échap)"
                          >
                            ❌
                          </button>
                        </div>
                      </div>
                      <small className="inline-codes-help">
                        Entrée pour sauvegarder, Échap pour annuler
                      </small>
                    </div>
                  ) : (
                    <div className="semaine-codes" onClick={() => handleInlineEditCodes(semaine)}>
                      <strong>Codes clés:</strong> 
                      <span className="codes-value">
                        {semaine.code_cles || 'Cliquez pour ajouter'}
                      </span>
                      <span className="edit-hint">✏️</span>
                    </div>
                  )}
                </div>

                {semaine.published_at && (
                  <div className="published-at">
                    Publiée le: {new Date(semaine.published_at).toLocaleDateString('fr-FR')}
                  </div>
                )}

                <div className="semaine-actions">
                  <button
                    onClick={() => handleEditSemaine(semaine)}
                    className="btn btn-outline"
                    disabled={loading}
                    title="Modifier la semaine"
                  >
                    ✏️ Éditer
                  </button>
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

      {/* Modal d'édition des codes clés */}
      {editCodesModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>🔑 Codes clés - {editCodesModal.semaine?.id}</h3>
              <button 
                onClick={() => setEditCodesModal({ isOpen: false, semaine: null })}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Codes clés pour cette semaine :</label>
                <input
                  type="text"
                  value={editCodes}
                  onChange={(e) => setEditCodes(e.target.value)}
                  placeholder="1234, 5678, 9012 (codes à 4 chiffres séparés par des virgules)"
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                />
                <small style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>
                  Codes de boîtes à clés (4 chiffres). Disponibles dans les SMS via {'{codes_cles}'}
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setEditCodesModal({ isOpen: false, semaine: null })}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={saveCodes}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition complète de la semaine */}
      {editModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal modal-large">
            <div className="modal-header">
              <h3>✏️ Éditer la semaine - {editModal.semaine?.id}</h3>
              <button 
                onClick={() => setEditModal({ isOpen: false, semaine: null })}
                className="modal-close"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Date début *</label>
                  <input
                    type="date"
                    value={editFormData.debut}
                    onChange={(e) => setEditFormData({ ...editFormData, debut: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date fin *</label>
                  <input
                    type="date"
                    value={editFormData.fin}
                    onChange={(e) => setEditFormData({ ...editFormData, fin: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  >
                    <option value="nettoyage">Nettoyage</option>
                    <option value="vacances">Vacances</option>
                    <option value="special">Spécial</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editFormData.is_published}
                      onChange={(e) => setEditFormData({ ...editFormData, is_published: e.target.checked })}
                    />
                    Publiée
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Description de la semaine..."
                />
              </div>

              <div className="form-group">
                <label>Codes clés</label>
                <input
                  type="text"
                  value={editFormData.code_cles}
                  onChange={(e) => setEditFormData({ ...editFormData, code_cles: e.target.value })}
                  placeholder="1234, 5678, 9012 (codes à 4 chiffres séparés par des virgules)"
                />
                <small style={{ color: '#666', fontSize: '0.8rem' }}>
                  Codes de boîtes à clés (4 chiffres). Disponibles dans les SMS via {'{codes_cles}'}
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setEditModal({ isOpen: false, semaine: null })}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={saveEditSemaine}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </div>
        </div>
      )}

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

        .semaine-codes-section {
          margin-bottom: 8px;
        }

        .semaine-codes {
          font-size: 12px;
          color: #007bff;
          background: #f8f9fa;
          padding: 6px 8px;
          border-radius: 4px;
          border-left: 3px solid #007bff;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .semaine-codes:hover {
          background: #e9ecef;
        }

        .codes-value {
          flex: 1;
          color: #333;
        }

        .codes-value:empty::before {
          content: "Cliquez pour ajouter";
          color: #999;
          font-style: italic;
        }

        .edit-hint {
          font-size: 10px;
          opacity: 0.7;
        }

        .inline-codes-edit {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          border-left: 3px solid #007bff;
        }

        .inline-codes-edit label {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          font-weight: 500;
          color: #333;
        }

        .inline-codes-input {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
        }

        .inline-codes-input input {
          flex: 1;
          padding: 4px 6px;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 12px;
        }

        .inline-codes-input input:focus {
          outline: none;
          border-color: #007bff;
        }

        .inline-codes-actions {
          display: flex;
          gap: 4px;
        }

        .btn-save-inline, .btn-cancel-inline {
          background: none;
          border: none;
          padding: 2px 4px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .btn-save-inline:hover {
          background: #d4edda;
        }

        .btn-cancel-inline:hover {
          background: #f8d7da;
        }

        .inline-codes-help {
          font-size: 10px;
          color: #666;
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

        .btn-outline {
          background: transparent;
          color: #007bff;
          border: 1px solid #007bff;
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

        /* Styles pour les modals */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .modal-large {
          max-width: 700px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .modal-header h3 {
          margin: 0;
          color: #333;
          font-size: 18px;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }

        .modal-body {
          padding: 20px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #eee;
          background: #f8f9fa;
          border-radius: 0 0 8px 8px;
        }
      `}</style>
    </div>
  );
}

export default SemainesManager; 