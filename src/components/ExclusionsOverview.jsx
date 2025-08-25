import React, { useState, useEffect } from 'react';

const ExclusionsOverview = ({ token }) => {
  const [exclusions, setExclusions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    famille: '',
    periode: 'all' // all, current, future, past
  });

  const EXCLUSION_TYPES = [
    { value: 'indisponibilite', label: '🚫 Indisponibilité', color: '#dc3545' },
    { value: 'vacances', label: '🏖️ Vacances', color: '#007bff' },
    { value: 'maladie', label: '🏥 Maladie', color: '#fd7e14' },
    { value: 'autre', label: '❓ Autre', color: '#6c757d' }
  ];

  useEffect(() => {
    loadAllExclusions();
  }, [token]);

  const loadAllExclusions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/familles?token=${token}&action=get_all_exclusions`);
      
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

  const getTypeInfo = (type) => {
    return EXCLUSION_TYPES.find(t => t.value === type) || EXCLUSION_TYPES[0];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const isCurrentPeriod = (debut, fin) => {
    const now = new Date();
    const start = new Date(debut);
    const end = new Date(fin);
    return now >= start && now <= end;
  };

  const isPastPeriod = (fin) => {
    const now = new Date();
    const end = new Date(fin);
    return now > end;
  };

  const isFuturePeriod = (debut) => {
    const now = new Date();
    const start = new Date(debut);
    return now < start;
  };

  const filteredExclusions = exclusions.filter(exclusion => {
    // Filtre par type
    if (filters.type && exclusion.type !== filters.type) return false;
    
    // Filtre par famille
    if (filters.famille && !exclusion.famille_nom.toLowerCase().includes(filters.famille.toLowerCase())) return false;
    
    // Filtre par période
    if (filters.periode === 'current' && !isCurrentPeriod(exclusion.date_debut, exclusion.date_fin)) return false;
    if (filters.periode === 'future' && !isFuturePeriod(exclusion.date_debut)) return false;
    if (filters.periode === 'past' && !isPastPeriod(exclusion.date_fin)) return false;
    
    return true;
  });

  const uniqueFamilies = [...new Set(exclusions.map(e => e.famille_nom))].sort();

  if (loading) {
    return <div className="loading">Chargement des exclusions...</div>;
  }

  return (
    <div className="exclusions-overview">
      <div className="overview-header">
        <h2>📊 Vue d'ensemble des exclusions</h2>
        <p className="overview-subtitle">
          {exclusions.length} exclusion(s) au total - {filteredExclusions.length} affichée(s)
        </p>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="filter-group">
            <label>Type d'exclusion :</label>
            <select 
              value={filters.type} 
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">Tous les types</option>
              {EXCLUSION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Famille :</label>
            <select 
              value={filters.famille} 
              onChange={(e) => setFilters({...filters, famille: e.target.value})}
            >
              <option value="">Toutes les familles</option>
              {uniqueFamilies.map(famille => (
                <option key={famille} value={famille}>{famille}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Période :</label>
            <select 
              value={filters.periode} 
              onChange={(e) => setFilters({...filters, periode: e.target.value})}
            >
              <option value="all">Toutes les périodes</option>
              <option value="current">En cours</option>
              <option value="future">À venir</option>
              <option value="past">Passées</option>
            </select>
          </div>

          <button 
            onClick={() => setFilters({type: '', famille: '', periode: 'all'})}
            className="clear-filters-btn"
          >
            🔄 Réinitialiser
          </button>
        </div>
      </div>

      {/* Liste des exclusions */}
      <div className="exclusions-list">
        {filteredExclusions.length === 0 ? (
          <div className="no-exclusions">
            <p>Aucune exclusion trouvée avec ces filtres.</p>
          </div>
        ) : (
          <div className="exclusions-table">
            <table>
              <thead>
                <tr>
                  <th>Famille</th>
                  <th>Type</th>
                  <th>Période</th>
                  <th>Durée</th>
                  <th>Statut</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredExclusions.map(exclusion => {
                  const typeInfo = getTypeInfo(exclusion.type);
                  const daysDiff = Math.ceil((new Date(exclusion.date_fin) - new Date(exclusion.date_debut)) / (1000 * 60 * 60 * 24)) + 1;
                  
                  let statusClass = '';
                  let statusText = '';
                  if (isCurrentPeriod(exclusion.date_debut, exclusion.date_fin)) {
                    statusClass = 'status-current';
                    statusText = '🔴 En cours';
                  } else if (isFuturePeriod(exclusion.date_debut)) {
                    statusClass = 'status-future';
                    statusText = '🟡 À venir';
                  } else {
                    statusClass = 'status-past';
                    statusText = '🟢 Terminée';
                  }

                  return (
                    <tr key={exclusion.id}>
                      <td className="famille-cell">
                        <strong>{exclusion.famille_nom}</strong>
                      </td>
                      <td className="type-cell">
                        <span 
                          className="type-badge"
                          style={{ backgroundColor: typeInfo.color, color: 'white' }}
                        >
                          {typeInfo.label}
                        </span>
                      </td>
                      <td className="periode-cell">
                        <div className="dates">
                          <div>{formatDate(exclusion.date_debut)}</div>
                          <div>{formatDate(exclusion.date_fin)}</div>
                        </div>
                      </td>
                      <td className="duree-cell">
                        {daysDiff} jour{daysDiff > 1 ? 's' : ''}
                      </td>
                      <td className="statut-cell">
                        <span className={`status-badge ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="notes-cell">
                        {exclusion.notes || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .exclusions-overview {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .overview-header {
          margin-bottom: 20px;
          border-bottom: 2px solid #e9ecef;
          padding-bottom: 15px;
        }

        .overview-header h2 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .overview-subtitle {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .filters-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .filters-row {
          display: flex;
          gap: 15px;
          align-items: end;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .filter-group label {
          font-size: 12px;
          font-weight: 600;
          color: #555;
        }

        .filter-group select {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .clear-filters-btn {
          padding: 8px 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .clear-filters-btn:hover {
          background: #5a6268;
        }

        .exclusions-table table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .exclusions-table th,
        .exclusions-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .exclusions-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
          font-size: 13px;
        }

        .type-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .dates {
          font-size: 13px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-current {
          background: #f8d7da;
          color: #721c24;
        }

        .status-future {
          background: #fff3cd;
          color: #856404;
        }

        .status-past {
          background: #d1edda;
          color: #155724;
        }

        .famille-cell strong {
          color: #333;
        }

        .notes-cell {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #666;
        }

        .no-exclusions {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 16px;
          color: #666;
        }

        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .exclusions-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default ExclusionsOverview;
