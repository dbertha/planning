import React, { useState, useEffect, useRef } from 'react';
import { usePlanningData } from '../hooks/usePlanningData';
import { PlanningHeader } from './PlanningHeader';
import { StickyClassesHeader } from './StickyClassesHeader';
import { PlanningGrid } from './PlanningGrid';
import { ViewSelector } from './ViewSelector';
import { FamiliesSidebar } from './FamiliesSidebar';
import { MobilePlanningView } from './MobilePlanningView';
import AdminPanel from './AdminPanel';

export function Planning() {
  // Extraire le token depuis l'URL
  const [token, setToken] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token') || '';
  });
  
  // Ref pour l'en-tête des classes original
  const originalHeaderRef = useRef(null);

  const { 
    data, 
    loading, 
    error,
    isAdmin,
    canEdit,
    loginAdmin,
    logoutAdmin,
    refreshData,
    refreshPlanningGrid,
    createAffectation,
    deleteAffectation,
    toggleSemainePublication,
    autoDistributeWeek,
    sessionToken
  } = usePlanningData(token);

  const [filters, setFilters] = useState({
    search: ''
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showAdmin, setShowAdmin] = useState(false);
  const [tokenInput, setTokenInput] = useState(token);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [gridPosition, setGridPosition] = useState({ left: 0, width: 0 });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Fonction pour mettre à jour l'état des flèches
  const updateScrollArrows = () => {
    const scrollContainer = document.querySelector('.planning-scroll-container');
    if (!scrollContainer) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    const canLeft = scrollLeft > 0;
    const canRight = scrollLeft < scrollWidth - clientWidth - 1;
    
    // Calculer la position du conteneur pour les flèches fixes
    const containerRect = scrollContainer.getBoundingClientRect();
    setGridPosition({
      left: containerRect.left,
      width: containerRect.width
    });
    
    setCanScrollLeft(canLeft);
    setCanScrollRight(canRight);
  };

  // Fonctions de navigation
  const scrollLeftArrow = () => {
    const scrollContainer = document.querySelector('.planning-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRightArrow = () => {
    const scrollContainer = document.querySelector('.planning-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Fonction pour scroller vers la semaine courante
  const scrollToCurrentWeek = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const currentWeek = data.semaines?.find(semaine => {
      const debut = new Date(semaine.debut);
      const fin = new Date(semaine.fin);
      const todayDate = new Date(today);
      
      return todayDate >= debut && todayDate <= fin;
    });

    if (currentWeek) {
      const element = document.getElementById(`week-${currentWeek.id}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
      }
    }
  };

  // Gestion du responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion des flèches de navigation (après que les données soient chargées)
  useEffect(() => {
    // Attendre que les classes soient vraiment chargées
    if (!data.classes || data.classes.length === 0 || loading) return;

    const handleScroll = () => {
      updateScrollArrows();
    };

    const handleResize = () => {
      updateScrollArrows();
    };

    // Configuration avec délai pour s'assurer que le DOM est prêt
    const timer = setTimeout(() => {
      const scrollContainer = document.querySelector('.planning-scroll-container');
      if (scrollContainer) {
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);
        
        // Force une mise à jour immédiate pour positionner les flèches
        updateScrollArrows();
        
        // Puis plusieurs mises à jour pour s'assurer que tout est correct
        setTimeout(updateScrollArrows, 50);
        setTimeout(updateScrollArrows, 200);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollContainer = document.querySelector('.planning-scroll-container');
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [data.classes, loading]);



  // Mettre à jour les flèches quand la sidebar change
  useEffect(() => {
    const timer = setTimeout(() => {
      updateScrollArrows();
    }, 350); // Attendre la fin de la transition CSS (0.3s + marge)

    return () => clearTimeout(timer);
  }, [sidebarCollapsed]);

  // Mettre à jour l'URL quand le token change
  useEffect(() => {
    if (token) {
      const url = new URL(window.location);
      url.searchParams.set('token', token);
      window.history.replaceState({}, '', url);
    }
  }, [token]);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setToken(tokenInput.trim());
    }
  };

  // Affichage du formulaire de token si pas de token
  if (!token) {
    return (
      <div className="token-form">
        <div className="token-container">
          <h1>🔒 Accès au Planning</h1>
          <p>Entrez le token d'accès pour voir le planning :</p>
          
          <form onSubmit={handleTokenSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Token d'accès (ex: abc123...)"
                required
              />
              <button type="submit">
                🔍 Accéder
              </button>
            </div>
          </form>

          <div className="help-text">
            <p>💡 Si vous êtes administrateur d'un planning, vous avez reçu un lien direct avec le token.</p>
            <p>📞 Contactez l'administrateur si vous n'avez pas accès.</p>
          </div>
        </div>

        <style jsx>{`
          .token-form {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .token-container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }

          .token-container h1 {
            margin: 0 0 16px 0;
            color: #333;
          }

          .token-container p {
            margin: 0 0 24px 0;
            color: #666;
          }

          .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
          }

          .input-group input {
            flex: 1;
            padding: 12px;
            border: 2px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          }

          .input-group input:focus {
            outline: none;
            border-color: #667eea;
          }

          .input-group button {
            padding: 12px 24px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
          }

          .input-group button:hover {
            background: #5a6fd8;
          }

          .help-text {
            background: #f8f9fa;
            padding: 16px;
            border-radius: 6px;
            text-align: left;
          }

          .help-text p {
            margin: 8px 0;
            font-size: 14px;
          }
        `}</style>
      </div>
    );
  }

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Chargement du planning...</p>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 50vh;
          gap: 16px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <h2>❌ Erreur d'accès</h2>
      <p>{error}</p>
      <button onClick={() => setToken('')} className="retry-btn">
        🔄 Essayer un autre token
      </button>
      <style jsx>{`
        .error-container {
          text-align: center;
          padding: 40px;
          color: #721c24;
          background: #f8d7da;
          border-radius: 8px;
          margin: 20px;
        }
        
        .retry-btn {
          margin-top: 16px;
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );

  return (
    <>
      {/* Shadow header sticky qui apparaît quand l'original n'est plus visible */}
      {!isMobile && data.classes && data.classes.length > 0 && (
        <StickyClassesHeader 
          classes={data.classes} 
          originalHeaderRef={originalHeaderRef}
          sidebarCollapsed={sidebarCollapsed}
        />
      )}
      
      <div className="planning">
      {/* Header avec informations du planning */}
      <div className="planning-header">
        <div className="planning-info">
          <h1>{data.planning?.name || 'Planning de Nettoyage'}</h1>
          {data.planning?.description && (
            <p className="planning-description">{data.planning.description}</p>
          )}
          {data.planning?.year && (
            <span className="planning-year">Année {data.planning.year}</span>
          )}
        </div>

        <div className="planning-controls">
          {/* Indicateur de permissions */}
          <div className="permissions-indicator">
            {isAdmin ? (
              <span className="admin-badge">🔧 Administrateur</span>
            ) : (
              <span className="public-badge">👁️ Lecture seule</span>
            )}
          </div>

          {/* Bouton d'administration */}
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className={`admin-toggle ${showAdmin ? 'active' : ''}`}
          >
            {showAdmin ? '🔧 Masquer Admin' : '⚙️ Administration'}
          </button>
        </div>
      </div>

      {/* Interface d'administration */}
      {showAdmin && (
                  <AdminPanel
            token={token}
            isAdmin={isAdmin}
            canEdit={canEdit}
            loginAdmin={loginAdmin}
            logoutAdmin={logoutAdmin}
            refreshData={refreshData}
            refreshPlanningGrid={refreshPlanningGrid}
            toggleSemainePublication={toggleSemainePublication}
            planningData={data}
            sessionToken={sessionToken}
          />
      )}
      
      {/* Filtres et sélecteurs */}
      <ViewSelector 
        filters={filters}
        onFilterChange={setFilters}
        data={data}
        isAdmin={isAdmin}
        onScrollToCurrentWeek={scrollToCurrentWeek}
      />

      {/* Légende mobile */}
      {isMobile && data.classes && data.classes.length > 0 && (
        <div className="mobile-legend">
          {data.classes.map(classe => (
            <div key={classe.id} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: classe.couleur }}
              />
              <div className="legend-text">
                {classe.nom}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Layout principal */}
      {isMobile ? (
        /* Vue mobile optimisée */
        <div className="mobile-layout">
          {data.classes && data.classes.length > 0 ? (
            <MobilePlanningView 
              data={data}
              filters={filters}
              isAdmin={isAdmin}
              canEdit={canEdit}
            />
          ) : (
            <div className="empty-planning">
              <h3>📋 Planning vide</h3>
              <p>Aucune classe ou semaine n'a été configurée pour ce planning.</p>
              {isAdmin && (
                <p>Utilisez l'interface d'administration pour configurer les classes et semaines.</p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Vue desktop avec sidebar et grille */
        <div className={`desktop-layout ${data.familles && data.familles.length > 0 ? (sidebarCollapsed ? 'sidebar-collapsed' : '') : 'no-sidebar'}`}>
          {/* Sidebar des familles (visible si des familles existent) */}
          {data.familles && data.familles.length > 0 && (
            <FamiliesSidebar
              familles={data.familles}
              affectations={data.affectations}
              classes={data.classes}
              isAdmin={isAdmin}
              filters={filters}
              onFilterChange={setFilters}
              onCollapseChange={setSidebarCollapsed}
            />
          )}

          {/* Grille de planning */}
          <div className="planning-container">
            {data.classes && data.classes.length > 0 ? (
              <>
                {/* Indicateur de classes */}
                <div className="classes-indicator">
                  <span className="classes-count">
                    🏠 {data.classes.length} classe{data.classes.length > 1 ? 's' : ''}
                  </span>
                  {data.classes.length > 5 && (
                    <span className="scroll-hint">
                      ↔️ Faites défiler horizontalement
                    </span>
                  )}
                </div>

                <div className="planning-scroll-container">
                  {/* Flèches de navigation */}
                  {!isMobile && canScrollLeft && (
                    <button className="scroll-arrow scroll-arrow-left" onClick={scrollLeftArrow}>
                      ←
                    </button>
                  )}
                  {!isMobile && canScrollRight && (
                    <button className="scroll-arrow scroll-arrow-right" onClick={scrollRightArrow}>
                      →
                    </button>
                  )}
                  
                  <div className="planning-grid-wrapper">
                    <PlanningHeader ref={originalHeaderRef} classes={data.classes} />
                    <PlanningGrid 
                      data={data}
                      filters={filters}
                      isAdmin={isAdmin}
                      canEdit={canEdit}
                      onCreateAffectation={createAffectation}
                      onDeleteAffectation={deleteAffectation}
                      onAutoDistribute={autoDistributeWeek}
                      onTogglePublish={toggleSemainePublication}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-planning">
                <h3>📋 Planning vide</h3>
                <p>Aucune classe ou semaine n'a été configurée pour ce planning.</p>
                {isAdmin && (
                  <p>Utilisez l'interface d'administration pour configurer les classes et semaines.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .planning {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          padding-bottom: 60px; /* Espace en bas pour le scroll naturel */
        }

        .planning-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #eee;
        }

        .planning-info h1 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 28px;
        }

        .planning-description {
          margin: 0 0 8px 0;
          color: #666;
          font-size: 16px;
        }

        .planning-year {
          background: #e9ecef;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          color: #495057;
        }

        .planning-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .permissions-indicator {
          font-size: 14px;
        }

        .admin-badge {
          background: #d4edda;
          color: #155724;
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 500;
        }

        .public-badge {
          background: #e2e3e5;
          color: #495057;
          padding: 6px 12px;
          border-radius: 16px;
          font-weight: 500;
        }

        .admin-toggle {
          padding: 10px 20px;
          border: 2px solid #007bff;
          background: white;
          color: #007bff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .admin-toggle:hover,
        .admin-toggle.active {
          background: #007bff;
          color: white;
        }

        .mobile-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        .legend-text {
          font-size: 12px;
          font-weight: 500;
        }

        .mobile-layout {
          width: 100%;
        }

        .desktop-layout {
          display: flex;
          gap: 0;
          margin-left: 300px; /* Compensation pour la sidebar fixe */
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        .desktop-layout.sidebar-collapsed {
          margin-left: 50px; /* Marge réduite quand sidebar collapsed */
        }

        .desktop-layout.no-sidebar {
          margin-left: 0; /* Pas de marge si pas de sidebar */
        }

        .planning-container {
          flex: 1;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .classes-indicator {
          background: #f8f9fa;
          padding: 8px 16px;
          border-bottom: 1px solid #dee2e6;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .classes-count {
          color: #495057;
          font-weight: 600;
        }

        .scroll-hint {
          color: #007bff;
          font-style: italic;
        }

        .planning-scroll-container {
          flex: 1;
          overflow-x: auto;
          overflow-y: visible;
          min-width: 0; /* Important pour le flexbox */
          scrollbar-width: thin;
          scrollbar-color: #007bff #f1f1f1;
          position: relative; /* Pour positionner les flèches */
        }

        .planning-scroll-container::-webkit-scrollbar {
          height: 8px;
        }

        .planning-scroll-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .planning-scroll-container::-webkit-scrollbar-thumb {
          background: #007bff;
          border-radius: 4px;
        }

        .planning-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #0056b3;
        }

        .planning-grid-wrapper {
          min-width: ${data.classes?.length ? data.classes.length * 150 + 120 : 720}px;
          width: 100%;
        }

        .scroll-arrow {
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #ddd;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          color: #007bff;
          z-index: 80;
          transition: all 0.2s ease;
          backdrop-filter: blur(8px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .scroll-arrow:hover {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-50%) scale(1.1);
          color: #0056b3;
        }

        .scroll-arrow-left {
          left: ${Math.max(gridPosition.left + 16, 16)}px;
        }

        .scroll-arrow-right {
          right: ${Math.max(windowWidth - (gridPosition.left + gridPosition.width) + 16, 16)}px;
        }

        @media (max-width: 768px) {
          .main-layout {
            flex-direction: column;
          }

          .planning {
            padding: 12px;
            max-width: 100vw;
            overflow-x: hidden;
          }

          .planning-container {
            border-radius: 4px;
          }

          .planning-scroll-container {
            overflow-x: auto;
            overflow-y: visible;
            -webkit-overflow-scrolling: touch;
          }

          .planning-grid-wrapper {
            min-width: ${data.classes?.length ? data.classes.length * 120 + 80 : 560}px;
          }

          .classes-indicator {
            padding: 6px 12px;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .planning {
            padding: 8px;
          }

          .planning-header {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }

          .planning-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .planning-info h1 {
            font-size: 20px;
          }

          .planning-grid-wrapper {
            min-width: ${data.classes?.length ? data.classes.length * 100 + 60 : 460}px;
          }

          .scroll-hint {
            display: block;
          }
        }

        .empty-planning {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-planning h3 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .empty-planning p {
          margin: 8px 0;
        }

        @media (max-width: 768px) {
          .planning {
            padding: 12px;
          }

          .planning-header {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }

          .planning-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .planning-info h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
    </>
  );
} 