import React, { useMemo } from 'react';
import { AddToCalendarButton } from './AddToCalendarButton';

export function MobilePlanningView({ data, filters, isAdmin, canEdit }) {
  // Fonction pour formater les dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Fonction pour trouver la semaine courante
  const getCurrentWeekId = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return data.semaines?.find(semaine => {
      const debut = new Date(semaine.debut);
      const fin = new Date(semaine.fin);
      const todayDate = new Date(today);
      
      return todayDate >= debut && todayDate <= fin;
    })?.id;
  };

  // Filtrer et organiser les données pour l'affichage mobile
  const mobileData = useMemo(() => {
    if (!data.semaines || !data.affectations || !data.classes) return [];

    // Filtrer les affectations par famille si recherche active
    let filteredAffectations = data.affectations;
    if (filters.search) {
      filteredAffectations = data.affectations.filter(affectation => 
        affectation.familleNom.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Grouper par semaine
    const semaineGroups = data.semaines.map(semaine => {
      const affectationsSemaine = filteredAffectations.filter(
        affectation => affectation.semaineId === semaine.id
      );

      return {
        semaine,
        affectations: affectationsSemaine,
        isCurrentWeek: semaine.id === getCurrentWeekId()
      };
    }).filter(group => {
      // Si recherche active, ne montrer que les semaines avec des affectations
      return !filters.search || group.affectations.length > 0;
    });

    return semaineGroups;
  }, [data, filters.search]);

  return (
    <div className="mobile-planning-view">
      {mobileData.length === 0 ? (
        <div className="no-results">
          {filters.search ? (
            <>
              <h3>🔍 Aucun résultat</h3>
              <p>Aucune affectation trouvée pour "<strong>{filters.search}</strong>"</p>
            </>
          ) : (
            <>
              <h3>📋 Planning vide</h3>
              <p>Aucune affectation programmée</p>
            </>
          )}
        </div>
      ) : (
        <div className="weeks-list">
          {mobileData.map(({ semaine, affectations, isCurrentWeek }) => (
            <div 
              key={semaine.id} 
              className={`week-card ${isCurrentWeek ? 'current-week' : ''} ${canEdit && semaine.hasOwnProperty('publiee') && !semaine.publiee ? 'unpublished' : ''}`}
              id={`week-${semaine.id}`}
            >
              {/* En-tête de semaine */}
              <div className="week-header">
                <div className="week-dates">
                  <span className="week-period">
                    {formatDate(semaine.debut)} - {formatDate(semaine.fin)}
                  </span>
                  {isCurrentWeek && (
                    <span className="current-badge">👉 Cette semaine</span>
                  )}
                </div>
                {semaine.type === 'SPECIAL' && (
                  <div className="week-special">
                    {semaine.description}
                  </div>
                )}
                {canEdit && semaine.hasOwnProperty('publiee') && !semaine.publiee && (
                  <div className="unpublished-badge">
                    🔒 Non publiée
                  </div>
                )}
              </div>

              {/* Affectations de la semaine */}
              <div className="week-content">
                {affectations.length === 0 ? (
                  <div className="no-assignments">
                    <span>⚪ Aucune affectation</span>
                  </div>
                ) : (
                  <div className="assignments-list">
                    {affectations.map(affectation => {
                      // Trouver la classe correspondante
                      const classe = data.classes?.find(c => c.id === affectation.classeId);
                      // Trouver la famille correspondante
                      let famille = data.familles?.find(f => f.id === affectation.familleId);
                      
                      // Si famille non trouvée, créer un objet temporaire pour le calendrier
                      if (!famille && affectation.familleNom) {
                        famille = {
                          id: affectation.familleId,
                          nom: affectation.familleNom,
                          email: '',
                          telephone: ''
                        };
                      }

                      // Vérifier si l'affectation correspond aux préférences de la famille
                      const isOutOfPreference = isAdmin && famille && famille.classes_preferences && 
                        famille.classes_preferences.length > 0 && 
                        !famille.classes_preferences.includes(affectation.classeId);

                      // Vérifier si l'affectation viole une exclusion temporelle de la famille
                      const violatesExclusion = () => {
                        if (!famille || !famille.exclusions || !semaine) {
                          return false;
                        }

                        const semaineStart = new Date(semaine.debut);
                        const semaineEnd = new Date(semaine.fin);

                        return famille.exclusions.some(exclusion => {
                          const exclusionStart = new Date(exclusion.date_debut);
                          const exclusionEnd = new Date(exclusion.date_fin);
                          
                          return (
                            (exclusionStart <= semaineStart && exclusionEnd >= semaineStart) ||
                            (exclusionStart <= semaineEnd && exclusionEnd >= semaineEnd) ||
                            (exclusionStart >= semaineStart && exclusionEnd <= semaineEnd)
                          );
                        });
                      };

                      const hasExclusionViolation = isAdmin && affectation && violatesExclusion();
                      
                      return (
                        <div 
                          key={affectation.id} 
                          className={`assignment-item ${isOutOfPreference ? 'out-of-preference' : ''} ${hasExclusionViolation ? 'exclusion-violation' : ''}`}
                          style={{ borderLeftColor: affectation.classeCouleur }}
                        >
                          <div className="assignment-header">
                            <div className="assignment-class">
                              <span 
                                className="class-color"
                                style={{ backgroundColor: affectation.classeCouleur }}
                              ></span>
                              <span className="class-name">{affectation.classeNom}</span>
                            </div>
                            {!isAdmin && classe && famille && filters?.search && (
                              affectation?.familleNom?.toLowerCase().includes(filters.search.toLowerCase()) || 
                              filters.search.toLowerCase().includes(affectation?.familleNom?.toLowerCase())
                            ) && (
                              <AddToCalendarButton 
                                affectation={affectation}
                                semaine={semaine}
                                classe={classe}
                                famille={famille}
                                size="medium"
                                mode="public"
                              />
                            )}
                          </div>
                          <div className="assignment-family">
                            {affectation.familleNom}
                          </div>
                          {affectation.notes && (
                            <div className="assignment-notes">
                              💬 {affectation.notes}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .mobile-planning-view {
          max-width: 100%;
          padding: 0 16px;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          background: #f8f9fa;
          border-radius: 12px;
          margin: 20px 0;
        }

        .no-results h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .no-results p {
          margin: 0;
          font-size: 14px;
        }

        .weeks-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 20px;
        }

        .week-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .week-card.current-week {
          background: linear-gradient(135deg, #e8f5e8, #ffffff);
          border: 2px solid #28a745;
          box-shadow: 0 4px 12px rgba(40,167,69,0.2);
        }

        .week-card.unpublished {
          background: linear-gradient(135deg, #fff9e6, #ffffff);
          border: 2px solid #ffc107;
        }

        .week-header {
          background: #f8f9fa;
          padding: 16px;
          border-bottom: 1px solid #eee;
        }

        .week-card.current-week .week-header {
          background: linear-gradient(135deg, #d4edda, #f8f9fa);
        }

        .week-card.unpublished .week-header {
          background: linear-gradient(135deg, #fff3cd, #f8f9fa);
        }

        .week-dates {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .week-period {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }

        .current-badge {
          background: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .week-special {
          background: #e7f3ff;
          color: #0066cc;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          margin-top: 8px;
        }

        .unpublished-badge {
          background: #ffc107;
          color: #212529;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          margin-top: 8px;
          display: inline-block;
        }

        .week-content {
          padding: 16px;
        }

        .no-assignments {
          text-align: center;
          padding: 20px;
          color: #999;
          font-style: italic;
        }

        .assignments-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .assignment-item {
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid;
          padding: 12px;
          transition: background-color 0.2s ease;
        }

        .assignment-item:hover {
          background: #e9ecef;
        }

        .assignment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .assignment-class {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .class-color {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .class-name {
          font-weight: 500;
          color: #495057;
          font-size: 14px;
        }

        .assignment-family {
          font-weight: 600;
          color: #333;
          font-size: 16px;
          margin-bottom: 4px;
        }

        .assignment-notes {
          font-size: 13px;
          color: #666;
          font-style: italic;
          margin-top: 4px;
        }

        /* Scroll smooth pour navigation */
        :global(html) {
          scroll-behavior: smooth;
        }

        /* Animation d'entrée */
        .week-card {
          animation: slideInUp 0.3s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
