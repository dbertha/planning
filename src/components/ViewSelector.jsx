import React, { useMemo, useState, useRef, useEffect } from 'react';

export function ViewSelector({ filters, onFilterChange, data, onScrollToCurrentWeek, isAdmin }) {
  const viewSelectorRef = useRef(null);
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

  // Utiliser une variable CSS personnalisée pour communiquer la hauteur
  useEffect(() => {
    if (viewSelectorRef.current) {
      const updateHeight = () => {
        const height = viewSelectorRef.current.offsetHeight;
        document.documentElement.style.setProperty('--view-selector-height', `${height}px`);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [filters.search]); // Re-mesurer quand la recherche change (affichage d'aide)

  return (
    <div ref={viewSelectorRef} className="view-selector">
      <div className="search-section">
        <div className="search-header">
          <h3>
            <span className="search-icon">🔍</span>
            Trouvez votre famille
          </h3>
          <p className="search-subtitle">Recherchez vos dates de nettoyage facilement</p>
        </div>
        
        <div className="family-filter">
          <div className="family-search-container">
            <input
              type="text"
              placeholder="Tapez le nom de votre famille..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="search-input"
            />
            {!filters.search ? (
              <div className="search-input-icon">🏠</div>
            ) : (
              <button 
                className="clear-search-icon"
                onClick={clearSearch}
                onMouseDown={(e) => e.preventDefault()}
                title="Effacer la recherche"
              >
                ✕
              </button>
            )}
            
            {showSuggestions && searchInput && (
              <div className="family-suggestions">
                {filteredFamilles.length > 0 ? (
                  filteredFamilles.map(famille => (
                    <button
                      key={famille}
                      className={`family-suggestion ${filters.search === famille ? 'active' : ''}`}
                      onClick={() => handleFamilySelect(famille)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="family-icon">👨‍👩‍👧‍👦</span>
                      {famille}
                    </button>
                  ))
                ) : (
                  <div className="no-results">
                    <span className="no-results-icon">🤔</span>
                    Aucune famille trouvée
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="action-buttons">
            {onScrollToCurrentWeek && (
              <button 
                className="current-week-btn-compact"
                onClick={onScrollToCurrentWeek}
                title="Aller à la semaine courante"
              >
                <span className="btn-icon">📅</span>
                <span className="btn-label">Actuelle</span>
              </button>
            )}
          </div>
        </div>
      </div>
        
      {/* Message d'aide pour le calendrier */}
      {filters.search && !isAdmin && (
        <div className="calendar-help">
          <span className="help-icon">💡</span>
          <div className="help-content">
            <strong>Ajoutez à votre agenda !</strong>
            <br />Cliquez sur 📅 à côté de vos dates pour les ajouter à votre calendrier personnel.
          </div>
        </div>
      )}

      <style jsx>{`
        .view-selector {
          position: sticky;
          top: 0;
          z-index: 60;
          margin-bottom: 12px;
          background: var(--color-bg-card);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          padding: 16px 20px;
          border: 1px solid rgba(116, 196, 66, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(116, 196, 66, 0.2);
        }

        .search-section {
          margin-bottom: 12px;
        }

        .search-header {
          text-align: center;
          margin-bottom: 12px;
        }

        .search-header h3 {
          margin: 0 0 4px 0;
          color: var(--color-text-primary);
          font-size: 1.1rem;
          font-weight: var(--font-weight-bold);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .search-icon {
          font-size: 1.1em;
        }

        .search-subtitle {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.85rem;
        }

        .family-filter {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 500px;
          margin: 0 auto;
        }

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .family-search-container {
          position: relative;
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px;
          padding-right: 45px;
          border: 2px solid #E0E7FF;
          border-radius: var(--border-radius);
          font-size: 15px;
          background: #FAFBFF;
          transition: all 0.3s ease;
          font-family: var(--font-family-main);
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(74, 159, 215, 0.1);
        }

        .search-input-icon {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.1rem;
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .clear-search-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .clear-search-icon:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
          transform: translateY(-50%) scale(1.1);
        }

        .family-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-bg-card);
          border: 1px solid #E0E7FF;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-medium);
          max-height: 250px;
          overflow-y: auto;
          z-index: 100;
          margin-top: 4px;
        }

        .family-suggestion {
          width: 100%;
          padding: 14px 16px;
          text-align: left;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-family-main);
        }

        .family-suggestion:hover {
          background: var(--color-bg-hover);
        }

        .family-suggestion.active {
          background: var(--gradient-primary);
          color: white;
        }

        .family-icon {
          font-size: 1.1em;
        }

        .no-results {
          padding: 16px;
          text-align: center;
          color: var(--color-text-muted);
          font-style: italic;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .no-results-icon {
          font-size: 1.2em;
        }


        .current-week-btn-compact {
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--border-radius);
          min-width: 80px;
          height: 47px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          box-shadow: var(--shadow-light);
          flex-shrink: 0;
          padding: 0 12px;
        }

        .current-week-btn-compact .btn-icon {
          font-size: 14px;
        }

        .current-week-btn-compact .btn-label {
          font-size: 12px;
          font-weight: var(--font-weight-medium);
          white-space: nowrap;
        }

        .current-week-btn-compact:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-medium);
          background: var(--color-primary);
        }

        .btn-icon {
          font-size: 1.1em;
        }

        .calendar-help {
          background: linear-gradient(135deg, #E8F5E8, #F0FFF4);
          border: 2px solid var(--color-secondary);
          border-radius: var(--border-radius);
          padding: 16px;
          margin: 20px 0;
          font-size: 14px;
          color: var(--color-text-success);
          animation: slideIn 0.4s ease-out;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          box-shadow: var(--shadow-light);
        }

        .help-icon {
          font-size: 1.3em;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .help-content {
          flex: 1;
          line-height: 1.4;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .view-selector {
            padding: 12px;
            margin-bottom: 8px;
          }

          .search-header {
            margin-bottom: 8px;
          }

          .search-header h3 {
            font-size: 1rem;
          }

          .search-subtitle {
            font-size: 0.8rem;
          }

          .family-filter {
            flex-direction: column;
            gap: 8px;
            max-width: 100%;
          }

          .action-buttons {
            align-self: center;
            justify-content: center;
          }

          .search-input {
            padding: 10px 14px;
            padding-right: 40px;
            font-size: 16px;
          }

          .current-week-btn-compact {
            min-width: 90px;
            height: 44px;
            padding: 0 10px;
          }

          .current-week-btn-compact .btn-icon {
            font-size: 14px;
          }

          .current-week-btn-compact .btn-label {
            font-size: 12px;
          }

          .calendar-help {
            font-size: 12px;
            padding: 10px;
            margin: 8px 0;
            flex-direction: column;
            gap: 6px;
            text-align: center;
          }

          .help-content {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
} 