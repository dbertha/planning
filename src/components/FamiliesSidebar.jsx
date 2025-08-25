import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

function FamilleItem({ famille, isAdmin, currentAffectations, classes }) {
  // Calculer les noms des classes préférées
  const getPreferencesNoms = () => {
    if (!famille.classes_preferences || famille.classes_preferences.length === 0) return [];
    return famille.classes_preferences
      .map(classeId => {
        const classe = classes.find(c => c.id === classeId);
        return classe ? classe.nom : classeId;
      })
      .filter(Boolean);
  };
  
  const preferencesNoms = getPreferencesNoms();
  const [{ isDragging }, drag] = useDrag({
    type: 'famille',
    item: { 
      id: famille.id, 
      nom: famille.nom,
      type: 'famille',
      telephone: famille.telephone,
      preferences: famille.classes_preferences || []
    },
    canDrag: isAdmin,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Calculer l'état de progression
  const isComplete = currentAffectations >= famille.nb_nettoyage;
  const progressPercentage = Math.min((currentAffectations / famille.nb_nettoyage) * 100, 100);

  return (
    <div
      ref={isAdmin ? drag : null}
      className={`famille-item ${isDragging ? 'dragging' : ''} ${!isAdmin ? 'readonly' : ''} ${isComplete ? 'complete' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="famille-nom">{famille.nom}</div>
      <div className="famille-details">
        <span className="telephone">📞 {famille.telephone}</span>
        <span className="nettoyages">🔢 {famille.nb_nettoyage}/an</span>
        <span className={`affectations ${isComplete ? 'complete' : ''}`}>
          📊 {currentAffectations}/{famille.nb_nettoyage}
          {isComplete && ' ✅'}
        </span>
      </div>
      {preferencesNoms && preferencesNoms.length > 0 && (
        <div className="preferences">
          💚 {preferencesNoms.join(', ')}
        </div>
      )}
      {isAdmin && (
        <div className="drag-hint">
          ⬇️ Glisser vers une cellule
        </div>
      )}
    </div>
  );
}

export function FamiliesSidebar({ familles, affectations, classes, isAdmin, filters, onFilterChange }) {
  const [collapsed, setCollapsed] = useState(false);

  // Calculer le nombre d'affectations actuelles pour chaque famille
  const getFamilleAffectationsCount = (familleId) => {
    return affectations.filter(aff => aff.familleId === familleId).length;
  };

  // Filtrer les familles selon la recherche
  const filteredFamilles = familles.filter(famille => {
    if (!famille.is_active) return false; // Masquer les archivées
    if (filters.search) {
      return famille.nom.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });



  // Grouper par préférences si admin (utiliser classes_preferences au lieu de preferences_noms)
  const famillesAvecPreferences = filteredFamilles.filter(f => 
    f.classes_preferences && f.classes_preferences.length > 0
  );
  const famillesSansPreferences = filteredFamilles.filter(f => 
    !f.classes_preferences || f.classes_preferences.length === 0
  );

  return (
    <div className={`families-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h4>
          👨‍👩‍👧‍👦 Familles ({filteredFamilles.length})
        </h4>
        <button 
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Barre de recherche */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher une famille..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>

          {isAdmin && (
            <div className="drag-instructions">
              🎯 <em>Glissez une famille vers une cellule du planning</em>
            </div>
          )}

          <div className="families-list">
            {/* Familles avec préférences */}
            {famillesAvecPreferences.length > 0 && (
              <div className="families-group">
                <h5>💚 Avec préférences ({famillesAvecPreferences.length})</h5>
                {famillesAvecPreferences.map(famille => (
                  <FamilleItem 
                    key={famille.id} 
                    famille={famille} 
                    isAdmin={isAdmin}
                    currentAffectations={getFamilleAffectationsCount(famille.id)}
                    classes={classes}
                  />
                ))}
              </div>
            )}

            {/* Familles sans préférences */}
            {famillesSansPreferences.length > 0 && (
              <div className="families-group">
                <h5>⚪ Sans préférences ({famillesSansPreferences.length})</h5>
                {famillesSansPreferences.map(famille => (
                  <FamilleItem 
                    key={famille.id} 
                    famille={famille} 
                    isAdmin={isAdmin}
                    currentAffectations={getFamilleAffectationsCount(famille.id)}
                    classes={classes}
                  />
                ))}
              </div>
            )}

            {filteredFamilles.length === 0 && (
              <div className="empty-families">
                <p>Aucune famille trouvée</p>
                {isAdmin && (
                  <p>Utilisez l'interface d'administration pour ajouter des familles.</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .families-sidebar {
          width: 300px;
          background: white;
          border-right: 1px solid #ddd;
          height: 100vh;
          overflow-y: auto;
          position: sticky;
          top: 0;
          transition: width 0.3s ease;
        }

        .families-sidebar.collapsed {
          width: 50px;
        }

        .sidebar-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h4 {
          margin: 0;
          color: #333;
          font-size: 14px;
        }

        .collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .collapse-btn:hover {
          background: #e9ecef;
        }

        .search-bar {
          padding: 12px;
          border-bottom: 1px solid #eee;
        }

        .search-bar input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .drag-instructions {
          padding: 8px 12px;
          background: #e7f3ff;
          border-bottom: 1px solid #bee5eb;
          font-size: 12px;
          color: #0c5460;
        }

        .families-list {
          padding: 8px;
        }

        .families-group {
          margin-bottom: 16px;
        }

        .families-group h5 {
          margin: 0 0 8px 0;
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
          font-weight: 600;
        }

        .famille-item {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 8px;
          margin-bottom: 6px;
          cursor: ${isAdmin ? 'grab' : 'default'};
          transition: all 0.2s;
        }

        .famille-item:hover {
          background: ${isAdmin ? '#e9ecef' : '#f8f9fa'};
          border-color: ${isAdmin ? '#adb5bd' : '#dee2e6'};
        }

        .famille-item.dragging {
          transform: rotate(5deg);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .famille-item.readonly {
          cursor: default;
          opacity: 0.8;
        }

        .famille-nom {
          font-weight: 600;
          color: #333;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .famille-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 10px;
          color: #666;
        }

        .preferences {
          font-size: 10px;
          color: #28a745;
          margin-top: 4px;
          font-weight: 500;
        }

        .drag-hint {
          font-size: 9px;
          color: #007bff;
          text-align: center;
          margin-top: 4px;
          opacity: 0.7;
        }

        .empty-families {
          text-align: center;
          color: #666;
          padding: 20px;
          font-size: 12px;
        }

        .empty-families p {
          margin: 4px 0;
        }

        /* Styles pour les familles complètes */
        .famille-item.complete {
          background: #d4edda;
          border-color: #c3e6cb;
        }

        .famille-item.complete:hover {
          background: #c8e6c9;
          border-color: #a5d6a7;
        }

        .affectations.complete {
          color: #155724;
          font-weight: 600;
        }

                 @media (max-width: 768px) {
           .families-sidebar {
             width: 100%;
             height: auto;
             max-height: 300px;
             position: relative;
             border-right: none;
             border-bottom: 1px solid #ddd;
             overflow-y: auto;
           }

           .families-sidebar.collapsed {
             width: 100%;
             height: 50px;
             max-height: 50px;
           }

           .families-list {
             max-height: 200px;
             overflow-y: auto;
           }

           .sidebar-header h4 {
             font-size: 12px;
           }

           .famille-item {
             padding: 6px;
             margin-bottom: 4px;
           }

           .famille-nom {
             font-size: 12px;
           }

           .famille-details {
             font-size: 9px;
           }
         }

         @media (max-width: 480px) {
           .families-sidebar {
             max-height: 250px;
           }

           .families-sidebar.collapsed {
             height: 40px;
             max-height: 40px;
           }

           .sidebar-header {
             padding: 12px;
           }

           .sidebar-header h4 {
             font-size: 11px;
           }

           .search-bar {
             padding: 8px;
           }

           .search-bar input {
             padding: 6px;
             font-size: 12px;
           }

           .drag-instructions {
             padding: 6px 8px;
             font-size: 10px;
           }

           .families-list {
             padding: 6px;
             max-height: 150px;
           }

           .famille-item {
             padding: 4px;
             margin-bottom: 3px;
           }

           .famille-nom {
             font-size: 11px;
           }

           .famille-details {
             font-size: 8px;
           }

           .preferences {
             font-size: 8px;
           }

           .drag-hint {
             font-size: 7px;
           }
         }
      `}</style>
    </div>
  );
} 