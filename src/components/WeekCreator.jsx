import React, { useState } from 'react';

export function WeekCreator({ token, isAdmin, sessionToken, onWeekCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateNextWeek = async () => {
    if (!isAdmin || !sessionToken) {
      setError('Permissions administrateur requises');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': sessionToken
        },
        body: JSON.stringify({
          token,
          type: 'create_next_week',
          data: {}
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création');
      }

      setSuccess(result.message);
      
      // Notifier le parent pour recharger les données
      if (onWeekCreated) {
        onWeekCreated(result.semaine);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchoolYear = async () => {
    if (!isAdmin || !sessionToken) {
      setError('Permissions administrateur requises');
      return;
    }

    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir créer plusieurs semaines d\'affilée ? ' +
      'Cela créera jusqu\'à 40 semaines consécutives de type "nettoyage".'
    );

    if (!confirmed) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Pour l'instant, on crée les semaines une par une
      // Dans une version future, on pourrait créer un endpoint dédié
      let createdCount = 0;
      const maxWeeks = 45; // Sécurité pour éviter les boucles infinies

      for (let i = 0; i < maxWeeks; i++) {
        try {
          const response = await fetch('/api/planning', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Admin-Session': sessionToken
            },
            body: JSON.stringify({
              token,
              type: 'create_next_week',
              data: {}
            })
          });

          const result = await response.json();

          if (response.ok) {
            createdCount++;
          } else if (result.error === 'Cette semaine existe déjà') {
            // Continuer avec la suivante
            continue;
          } else {
            // Autre erreur, arrêter
            break;
          }
        } catch (weekError) {
          // Erreur pour cette semaine, continuer
          console.warn('Erreur création semaine:', weekError);
          break;
        }

        // Pause courte pour éviter de surcharger la base
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setSuccess(`${createdCount} semaine(s) créée(s) automatiquement`);
      
      // Notifier le parent pour recharger les données
      if (onWeekCreated) {
        onWeekCreated();
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="week-creator">
      <div className="creator-header">
        <h4>📅 Création Rapide de Semaines</h4>
        <p>Créez facilement les semaines suivantes (lundi à dimanche)</p>
      </div>

      <div className="creator-actions">
        <button 
          onClick={handleCreateNextWeek}
          disabled={loading}
          className="next-week-btn"
        >
          {loading ? '⏳ Création...' : '➕ Créer la semaine suivante'}
        </button>

        <button 
          onClick={handleCreateSchoolYear}
          disabled={loading}
          className="school-year-btn"
        >
          {loading ? '⏳ Création...' : '📚 Créer plusieurs semaines d\'affilée'}
        </button>
      </div>

      <div className="creator-info">
        <div className="info-item">
          <span className="info-icon">🗓️</span>
          <span>Semaines créées : Lundi à Dimanche</span>
        </div>
        <div className="info-item">
          <span className="info-icon">✏️</span>
          <span>Type/vacances : Modifiables manuellement après création</span>
        </div>
      </div>

      {/* Messages */}
      {error && <div className="error-message">❌ {error}</div>}
      {success && <div className="success-message">✅ {success}</div>}

      <style jsx>{`
        .week-creator {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          border-left: 4px solid #17a2b8;
        }

        .creator-header h4 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .creator-header p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }

        .creator-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .next-week-btn, .school-year-btn {
          padding: 12px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .next-week-btn {
          background: #28a745;
          color: white;
        }

        .next-week-btn:hover:not(:disabled) {
          background: #218838;
          transform: translateY(-1px);
        }

        .school-year-btn {
          background: #17a2b8;
          color: white;
        }

        .school-year-btn:hover:not(:disabled) {
          background: #138496;
          transform: translateY(-1px);
        }

        .next-week-btn:disabled,
        .school-year-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .creator-info {
          display: flex;
          gap: 20px;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;
        }

        .info-icon {
          font-size: 16px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 12px;
          border-radius: 4px;
          margin-top: 12px;
        }

        @media (max-width: 768px) {
          .creator-actions {
            flex-direction: column;
          }

          .creator-info {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}
