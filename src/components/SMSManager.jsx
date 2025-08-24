import React, { useState, useEffect } from 'react';
import './DeleteConfirmModal.css'; // Réutiliser les styles des modales

const SMSManager = ({ 
  currentPlanning, 
  adminSession, 
  semaines = [], 
  familles = [], 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('individual'); // individual, affectations, bulk
  const [templates, setTemplates] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedFamille, setSelectedFamille] = useState('');
  const [selectedSemaine, setSelectedSemaine] = useState('');
  const [selectedFamilles, setSelectedFamilles] = useState([]);
  const [smsConfig, setSmsConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [previewMessage, setPreviewMessage] = useState('');

  // Charger les templates et la config SMS
  useEffect(() => {
    loadSMSConfig();
    loadTemplates();
  }, []);

  // Mettre à jour le preview du message
  useEffect(() => {
    updatePreview();
  }, [selectedTemplate, customMessage, selectedFamille, selectedSemaine, templates]);

  const loadSMSConfig = async () => {
    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': adminSession
        },
        body: JSON.stringify({
          token: currentPlanning.token,
          action: 'test_config'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSmsConfig(data);
      }
    } catch (error) {
      console.error('Erreur chargement config SMS:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: currentPlanning.token,
          action: 'get_templates'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
        
        // Sélectionner le premier template par défaut
        const firstTemplate = Object.keys(data.templates)[0];
        if (firstTemplate) {
          setSelectedTemplate(firstTemplate);
        }
      }
    } catch (error) {
      console.error('Erreur chargement templates:', error);
    }
  };

  const updatePreview = () => {
    if (selectedTemplate === 'personnalise') {
      setPreviewMessage(customMessage);
      return;
    }

    if (!templates[selectedTemplate]) {
      setPreviewMessage('');
      return;
    }

    let message = templates[selectedTemplate].template;
    
    // Variables communes
    message = message.replace('{planning_name}', currentPlanning.name || 'Planning');
    
    // Variables spécifiques selon l'onglet
    if (activeTab === 'individual' && selectedFamille) {
      const famille = familles.find(f => f.id.toString() === selectedFamille);
      if (famille) {
        message = message.replace('{nom_famille}', famille.nom);
      }
    }

    if (selectedSemaine) {
      const semaine = semaines.find(s => s.id === selectedSemaine);
      if (semaine) {
        message = message.replace('{date_debut}', new Date(semaine.debut).toLocaleDateString('fr-FR'));
        message = message.replace('{date_fin}', new Date(semaine.fin).toLocaleDateString('fr-FR'));
      }
    }

    // Remplacer les variables restantes par des placeholders
    message = message.replace(/{[^}]+}/g, '[...]');
    
    setPreviewMessage(message);
  };

  const sendSMS = async () => {
    if (!currentPlanning || !adminSession) return;

    setIsLoading(true);
    setResult(null);

    try {
      let action;
      let data = {};

      // Déterminer l'action selon l'onglet actif
      switch (activeTab) {
        case 'individual':
          if (!selectedFamille) {
            throw new Error('Veuillez sélectionner une famille');
          }
          action = 'send_to_famille';
          data = {
            famille_id: parseInt(selectedFamille),
            ...(selectedTemplate === 'personnalise' ? 
              { message_personnalise: customMessage } : 
              { template_key: selectedTemplate })
          };
          break;

        case 'affectations':
          if (!selectedSemaine) {
            throw new Error('Veuillez sélectionner une semaine');
          }
          action = 'send_to_affectations';
          data = {
            semaine_id: selectedSemaine,
            template_key: selectedTemplate
          };
          break;

        case 'bulk':
          action = 'send_bulk';
          data = {
            ...(selectedFamilles.length > 0 ? { famille_ids: selectedFamilles.map(id => parseInt(id)) } : {}),
            ...(selectedTemplate === 'personnalise' ? 
              { message_personnalise: customMessage } : 
              { template_key: selectedTemplate })
          };
          break;

        default:
          throw new Error('Type d\'envoi non valide');
      }

      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': adminSession
        },
        body: JSON.stringify({
          token: currentPlanning.token,
          action,
          data
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur envoi SMS');
      }

      setResult(responseData);

    } catch (error) {
      console.error('Erreur envoi SMS:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFamilleSelection = (familleId, checked) => {
    if (checked) {
      setSelectedFamilles(prev => [...prev, familleId]);
    } else {
      setSelectedFamilles(prev => prev.filter(id => id !== familleId));
    }
  };

  const selectAllFamilles = () => {
    setSelectedFamilles(familles.map(f => f.id.toString()));
  };

  const deselectAllFamilles = () => {
    setSelectedFamilles([]);
  };

  // Si la config SMS n'est pas chargée
  if (!smsConfig) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>📱 Gestion SMS</h3>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading">Chargement de la configuration SMS...</div>
          </div>
        </div>
      </div>
    );
  }

  // Si le SMS n'est pas configuré
  if (!smsConfig.success) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>📱 Configuration SMS</h3>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ color: '#dc3545', marginBottom: '1rem' }}>
              ⚠️ Service SMS non configuré
            </div>
            <p>{smsConfig.error}</p>
            <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
              <strong>Configuration requise :</strong>
              <ul style={{ textAlign: 'left', marginTop: '0.5rem' }}>
                <li>Variable <code>SPRYNG_API_KEY</code></li>
                <li>Variable <code>SMS_ENABLED=true</code></li>
                <li>Variable <code>SMS_SENDER</code> (optionnel)</li>
              </ul>
            </div>
            <button 
              onClick={onClose}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '800px', width: '90%' }}>
        <div className="modal-header">
          <h3>📱 Envoi de SMS</h3>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>

        {/* Statut de la configuration */}
        <div style={{ 
          background: smsConfig.config.testMode ? '#fff3cd' : '#d1edff', 
          border: `1px solid ${smsConfig.config.testMode ? '#ffeaa7' : '#74b9ff'}`,
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          <strong>
            {smsConfig.config.testMode ? '🧪 Mode Test' : '📡 Mode Production'}
          </strong>
          {smsConfig.config.testMode && (
            <span style={{ marginLeft: '0.5rem' }}>
              - Les SMS ne seront pas réellement envoyés
            </span>
          )}
        </div>

        {/* Onglets */}
        <div className="tabs" style={{ marginBottom: '1rem' }}>
          <button 
            className={`tab ${activeTab === 'individual' ? 'active' : ''}`}
            onClick={() => setActiveTab('individual')}
          >
            👤 Famille individuelle
          </button>
          <button 
            className={`tab ${activeTab === 'affectations' ? 'active' : ''}`}
            onClick={() => setActiveTab('affectations')}
          >
            📅 Affectations d'une semaine
          </button>
          <button 
            className={`tab ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            📤 Envoi en masse
          </button>
        </div>

        <div className="modal-body">
          {/* Contenu selon l'onglet actif */}
          {activeTab === 'individual' && (
            <div>
              <h4>Envoyer à une famille</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label>Famille :</label>
                <select
                  value={selectedFamille}
                  onChange={(e) => setSelectedFamille(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Sélectionner une famille...</option>
                  {familles.map(famille => (
                    <option key={famille.id} value={famille.id}>
                      {famille.nom} {famille.telephone ? `(${famille.telephone})` : '⚠️ Pas de téléphone'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'affectations' && (
            <div>
              <h4>Envoyer aux familles affectées</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label>Semaine :</label>
                <select
                  value={selectedSemaine}
                  onChange={(e) => setSelectedSemaine(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                >
                  <option value="">Sélectionner une semaine...</option>
                  {semaines.filter(s => s.is_published).map(semaine => (
                    <option key={semaine.id} value={semaine.id}>
                      {semaine.description} ({new Date(semaine.debut).toLocaleDateString()} - {new Date(semaine.fin).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div>
              <h4>Envoi en masse</h4>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <button 
                    onClick={selectAllFamilles}
                    className="btn btn-sm btn-outline"
                  >
                    Tout sélectionner
                  </button>
                  <button 
                    onClick={deselectAllFamilles}
                    className="btn btn-sm btn-outline"
                  >
                    Tout désélectionner
                  </button>
                  <span style={{ alignSelf: 'center', fontSize: '0.9rem', color: '#666' }}>
                    {selectedFamilles.length} famille(s) sélectionnée(s)
                  </span>
                </div>
                
                <div style={{ 
                  maxHeight: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  padding: '0.5rem'
                }}>
                  {familles.map(famille => (
                    <label key={famille.id} style={{ 
                      display: 'block', 
                      padding: '0.25rem 0',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedFamilles.includes(famille.id.toString())}
                        onChange={(e) => handleFamilleSelection(famille.id.toString(), e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      {famille.nom} 
                      {famille.telephone ? 
                        <span style={{ color: '#666', fontSize: '0.9rem' }}> ({famille.telephone})</span> :
                        <span style={{ color: '#dc3545', fontSize: '0.9rem' }}> ⚠️ Pas de téléphone</span>
                      }
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sélection du template */}
          <div style={{ marginBottom: '1rem' }}>
            <label>Template de message :</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            >
              {Object.entries(templates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message personnalisé si template personnalisé */}
          {selectedTemplate === 'personnalise' && (
            <div style={{ marginBottom: '1rem' }}>
              <label>Message personnalisé :</label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Tapez votre message... (Variables disponibles: {nom_famille}, {planning_name})"
                style={{ 
                  width: '100%', 
                  minHeight: '100px', 
                  padding: '0.5rem', 
                  marginTop: '0.25rem',
                  resize: 'vertical'
                }}
                maxLength={1600}
              />
              <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'right' }}>
                {customMessage.length}/1600 caractères
              </div>
            </div>
          )}

          {/* Aperçu du message */}
          {previewMessage && (
            <div style={{ marginBottom: '1rem' }}>
              <label>Aperçu du message :</label>
              <div style={{ 
                background: '#f8f9fa', 
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '0.75rem',
                marginTop: '0.25rem',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                fontSize: '0.9rem'
              }}>
                {previewMessage}
              </div>
            </div>
          )}

          {/* Résultat de l'envoi */}
          {result && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                background: result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px',
                padding: '0.75rem',
                color: result.success ? '#155724' : '#721c24'
              }}>
                {result.success ? (
                  <div>
                    <strong>✅ SMS envoyé avec succès !</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      • {result.sent} message(s) envoyé(s)
                      {result.errors > 0 && (
                        <span> • {result.errors} erreur(s)</span>
                      )}
                      {result.results && result.results.length > 0 && (
                        <details style={{ marginTop: '0.5rem' }}>
                          <summary>Détails</summary>
                          <div style={{ maxHeight: '150px', overflowY: 'auto', marginTop: '0.5rem' }}>
                            {result.results.map((r, i) => (
                              <div key={i} style={{ 
                                fontSize: '0.8rem',
                                color: r.success ? '#155724' : '#721c24',
                                marginTop: '0.25rem'
                              }}>
                                {r.success ? '✅' : '❌'} {r.famille_nom || 'Famille inconnue'}
                                {r.success && r.testMode && ' (TEST)'}
                                {!r.success && ` - ${r.error}`}
                              </div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <strong>❌ Erreur lors de l'envoi</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      {result.error}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Fermer
          </button>
          <button 
            onClick={sendSMS}
            disabled={isLoading || !selectedTemplate || 
              (activeTab === 'individual' && !selectedFamille) ||
              (activeTab === 'affectations' && !selectedSemaine) ||
              (selectedTemplate === 'personnalise' && !customMessage.trim())
            }
            className="btn btn-primary"
          >
            {isLoading ? '📤 Envoi...' : '📱 Envoyer SMS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSManager;
