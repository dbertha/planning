import React, { useState, useEffect } from 'react';

export function ScheduledSMSManager({ token, sessionToken, canEdit }) {
  const [scheduledSMS, setScheduledSMS] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSMS, setEditingSMS] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    message_template: '',
    day_of_week: 2, // Mardi par défaut
    hour: 10,
    minute: 0,
    target_type: 'current_week',
    is_active: true
  });

  const daysOfWeek = [
    { value: 0, label: 'Dimanche' },
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' }
  ];

  const targetTypes = [
    { value: 'current_week', label: 'Familles avec nettoyage cette semaine' },
    { value: 'all_active', label: 'Toutes les familles actives' }
  ];

  useEffect(() => {
    if (token) {
      loadScheduledSMS();
    }
  }, [token]);

  const loadScheduledSMS = async () => {
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
          action: 'list_scheduled'
        })
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors du chargement');
      }
      
      setScheduledSMS(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      message_template: '',
      day_of_week: 2,
      hour: 10,
      minute: 0,
      target_type: 'current_week',
      is_active: true
    });
    setEditingSMS(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.message_template.trim()) {
      setError('Nom et message sont obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      const action = editingSMS ? 'update_scheduled' : 'create_scheduled';
      const endpoint = '/api/sms';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          action,
          data: editingSMS ? { ...formData, id: editingSMS.id } : formData
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

      await loadScheduledSMS();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sms) => {
    setFormData({
      name: sms.name,
      description: sms.description || '',
      message_template: sms.message_template,
      day_of_week: sms.day_of_week,
      hour: sms.hour,
      minute: sms.minute,
      target_type: sms.target_type,
      is_active: sms.is_active
    });
    setEditingSMS(sms);
    setShowCreateForm(true);
  };

  const handleDelete = async (smsId) => {
    if (!window.confirm('Supprimer ce SMS planifié ?')) return;

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
          action: 'delete_scheduled',
          data: { id: smsId }
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la suppression');
      }

      await loadScheduledSMS();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (sms) => {
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
          action: 'update_scheduled',
          data: { ...sms, is_active: !sms.is_active }
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Erreur lors de la modification');
      }

      await loadScheduledSMS();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const createDefaultKeyBoxSMS = () => {
    setFormData({
      name: 'Code boîte à clés',
      description: 'SMS automatique envoyé le mardi à 10h pour donner le code de la boîte à clés aux familles avec nettoyage cette semaine',
      message_template: 'Bonjour {nom_famille}, vous avez un nettoyage cette semaine ({classe_nom}). Le code de la boîte à clés est: 1234. Merci ! - {planning_name}',
      day_of_week: 2, // Mardi
      hour: 10,
      minute: 0,
      target_type: 'current_week',
      is_active: true
    });
    setShowCreateForm(true);
  };

  if (!canEdit) {
    return (
      <div className="scheduled-sms-manager">
        <p>Accès administrateur requis pour gérer les SMS planifiés.</p>
      </div>
    );
  }

  return (
    <div className="scheduled-sms-manager">
      <div className="manager-header">
        <h3>📅 SMS Planifiés</h3>
        <div className="header-actions">
          <button
            onClick={createDefaultKeyBoxSMS}
            className="btn btn-secondary"
            disabled={loading}
          >
            🗝️ Créer SMS Code Boîte
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
            disabled={loading}
          >
            ➕ {showCreateForm ? 'Annuler' : 'Nouveau SMS'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Formulaire de création/modification */}
      {showCreateForm && (
        <div className="create-form">
          <h4>{editingSMS ? 'Modifier' : 'Créer'} un SMS planifié</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Nom du SMS planifié"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <textarea
                placeholder="Description (optionnel)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="form-row">
              <textarea
                placeholder="Message SMS (utilisez {nom_famille}, {classe_nom}, {planning_name})"
                value={formData.message_template}
                onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                rows={3}
                required
              />
              <small>Variables: {'{nom_famille}'}, {'{classe_nom}'}, {'{date_debut}'}, {'{date_fin}'}, {'{planning_name}'}</small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Jour de la semaine:</label>
                <select
                  value={formData.day_of_week}
                  onChange={(e) => setFormData({ ...formData, day_of_week: parseInt(e.target.value) })}
                >
                  {daysOfWeek.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Heure:</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Minutes:</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.minute}
                  onChange={(e) => setFormData({ ...formData, minute: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Destinataires:</label>
                <select
                  value={formData.target_type}
                  onChange={(e) => setFormData({ ...formData, target_type: e.target.value })}
                >
                  {targetTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  Actif
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Annuler
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sauvegarde...' : (editingSMS ? 'Modifier' : 'Créer')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des SMS planifiés */}
      <div className="scheduled-list">
        <h4>SMS Planifiés ({scheduledSMS.length})</h4>
        
        {loading && !showCreateForm ? (
          <div className="loading">Chargement...</div>
        ) : scheduledSMS.length === 0 ? (
          <div className="empty-state">
            <p>Aucun SMS planifié configuré.</p>
            <p>Créez votre premier SMS automatique pour le code de la boîte à clés !</p>
          </div>
        ) : (
          <div className="sms-grid">
            {scheduledSMS.map(sms => (
              <div key={sms.id} className={`sms-card ${!sms.is_active ? 'inactive' : ''}`}>
                <div className="sms-header">
                  <h5>{sms.name}</h5>
                  <div className="sms-actions">
                    <button
                      onClick={() => handleToggleActive(sms)}
                      className={`toggle-btn ${sms.is_active ? 'active' : 'inactive'}`}
                      title={sms.is_active ? 'Désactiver' : 'Activer'}
                    >
                      {sms.is_active ? '🟢' : '🔴'}
                    </button>
                    <button
                      onClick={() => handleEdit(sms)}
                      className="edit-btn"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(sms.id)}
                      className="delete-btn"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {sms.description && (
                  <p className="sms-description">{sms.description}</p>
                )}

                <div className="sms-schedule">
                  <span className="schedule-time">
                    📅 {daysOfWeek.find(d => d.value === sms.day_of_week)?.label} à {formatTime(sms.hour, sms.minute)}
                  </span>
                  <span className="schedule-target">
                    👥 {targetTypes.find(t => t.value === sms.target_type)?.label}
                  </span>
                </div>

                <div className="sms-message">
                  <strong>Message:</strong>
                  <p>{sms.message_template}</p>
                </div>

                {!sms.is_active && (
                  <div className="inactive-badge">
                    ⏸️ Inactif
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scheduled-sms-manager {
          max-width: 1200px;
        }

        .manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
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

        .btn:hover {
          opacity: 0.9;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .create-form {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .form-row {
          margin-bottom: 15px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .form-group {
          flex: 1;
          min-width: 150px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .form-row input,
        .form-row textarea,
        .form-row select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-row textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-row small {
          color: #666;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .scheduled-list h4 {
          margin-bottom: 15px;
        }

        .sms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .sms-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          transition: box-shadow 0.2s;
        }

        .sms-card:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sms-card.inactive {
          opacity: 0.7;
          background: #f8f9fa;
        }

        .sms-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .sms-header h5 {
          margin: 0;
          color: #333;
        }

        .sms-actions {
          display: flex;
          gap: 5px;
        }

        .sms-actions button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 3px;
          font-size: 16px;
        }

        .sms-actions button:hover {
          background: #f0f0f0;
        }

        .sms-description {
          font-size: 13px;
          color: #666;
          margin-bottom: 10px;
          font-style: italic;
        }

        .sms-schedule {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .schedule-time {
          color: #007bff;
          font-weight: 500;
        }

        .schedule-target {
          color: #666;
        }

        .sms-message {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .sms-message strong {
          font-size: 13px;
          color: #333;
        }

        .sms-message p {
          font-size: 12px;
          color: #666;
          margin: 5px 0 0 0;
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .inactive-badge {
          background: #6c757d;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          text-align: center;
          margin-top: 10px;
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

        .empty-state {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .empty-state p {
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}

export default ScheduledSMSManager;
