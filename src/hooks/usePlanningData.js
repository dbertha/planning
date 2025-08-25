import { useState, useEffect } from 'react';

export function usePlanningData(token) {
  const [data, setData] = useState({
    planning: null,
    classes: [],
    semaines: [],
    familles: [],
    affectations: [],
    permissions: {
      isAdmin: false,
      canEdit: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(() => {
    // Récupérer le token admin depuis localStorage
    return localStorage.getItem('adminSessionToken');
  });

  // Fonction pour authentifier l'admin
  const loginAdmin = async (password) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'login',
          data: { token, password }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setAuthToken(result.sessionToken);
        localStorage.setItem('adminSessionToken', result.sessionToken);
        // Recharger les données avec les permissions admin
        await loadPlanningData();
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  // Fonction pour se déconnecter
  const logoutAdmin = async () => {
    try {
      if (authToken) {
        await fetch('/api/auth', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'logout',
            data: { sessionToken: authToken }
          })
        });
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      setAuthToken(null);
      localStorage.removeItem('adminSessionToken');
      // Recharger les données en mode public
      await loadPlanningData();
    }
  };

  // Fonction pour charger les données du planning
  const loadPlanningData = async () => {
    if (!token) {
      setError('Token de planning requis');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Content-Type': 'application/json',
      };

      // Ajouter le token admin si disponible
      if (authToken) {
        headers['X-Admin-Session'] = authToken;
      }

      const response = await fetch(`/api/planning?token=${token}&type=full`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        let errorBody = null;
        try {
          errorBody = await response.json();
        } catch (_) {
          // ignore json parse error
        }
        const message = errorBody?.error || `Erreur HTTP: ${response.status}`;

        if (response.status === 401 || response.status === 403) {
          const lower = message.toLowerCase();
          const isInvalidToken = lower.includes('token invalide') || lower.includes('token manquant') || lower.includes('planning inactif');
          if (isInvalidToken) {
            throw new Error(message);
          }
          // Session admin expirée: on repasse en mode public uniquement si un token admin était présent
          if (authToken) {
            setAuthToken(null);
            localStorage.removeItem('adminSessionToken');
            return loadPlanningData();
          }
          throw new Error(message);
        }
        throw new Error(message);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier la session admin au démarrage
  const checkAdminSession = async () => {
    if (!authToken) return;

    try {
      const response = await fetch(`/api/auth?action=check_session&session_token=${authToken}`);
      const result = await response.json();
      
      if (!result.isAdmin) {
        // Session expirée
        setAuthToken(null);
        localStorage.removeItem('adminSessionToken');
      }
    } catch (err) {
      console.error('Erreur vérification session:', err);
      setAuthToken(null);
      localStorage.removeItem('adminSessionToken');
    }
  };

  // Fonction pour créer une affectation
  const createAffectation = async (familleId, classeId, semaineId, notes = '') => {
    if (!data.permissions.canEdit) {
      throw new Error('Permissions insuffisantes');
    }

    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': authToken
        },
        body: JSON.stringify({
          token,
          type: 'affectation',
          data: { familleId, classeId, semaineId, notes }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la création');
      }

      const newAffectation = await response.json();
      
      // Calculer le numéro de nettoyage pour cette famille
      const familleAffectations = data.affectations.filter(a => a.familleId === familleId);
      const semaine = data.semaines.find(s => s.id === semaineId);
      
      // Compter les affectations antérieures pour cette famille
      const numeroNettoyage = familleAffectations.filter(a => {
        const affSemaine = data.semaines.find(s => s.id === a.semaineId);
        return affSemaine && new Date(affSemaine.debut) <= new Date(semaine.debut);
      }).length + 1;
      
      // Mettre à jour l'état local au lieu de recharger toutes les données
      setData(prevData => ({
        ...prevData,
        affectations: [...prevData.affectations, {
          id: newAffectation.id,
          familleId,
          classeId,
          semaineId,
          notes,
          // Enrichir avec les données locales pour éviter un rechargement
          familleNom: prevData.familles.find(f => f.id === familleId)?.nom || 'Famille inconnue',
          classeNom: prevData.classes.find(c => c.id === classeId)?.nom || 'Classe inconnue',
          classeCouleur: prevData.classes.find(c => c.id === classeId)?.couleur || '#ccc',
          numeroNettoyage
        }]
      }));
      
      return newAffectation;
    } catch (err) {
      throw err;
    }
  };

  // Fonction pour supprimer une affectation
  const deleteAffectation = async (affectationId) => {
    if (!data.permissions.canEdit) {
      throw new Error('Permissions insuffisantes');
    }

    try {
      const response = await fetch('/api/planning', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': authToken
        },
        body: JSON.stringify({
          token,
          type: 'affectation',
          id: affectationId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      // Mettre à jour l'état local au lieu de recharger
      setData(prevData => ({
        ...prevData,
        affectations: prevData.affectations.filter(a => a.id !== affectationId)
      }));
    } catch (err) {
      throw err;
    }
  };

  // Fonction pour publier/dépublier une semaine
  const toggleSemainePublication = async (semaineId, publish) => {
    if (!data.permissions?.canEdit) {
      throw new Error('Permissions insuffisantes');
    }

    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': authToken
        },
        body: JSON.stringify({
          token,
          type: 'publish_semaine',
          data: { semaineId, publish }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la publication');
      }

      const updatedSemaine = await response.json();
      
      // Mettre à jour l'état local au lieu de recharger
      setData(prevData => ({
        ...prevData,
        semaines: prevData.semaines.map(s => 
          s.id === semaineId 
            ? { ...s, is_published: publish, published_at: publish ? new Date().toISOString() : null }
            : s
        )
      }));
      
      return updatedSemaine;
    } catch (err) {
      throw err;
    }
  };

  // Fonction pour distribution automatique d'une semaine
  const autoDistributeWeek = async (semaineId) => {
    if (!data.permissions?.canEdit) {
      throw new Error('Permissions insuffisantes');
    }

    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Session': authToken
        },
        body: JSON.stringify({
          token,
          type: 'auto_distribute',
          data: { semaineId }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la distribution automatique');
      }

      const result = await response.json();
      
      // Mise à jour ciblée des affectations après auto-distribution
      if (result.success) {
        console.log('🔄 Rechargement des affectations seulement...');
        
        const headers = {};
        if (authToken) {
          headers['X-Admin-Session'] = authToken;
        }
        
        const affectationsResponse = await fetch(`/api/planning?token=${token}&type=affectations`, {
          headers
        });
        
        if (affectationsResponse.ok) {
          const newAffectations = await affectationsResponse.json();
          console.log('📊 Nouvelles affectations:', newAffectations.length);
          
          // Force React à détecter le changement en créant un nouvel objet
          setData(prevData => {
            console.log('🔄 Ancien nombre d\'affectations:', prevData.affectations.length);
            console.log('🔄 Nouveau nombre d\'affectations:', newAffectations.length);
            
            // Debug: comparer les structures
            if (prevData.affectations.length > 0 && newAffectations.length > 0) {
              console.log('🔍 Ancienne affectation (exemple):', Object.keys(prevData.affectations[0]));
              console.log('🔍 Nouvelle affectation (exemple):', Object.keys(newAffectations[0]));
            }
            
            // Remplacement direct avec force de re-render React
            const newData = {
              ...prevData,
              affectations: newAffectations.map((aff, index) => ({
                ...aff,
                // Force React key change pour garantir re-render
                _refreshKey: Date.now() + index
              }))
            };
            
            return newData;
          });
        } else {
          console.error('❌ Erreur lors du rechargement des affectations:', affectationsResponse.status);
        }
      }
      
      return result;
    } catch (err) {
      throw err;
    }
  };

  // Charger les données au montage et quand le token change
  useEffect(() => {
    if (token) {
      checkAdminSession().then(() => {
        loadPlanningData();
      });
    }
  }, [token]);

  // Recharger les données quand le token admin change
  useEffect(() => {
    if (token) {
      loadPlanningData();
    }
  }, [authToken]);

  return { 
    data, 
    loading, 
    error,
    isAdmin: data.permissions.isAdmin,
    canEdit: data.permissions.canEdit,
    loginAdmin,
    logoutAdmin,
    createAffectation,
    deleteAffectation,
    toggleSemainePublication,
    autoDistributeWeek,
    refreshData: loadPlanningData,
    sessionToken: authToken
  };
} 