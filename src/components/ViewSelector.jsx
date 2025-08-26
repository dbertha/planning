import React, { useMemo, useState } from 'react';

export function ViewSelector({ filters, onFilterChange, data, onScrollToCurrentWeek }) {
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Créer une liste unique de familles à partir des affectations
  const familles = useMemo(() => {
    if (!data.affectations || data.affectations.length === 0) return [];
    const uniqueFamilles = new Set(data.affectations.map(a => a.familleNom));
    return Array.from(uniqueFamilles).filter(Boolean).sort();
  }, [data.affectations]);

  // Filtrer les familles basé sur la recherche
  const filteredFamilles = useMemo(() => {
    if (!searchInput) return familles;
    return familles.filter(famille => 
      famille.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [familles, searchInput]);

  const handleFamilySelect = (famille) => {
    onFilterChange({
      ...filters,
      search: famille
    });
    setSearchInput(famille);
    setShowSuggestions(false);
  };

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const clearSearch = () => {
    onFilterChange({
      ...filters,
      search: ''
    });
    setSearchInput('');
    setShowSuggestions(false);
  };

  return (
    <div className="view-selector">
      <div className="filters-row">
        <div className="family-filter">
          <div className="family-search-container">
          <input
            type="text"
            placeholder="Rechercher votre famille..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="search-input"
          />
          {showSuggestions && searchInput && (
            <div className="family-suggestions">
              {filteredFamilles.map(famille => (
                <button
                  key={famille}
                  className={`family-suggestion ${filters.search === famille ? 'active' : ''}`}
                  onClick={() => handleFamilySelect(famille)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {famille}
                </button>
              ))}
            </div>
          )}
        </div>
        {filters.search && (
          <button 
            className="clear-search"
            onClick={clearSearch}
            onMouseDown={(e) => e.preventDefault()}
          >
            ✕
          </button>
        )}
        </div>
        
        {/* Navigation rapide */}
        <div className="quick-actions">
          {onScrollToCurrentWeek && (
            <button 
              className="current-week-btn"
              onClick={onScrollToCurrentWeek}
              title="Aller à la semaine courante"
            >
              📅 Semaine actuelle
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .view-selector {
          margin-bottom: 16px;
          position: sticky;
          top: 0;
          z-index: 50;
          background: white;
          border-bottom: 1px solid #eee;
          padding: 12px 0;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .family-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 300px;
        }

        .family-search-container {
          position: relative;
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 14px;
          background: white;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
        }

        .family-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          max-height: 200px;
          overflow-y: auto;
          z-index: 100;
        }

        .family-suggestion {
          width: 100%;
          padding: 12px 16px;
          text-align: left;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }

        .family-suggestion:hover {
          background: #f8f9fa;
        }

        .family-suggestion.active {
          background: #e3f2fd;
          color: #1976d2;
        }

        .clear-search {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .clear-search:hover {
          background: #c82333;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .current-week-btn {
          background: #28a745;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .current-week-btn:hover {
          background: #218838;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .filters-row {
            flex-direction: column;
            gap: 12px;
          }

          .family-filter {
            min-width: 100%;
          }

          .quick-actions {
            width: 100%;
            justify-content: center;
          }

          .current-week-btn {
            flex: 1;
            max-width: 200px;
          }
        }
      `}</style>
    </div>
  );
} 