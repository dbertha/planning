import React, { useState, useEffect } from 'react';

function ClassesManager({ token, canEdit, refreshData }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Formulaire pour nouvelle classe
  const [newClasse, setNewClasse] = useState({
    id: '',
    nom: '',
    couleur: '#ffcccb',
    ordre: 0,
    description: '',
    instructions_pdf_url: ''
  });

  const couleursPredefinies = [
    '#ffcccb', '#ffd700', '#90ee90', '#ff6961', '#87ceeb',
    '#dda0dd', '#98fb98', '#f0e68c', '#ff7f50', '#20b2aa'
  ];

  useEffect(() => {
    loadClasses();
  }, [token]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/planning?token=${token}&type=classes`);
      
      if (!response.ok) throw new Error('Erreur lors du chargement des classes');
      
      const data = await response.json();
      setClasses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClasse = async (e) => {
    e.preventDefault();
    if (!newClasse.id.trim() || !newClasse.nom.trim()) {
      setError('ID et nom sont obligatoires');
      return;
    }

    // Vérifier que l'ID n'existe pas déjà
    if (classes.some(classe => classe.id === newClasse.id)) {
      setError('Cet ID de classe existe déjà');
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
          type: 'classe',
          data: newClasse
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      setNewClasse({
        id: '',
        nom: '',
        couleur: '#ffcccb',
        ordre: 0,
        description: '',
        instructions_pdf_url: ''
      });
      setShowAddForm(false);
      await loadClasses();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClasse = async (classeId) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la classe ${classeId} ?`)) {
      return;
    }

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
          type: 'classe',
          id: classeId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await loadClasses();
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
      const classes = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const classe = {};
        headers.forEach((header, index) => {
          classe[header] = values[index] || '';
        });
        return classe;
      });

      // Envoyer à l'API
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': localStorage.getItem('adminSessionToken')
        },
        body: JSON.stringify({
          token,
          type: 'import_classes',
          data: {
            classes,
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
      await loadClasses();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`/api/planning?token=${token}&type=classes_template`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template_classes.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const generateClassesFromTemplate = () => {
    const template = [
      { id: 'A', nom: 'Partie A - Rez-de-chaussée', couleur: '#ffcccb', ordre: 1 },
      { id: 'B', nom: 'Partie B - Cuisine', couleur: '#ffd700', ordre: 2 },
      { id: 'C', nom: 'Partie C - 1er étage', couleur: '#90ee90', ordre: 3 },
      { id: 'D', nom: 'Partie D - 2ème étage', couleur: '#ff6961', ordre: 4 },
      { id: 'E', nom: 'Partie E - Extérieur', couleur: '#87ceeb', ordre: 5 }
    ];

    setClasses(template);
    setShowAddForm(false);
  };

  const saveAllClasses = async () => {
    try {
      setLoading(true);
      
      // Supprimer toutes les classes existantes
      for (const classe of classes) {
        if (classe.id) {
          try {
            await fetch('/api/planning', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'X-Admin-Session': localStorage.getItem('adminSessionToken')
              },
              body: JSON.stringify({
                token,
                type: 'classe',
                id: classe.id
              })
            });
          } catch (err) {
            // Ignorer les erreurs de suppression
          }
        }
      }

      // Créer les nouvelles classes
      for (const classe of classes) {
        await fetch('/api/planning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Admin-Session': localStorage.getItem('adminSessionToken')
          },
          body: JSON.stringify({
            token,
            type: 'classe',
            data: classe
          })
        });
      }

      await loadClasses();
      // refreshData() supprimé pour éviter le rechargement complet
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classes-manager">
      <div className="manager-header">
        <h3>🏠 Gestion des Classes</h3>
        <div className="header-actions">
          <button onClick={generateClassesFromTemplate} className="btn btn-secondary">
            📋 Template Standard
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            ➕ Ajouter Classe
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Import Excel/CSV */}
      <div className="import-section">
        <h4>📊 Import Excel/CSV</h4>
        <div className="import-controls">
          <button
            onClick={downloadTemplate}
            className="btn btn-outline"
            disabled={loading}
          >
            📥 Télécharger Template
          </button>
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
                    Ligne {error.ligne} ({error.classe}): {error.erreur}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="import-help">
          <p><strong>Format attendu :</strong> CSV avec colonnes : id, nom, couleur, ordre, description</p>
          <p><strong>Exemple :</strong> SALLE_A, Salle A, #ffcccb, 1, Description de la salle</p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="add-form">
          <h4>➕ Nouvelle Classe</h4>
          <form onSubmit={handleAddClasse}>
            <div className="form-row">
              <div className="form-group">
                <label>ID classe *</label>
                <input
                  type="text"
                  value={newClasse.id}
                  onChange={(e) => setNewClasse({ ...newClasse, id: e.target.value.toUpperCase() })}
                  placeholder="A, B, C..."
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Ordre d'affichage</label>
                <input
                  type="number"
                  value={newClasse.ordre}
                  onChange={(e) => setNewClasse({ ...newClasse, ordre: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nom de la classe *</label>
              <input
                type="text"
                value={newClasse.nom}
                onChange={(e) => setNewClasse({ ...newClasse, nom: e.target.value })}
                placeholder="Partie A - Rez-de-chaussée"
                required
              />
            </div>

            <div className="form-group">
              <label>Couleur</label>
              <div className="color-selection">
                <input
                  type="color"
                  value={newClasse.couleur}
                  onChange={(e) => setNewClasse({ ...newClasse, couleur: e.target.value })}
                />
                <div className="predefined-colors">
                  {couleursPredefinies.map(couleur => (
                    <button
                      key={couleur}
                      type="button"
                      className={`color-btn ${newClasse.couleur === couleur ? 'active' : ''}`}
                      style={{ backgroundColor: couleur }}
                      onClick={() => setNewClasse({ ...newClasse, couleur })}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newClasse.description}
                onChange={(e) => setNewClasse({ ...newClasse, description: e.target.value })}
                rows="3"
                placeholder="Description détaillée de la zone..."
              />
            </div>

            <div className="form-group">
              <label>📄 Instructions PDF (URL)</label>
              <input
                type="url"
                value={newClasse.instructions_pdf_url}
                onChange={(e) => setNewClasse({ ...newClasse, instructions_pdf_url: e.target.value })}
                placeholder="https://example.com/instructions-classe-A.pdf"
              />
              <small>URL vers un PDF avec les instructions de nettoyage pour cette classe</small>
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

      {/* Liste des classes */}
      <div className="classes-list">
        <div className="list-header">
          <h4>🏗️ Classes ({classes.length})</h4>
          {classes.length > 0 && (
            <button onClick={saveAllClasses} className="btn btn-success" disabled={loading}>
              💾 Sauvegarder tout
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="classes-grid">
            {classes.map((classe, index) => (
              <div key={classe.id || index} className="classe-card">
                <div className="classe-header">
                  <div className="classe-id" style={{ backgroundColor: classe.couleur }}>
                    {classe.id}
                  </div>
                  <div className="classe-info">
                    <h5>{classe.nom}</h5>
                    <span className="ordre">Ordre: {classe.ordre}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteClasse(classe.id)}
                    className="delete-btn"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
                
                {classe.description && (
                  <div className="classe-description">
                    {classe.description}
                  </div>
                )}

                {classe.instructions_pdf_url && (
                  <div className="classe-pdf">
                    <a 
                      href={classe.instructions_pdf_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="pdf-link"
                    >
                      📄 Instructions PDF
                    </a>
                  </div>
                )}

                <div className="classe-meta">
                  <span style={{ color: classe.couleur }}>●</span>
                  <span>Couleur: {classe.couleur}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {classes.length === 0 && !loading && (
          <div className="empty-state">
            <p>Aucune classe définie</p>
            <p>Utilisez le template standard ou créez vos propres classes.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .classes-manager {
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

        .color-selection {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .predefined-colors {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .color-btn {
          width: 24px;
          height: 24px;
          border: 2px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-btn.active,
        .color-btn:hover {
          border-color: #007bff;
          transform: scale(1.1);
        }

        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .list-header h4 {
          margin: 0;
          color: #333;
        }

        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .classe-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 16px;
        }

        .classe-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .classe-id {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #333;
          flex-shrink: 0;
        }

        .classe-info {
          flex: 1;
        }

        .classe-info h5 {
          margin: 0 0 4px 0;
          color: #333;
        }

        .ordre {
          font-size: 12px;
          color: #666;
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

        .classe-description {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }

        .classe-pdf {
          margin-bottom: 8px;
        }

        .pdf-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #007bff;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          border: 1px solid #007bff;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .pdf-link:hover {
          background: #007bff;
          color: white;
        }

        .classe-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #666;
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

export default ClassesManager; 