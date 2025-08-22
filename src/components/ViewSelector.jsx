import React, { useMemo, useState } from 'react';

export function ViewSelector({ filters, onFilterChange, data }) {
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Créer une liste unique de familles à partir des affectations
  const familles = useMemo(() => {
    const uniqueFamilles = new Set(data.affectations.map(a => a.famille));
    return Array.from(uniqueFamilles).sort();
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
    </div>
  );
} 