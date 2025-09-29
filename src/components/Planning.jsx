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
        // Calculer l'offset total des éléments sticky
        const calculateStickyOffset = () => {
          let offset = 0;
          
          // Hauteur du ViewSelector sticky
          const viewSelector = document.querySelector('.view-selector');
          if (viewSelector) {
            offset += viewSelector.offsetHeight;
          }
          
          // Hauteur du StickyClassesHeader s'il est visible
          const stickyHeader = document.querySelector('.sticky-classes-header');
          if (stickyHeader && stickyHeader.style.display !== 'none') {
            offset += stickyHeader.offsetHeight;
          }
          
          // Ajouter une marge de sécurité
          offset += 16;
          
          return offset;
        };

        const offset = calculateStickyOffset();
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const targetPosition = absoluteElementTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
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
          <div className="welcome-header">
            <div className="welcome-icon">🏫</div>
            <h1>Bienvenue sur le Planning de Nettoyage</h1>
            <p className="welcome-subtitle">Consultez facilement les dates d'entretien de votre famille</p>
          </div>
          
          <form onSubmit={handleTokenSubmit}>
            <div className="input-group">
              <label htmlFor="token-input">Code d'accès du planning :</label>
              <input
                id="token-input"
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Entrez le code reçu par l'école..."
                required
              />
              <button type="submit" className="access-button">
                <span className="button-icon">✨</span>
                Voir le planning
              </button>
            </div>
          </form>

          <div className="help-section">
            <div className="help-card">
              <div className="help-icon">💌</div>
              <p><strong>Vous n'avez pas le code ?</strong><br/>
                 Contactez l'école ou l'association des parents</p>
            </div>
            <div className="help-card">
              <div className="help-icon">👥</div>
              <p><strong>Première visite ?</strong><br/>
                 Le planning vous montre quand c'est votre tour</p>
            </div>
          </div>
        </div>

        <style jsx>{`
          .token-form {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient-nature);
            padding: 20px;
          }

          .token-container {
            background: var(--color-bg-card);
            padding: 48px;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-medium);
            max-width: 560px;
            width: 100%;
            text-align: center;
          }

          .welcome-header {
            margin-bottom: 32px;
          }

          .welcome-icon {
            font-size: 4rem;
            margin-bottom: 16px;
            opacity: 0.9;
          }

          .token-container h1 {
            margin: 0 0 12px 0;
            color: var(--color-text-primary);
            font-size: 1.8rem;
            font-weight: var(--font-weight-bold);
            line-height: 1.3;
          }

          .welcome-subtitle {
            margin: 0 0 32px 0;
            color: var(--color-text-secondary);
            font-size: 1.1rem;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 32px;
            text-align: left;
          }

          .input-group label {
            font-weight: var(--font-weight-medium);
            color: var(--color-text-primary);
            font-size: 1rem;
            margin-bottom: 8px;
          }

          .input-group input {
            padding: 16px;
            border: 2px solid #E0E7FF;
            border-radius: var(--border-radius-small);
            font-size: 16px;
            transition: all 0.2s ease;
            background: #FAFBFF;
          }

          .input-group input:focus {
            outline: none;
            border-color: var(--color-primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
          }

          .access-button {
            padding: 16px 32px;
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--border-radius-small);
            cursor: pointer;
            font-size: 16px;
            font-weight: var(--font-weight-medium);
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .access-button:hover {
            background: #3A7BD5;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
          }

          .button-icon {
            font-size: 1.1em;
          }

          .help-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-top: 24px;
          }

          .help-card {
            background: #F8FAFF;
            padding: 20px;
            border-radius: var(--border-radius-small);
            text-align: center;
            border: 1px solid #E0E7FF;
          }

          .help-icon {
            font-size: 2rem;
            margin-bottom: 8px;
          }

          .help-card p {
            margin: 0;
            font-size: 14px;
            color: var(--color-text-secondary);
            line-height: 1.4;
          }

          .help-card strong {
            color: var(--color-text-primary);
          }

          @media (max-width: 768px) {
            .token-container {
              padding: 32px 24px;
              margin: 16px;
            }

            .welcome-icon {
              font-size: 3rem;
            }

            .token-container h1 {
              font-size: 1.5rem;
            }

            .welcome-subtitle {
              font-size: 1rem;
            }

            .help-section {
              grid-template-columns: 1fr;
              gap: 12px;
            }

            .help-card {
              padding: 16px;
            }
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
      {/* Header adaptatif selon le mode */}
      <div className="planning-header">
        <div className="planning-info">
          {!isAdmin ? (
            /* Vue Parent - Plus chaleureuse */
            <div className="parent-welcome">
              <div className="welcome-row">
                <h1>
                  <span className="welcome-icon">🏫</span>
                  {data.planning?.name || 'Planning de l\'École'}
                </h1>
              </div>
              {data.planning?.annee_scolaire && (
                <div className="school-year">
                  <span className="year-badge">📅 Année scolaire {data.planning.annee_scolaire}</span>
                </div>
              )}
              <p className="parent-subtitle">
                Consultez facilement les dates de nettoyage et trouvez quand c'est votre tour !
              </p>
            </div>
          ) : (
            /* Vue Admin - Plus technique */
            <div className="admin-header">
              <h1>{data.planning?.name || 'Planning de Nettoyage'}</h1>
              {data.planning?.description && (
                <p className="planning-description">{data.planning.description}</p>
              )}
              {data.planning?.annee_scolaire && (
                <span className="planning-year">Année {data.planning.annee_scolaire}</span>
              )}
            </div>
          )}
        </div>

        <div className="planning-controls">
          {/* Indicateur de permissions */}
          <div className="permissions-indicator">
            {isAdmin ? (
              <span className="admin-badge">🔧 Mode Admin</span>
            ) : (
              <span className="public-badge">👀 Vue Parents</span>
            )}
          </div>

          {/* Bouton d'administration */}
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className={`admin-toggle ${showAdmin ? 'active' : ''}`}
          >
            {showAdmin ? '👁️ Vue Simple' : '⚙️ Administration'}
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
                <div className="legend-nom">{classe.nom}</div>
                {classe.description && (
                  <div className="legend-description">{classe.description}</div>
                )}
              </div>
              {classe.instructions_pdf_url && (
                <a 
                  href={classe.instructions_pdf_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="legend-pdf-link"
                  title="Instructions de nettoyage (PDF)"
                >
                  📄
                </a>
              )}
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
          padding: 12px;
          padding-bottom: 40px; /* Espace en bas pour le scroll naturel */
        }

        .planning-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 16px 20px;
          background: var(--color-bg-card);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-light);
          border: 1px solid rgba(116, 196, 66, 0.1);
        }

        /* Vue Parent - Design chaleureux mais compact */
        .parent-welcome {
          max-width: 600px;
        }

        .welcome-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .parent-welcome h1 {
          margin: 0;
          color: var(--color-text-primary);
          font-size: 1.4rem;
          font-weight: var(--font-weight-bold);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .welcome-icon {
          font-size: 1.6rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .school-year {
          margin-bottom: 4px;
        }

        .year-badge {
          background: var(--gradient-primary);
          color: white;
          padding: 4px 12px;
          border-radius: var(--border-radius-large);
          font-size: 12px;
          font-weight: var(--font-weight-medium);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          box-shadow: var(--shadow-light);
        }

        .parent-subtitle {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
          line-height: 1.3;
          font-weight: var(--font-weight-normal);
        }

        /* Vue Admin - Design plus technique */
        .admin-header h1 {
          margin: 0 0 8px 0;
          color: var(--color-text-primary);
          font-size: 1.8rem;
          font-weight: var(--font-weight-bold);
        }

        .planning-description {
          margin: 0 0 8px 0;
          color: var(--color-text-secondary);
          font-size: 16px;
        }

        .planning-year {
          background: var(--color-bg-warm);
          color: var(--color-text-primary);
          padding: 6px 14px;
          border-radius: var(--border-radius-large);
          font-size: 12px;
          font-weight: var(--font-weight-medium);
          border: 1px solid rgba(243, 156, 18, 0.2);
        }

        .planning-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }

        .permissions-indicator {
          font-size: 14px;
        }

        .admin-badge {
          background: var(--gradient-warm);
          color: white;
          padding: 8px 16px;
          border-radius: var(--border-radius-large);
          font-weight: var(--font-weight-medium);
          box-shadow: var(--shadow-light);
          border: none;
        }

        .public-badge {
          background: var(--gradient-primary);
          color: white;
          padding: 8px 16px;
          border-radius: var(--border-radius-large);
          font-weight: var(--font-weight-medium);
          box-shadow: var(--shadow-light);
          border: none;
        }

        .admin-toggle {
          padding: 12px 24px;
          border: 2px solid var(--color-primary);
          background: var(--color-bg-card);
          color: var(--color-primary);
          border-radius: var(--border-radius);
          cursor: pointer;
          font-weight: var(--font-weight-medium);
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-light);
        }

        .admin-toggle:hover {
          background: var(--color-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: var(--shadow-medium);
        }

        .admin-toggle.active {
          background: var(--color-primary);
          color: white;
          box-shadow: var(--shadow-medium);
        }

        .mobile-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
          padding: 12px;
          background: var(--color-bg-warm);
          border-radius: var(--border-radius);
          border: 1px solid rgba(243, 156, 18, 0.1);
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
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .legend-nom {
          font-weight: 500;
        }

        .legend-description {
          font-size: 10px;
          font-weight: 400;
          color: #666;
          line-height: 1.2;
        }

        .legend-pdf-link {
          color: #333;
          text-decoration: none;
          font-size: 14px;
          opacity: 0.8;
          transition: all 0.2s;
          padding: 4px;
          border-radius: 4px;
          flex-shrink: 0;
        }

        .legend-pdf-link:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.1);
          transform: scale(1.1);
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
          min-width: ${data.classes?.length ? data.classes.length * 150 + 120 + 8 : 728}px;
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
            min-width: ${data.classes?.length ? data.classes.length * 120 + 80 + 8 : 568}px;
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
            min-width: ${data.classes?.length ? data.classes.length * 100 + 60 + 8 : 468}px;
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