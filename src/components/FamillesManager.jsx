import React, { useState, useEffect } from 'react';
import { useToast } from './Toast';
import { useConfirm } from '../hooks/useConfirm';
import { ConfirmModal } from './ConfirmModal';
import ExclusionsManager from './ExclusionsManager.jsx';

function FamillesManager({ token, canEdit, refreshData, sessionToken }) {
  const [familles, setFamilles] = useState([]);
  const [classes, setClasses] = useState([]);
  const toast = useToast();
  const { confirm, confirmState, closeConfirm } = useConfirm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [selectedFamilleForExclusions, setSelectedFamilleForExclusions] = useState(null);
  const [smsSending, setSmsSending] = useState(null);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [selectedFamilleForSMS, setSelectedFamilleForSMS] = useState(null);
  const [smsMessage, setSmsMessage] = useState('');

  // Formulaire pour nouvelle famille
  const [newFamille, setNewFamille] = useState({
    nom: '',
    email: '',
    telephone: '',
    nb_nettoyage: 3,
    classes_preferences: [],
    notes: ''
  });

  useEffect(() => {
    loadFamilles();
    loadClasses();
  }, [token]);

  const loadFamilles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/familles?token=${token}&action=list`, {
        headers: {
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        }
      });
      
      if (!response.ok) throw new Error('Erreur lors du chargement des familles');
      
      const data = await response.json();
      setFamilles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await fetch(`/api/planning?token=${token}&type=classes`);
      if (!response.ok) throw new Error('Erreur lors du chargement des classes');
      
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      console.error('Erreur chargement classes:', err);
    }
  };

  const handleAddFamille = async (e) => {
    e.preventDefault();
    if (!newFamille.nom.trim() || !newFamille.telephone.trim()) {
      setError('Nom et téléphone sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/familles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          action: 'create',
          data: newFamille
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setNewFamille({
        nom: '',
        email: '',
        telephone: '',
        nb_nettoyage: 3,
        classes_preferences: [],
        notes: ''
      });
      setShowAddForm(false);
      await loadFamilles();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    try {
      setLoading(true);
      setImportResult(null);

      // Lire le fichier CSV
      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Le fichier doit contenir au moins une ligne d\'en-tête et une ligne de données');
      }

      // Parser le CSV
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const familles = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const famille = {};
        headers.forEach((header, index) => {
          famille[header] = values[index] || '';
        });
        return famille;
      });

      // Envoyer à l'API
      const response = await fetch('/api/familles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          action: 'import',
          data: {
            familles,
            filename: importFile.name
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'import');
      }

      const result = await response.json();
      setImportResult(result);
      setImportFile(null);
      await loadFamilles();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/familles?token=${token}&action=template`);
      if (!response.ok) throw new Error('Erreur lors du téléchargement du template');
      
      const template = await response.json();
      
      // Créer le CSV
      const csvContent = [
        template.headers.join(','),
        template.example.map(val => `"${val}"`).join(',')
      ].join('\n');

      // Télécharger
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template_familles.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleClassePreference = (classeId) => {
    const preferences = [...newFamille.classes_preferences];
    const index = preferences.indexOf(classeId);
    if (index > -1) {
      preferences.splice(index, 1);
    } else {
      preferences.push(classeId);
    }
    setNewFamille({ ...newFamille, classes_preferences: preferences });
  };

  const handleArchiveFamille = async (familleId) => {
    const famille = familles.find(f => f.id === familleId);
    const confirmed = await confirm({
      title: 'Archiver la famille',
      message: `Archiver la famille "${famille?.nom}" ?\n\nLes affectations existantes seront conservées mais la famille ne pourra plus être assignée à de nouvelles tâches.`,
      type: 'warning',
      confirmText: 'Archiver',
      cancelText: 'Annuler'
    });
    
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await fetch('/api/familles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          id: familleId,
          data: { is_active: false }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'archivage');
      }

      await loadFamilles();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreFamille = async (familleId) => {
    try {
      setLoading(true);
      const response = await fetch('/api/familles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          id: familleId,
          data: { is_active: true }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la restauration');
      }

      await loadFamilles();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMSToFamille = (famille) => {
    setSelectedFamilleForSMS(famille);
    setSmsMessage(`Bonjour ${famille.nom}, `);
    setShowSMSModal(true);
  };

  const handleSendSMS = async () => {
    if (!smsMessage.trim()) {
      setError('Le message SMS ne peut pas être vide');
      return;
    }

    try {
      setSmsSending(selectedFamilleForSMS.id);
      
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          action: 'send_to_famille',
          data: {
            famille_id: selectedFamilleForSMS.id,
            template_key: 'personnalise',
            message_personnalise: smsMessage,
            template_data: {
              nom_famille: selectedFamilleForSMS.nom,
              planning_name: 'Planning'
            }
          }
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi du SMS');
      }

      toast.success(`SMS envoyé avec succès à ${selectedFamilleForSMS.nom} !`);
      setShowSMSModal(false);
      setSmsMessage('');
      setSelectedFamilleForSMS(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSmsSending(null);
    }
  };

  const handleSendSMSToAllFamilles = async () => {
    const activeFamilles = familles.filter(f => f.is_active);
    if (activeFamilles.length === 0) {
      setError('Aucune famille active à contacter');
      return;
    }

    const message = prompt(`Envoyer un SMS à ${activeFamilles.length} familles actives.\nMessage:`);
    if (!message) return;

    const confirmed = await confirm({
      title: 'Envoi SMS groupé',
      message: `Confirmer l'envoi du SMS à ${activeFamilles.length} familles ?\n\nLe message sera envoyé à toutes les familles actives du planning.`,
      type: 'info',
      confirmText: 'Envoyer',
      cancelText: 'Annuler'
    });
    
    if (!confirmed) return;

    try {
      setLoading(true);
      
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          action: 'send_bulk',
          data: {
            template_key: 'personnalise',
            message_personnalise: message,
            template_data: {
              planning_name: 'Planning'
            }
          }
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de l\'envoi en masse');
      }

      toast.success(`SMS envoyés avec succès !\nEnvoyés: ${result.sent} | Erreurs: ${result.errors}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="familles-manager">
      <div className="manager-header">
        <h3>👥 Gestion des Familles</h3>
        <div className="header-actions">
          <button onClick={downloadTemplate} className="btn btn-secondary">
            📥 Télécharger Template CSV
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            ➕ Ajouter Famille
          </button>
          <button
            onClick={handleSendSMSToAllFamilles}
            className="btn btn-sms"
            disabled={!canEdit || !sessionToken}
            title="Envoyer un SMS à toutes les familles actives"
          >
            📱 SMS Global
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Import Excel */}
      <div className="import-section">
        <h4>📊 Import Excel/CSV</h4>
        <div className="import-controls">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={(e) => setImportFile(e.target.files[0])}
            disabled={loading}
          />
          <button
            onClick={handleImport}
            disabled={!importFile || loading}
            className="btn btn-success"
          >
            {loading ? 'Import...' : 'Importer'}
          </button>
        </div>

        {importResult && (
          <div className="import-result">
            <h5>Résultat de l'import :</h5>
            <div className="result-stats">
              <span className="stat">📊 Total: {importResult.total_lines}</span>
              <span className="stat success">✅ Réussis: {importResult.success}</span>
              <span className="stat error">❌ Erreurs: {importResult.errors}</span>
            </div>
            {importResult.error_details && importResult.error_details.length > 0 && (
              <div className="error-details">
                <h6>Détails des erreurs :</h6>
                {importResult.error_details.map((error, index) => (
                  <div key={index} className="error-item">
                    Ligne {error.ligne} ({error.famille}): {error.erreur}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="add-form">
          <h4>➕ Nouvelle Famille</h4>
          <form onSubmit={handleAddFamille}>
            <div className="form-row">
              <div className="form-group">
                <label>Nom famille *</label>
                <input
                  type="text"
                  value={newFamille.nom}
                  onChange={(e) => setNewFamille({ ...newFamille, nom: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Téléphone *</label>
                <input
                  type="tel"
                  value={newFamille.telephone}
                  onChange={(e) => setNewFamille({ ...newFamille, telephone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newFamille.email}
                  onChange={(e) => setNewFamille({ ...newFamille, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nb nettoyages/an</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newFamille.nb_nettoyage}
                  onChange={(e) => setNewFamille({ ...newFamille, nb_nettoyage: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Classes préférées</label>
              <div className="classes-grid">
                {classes.map(classe => (
                  <label key={classe.id} className="classe-option">
                    <input
                      type="checkbox"
                      checked={newFamille.classes_preferences.includes(classe.id)}
                      onChange={() => toggleClassePreference(classe.id)}
                    />
                    <span style={{ color: classe.couleur }}>
                      {classe.id} - {classe.nom}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={newFamille.notes}
                onChange={(e) => setNewFamille({ ...newFamille, notes: e.target.value })}
                rows="3"
              />
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

      {/* Liste des familles */}
      <div className="familles-list">
        <h4>👨‍👩‍👧‍👦 Familles ({familles.length})</h4>
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="families-grid">
            {familles.map(famille => (
              <div key={famille.id} className={`famille-card ${!famille.is_active ? 'archived' : ''}`}>
                <div className="famille-header">
                  <h5>{famille.nom}</h5>
                  <div className="famille-actions">
                    <button
                      onClick={() => handleSendSMSToFamille(famille)}
                      className="sms-btn"
                      disabled={!canEdit || !sessionToken || smsSending === famille.id}
                      title="Envoyer un SMS à cette famille"
                    >
                      {smsSending === famille.id ? '⏳' : '📱'}
                    </button>
                    <button
                      onClick={() => setSelectedFamilleForExclusions(famille)}
                      className="exclusions-btn"
                      title="Gérer les contraintes (dates d'indisponibilité)"
                    >
                      🚫
                    </button>
                    {famille.is_active ? (
                      <button
                        onClick={() => handleArchiveFamille(famille.id)}
                        className="archive-btn"
                        title="Archiver (conserve les affectations)"
                      >
                        📦
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestoreFamille(famille.id)}
                        className="restore-btn"
                        title="Restaurer"
                      >
                        ↩️
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="famille-info">
                  <span>📞 {famille.telephone}</span>
                  {famille.email && <span>📧 {famille.email}</span>}
                  <span>🔢 {famille.nb_nettoyage} nettoyages/an</span>
                  <span>📊 {famille.nb_affectations || 0} affectations</span>
                </div>
                {famille.preferences_noms && famille.preferences_noms.length > 0 && (
                  <div className="preferences">
                    <strong>Préférences:</strong> {famille.preferences_noms.join(', ')}
                  </div>
                )}
                {famille.notes && (
                  <div className="notes">
                    <strong>Notes:</strong> {famille.notes}
                  </div>
                )}
                {!famille.is_active && (
                  <div className="archived-badge">
                    📦 Famille archivée
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de gestion des exclusions */}
      {selectedFamilleForExclusions && (
        <>
          <div className="modal-overlay" onClick={() => setSelectedFamilleForExclusions(null)} />
          <ExclusionsManager
            familleId={selectedFamilleForExclusions.id}
            familleName={selectedFamilleForExclusions.nom}
            planningToken={token}
            onClose={() => setSelectedFamilleForExclusions(null)}
          />
        </>
      )}

      {/* Modal SMS */}
      {showSMSModal && selectedFamilleForSMS && (
        <div className="modal-overlay" onClick={() => setShowSMSModal(false)}>
          <div className="sms-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>📱 Envoyer SMS à {selectedFamilleForSMS.nom}</h4>
              <button
                onClick={() => setShowSMSModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="famille-contact-info">
                <p><strong>📞 Téléphone:</strong> {selectedFamilleForSMS.telephone}</p>
                {selectedFamilleForSMS.email && (
                  <p><strong>📧 Email:</strong> {selectedFamilleForSMS.email}</p>
                )}
              </div>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Tapez votre message SMS..."
                rows={4}
                maxLength={160}
                className="sms-textarea"
              />
              <div className="sms-info">
                <span>{smsMessage.length}/160 caractères</span>
              </div>
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowSMSModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleSendSMS}
                className="btn btn-primary"
                disabled={!smsMessage.trim() || smsSending}
              >
                {smsSending ? '⏳ Envoi...' : '📱 Envoyer SMS'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .familles-manager {
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

        .import-section {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .import-section h4 {
          margin: 0 0 12px 0;
          color: #333;
        }

        .import-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 12px;
        }

        .import-result {
          background: white;
          padding: 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .result-stats {
          display: flex;
          gap: 15px;
          margin: 8px 0;
        }

        .stat {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .stat.success {
          background: #d4edda;
          color: #155724;
        }

        .stat.error {
          background: #f8d7da;
          color: #721c24;
        }

        .error-details {
          margin-top: 10px;
          font-size: 12px;
        }

        .error-item {
          padding: 2px 0;
          color: #721c24;
        }

        .add-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .add-form h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 8px;
        }

        .classe-option {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          font-size: 14px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .families-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .famille-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
        }

        .famille-card.archived {
          opacity: 0.7;
          background: #f8f9fa;
          border-color: #adb5bd;
        }

        .famille-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .famille-actions {
          display: flex;
          gap: 8px;
        }

        .archive-btn, .restore-btn, .exclusions-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .archive-btn:hover {
          background: #fff3cd;
        }

        .restore-btn:hover {
          background: #d4edda;
        }

        .exclusions-btn:hover {
          background: #f8d7da;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .archived-badge {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 500;
          margin-top: 8px;
          text-align: center;
        }

        .famille-card h5 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .famille-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .preferences,
        .notes {
          font-size: 12px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #eee;
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

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-sms {
          background: #17a2b8;
          color: white;
        }

        .sms-btn {
          background: #17a2b8;
          color: white;
          padding: 4px 8px;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s;
        }

        .sms-btn:hover:not(:disabled) {
          background: #138496;
        }

        .sms-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sms-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 8px;
          padding: 0;
          min-width: 400px;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          z-index: 1000;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h4 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: #f0f0f0;
        }

        .modal-content {
          padding: 20px;
        }

        .famille-contact-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 15px;
        }

        .famille-contact-info p {
          margin: 5px 0;
          font-size: 14px;
        }

        .sms-textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: inherit;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
        }

        .sms-info {
          font-size: 12px;
          color: #666;
          margin-top: 5px;
          text-align: right;
        }

        .modal-actions {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
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

export default FamillesManager; 