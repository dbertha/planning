/**
 * Gestionnaires d'erreurs réutilisables pour éviter la duplication
 */

/**
 * Gestionnaire d'erreur générique pour les APIs
 */
export function handleApiError(error, res, context = '') {
  console.error(`Erreur ${context}:`, error);
  
  if (error.message.includes('Token')) {
    return res.status(401).json({ error: error.message });
  }
  
  if (error.message.includes('ADMIN_REQUIRED')) {
    return res.status(403).json({ error: 'Accès administrateur requis' });
  }
  
  if (error.message.includes('duplicate key')) {
    return handleDuplicateKeyError(error, res);
  }
  
  if (error.message.includes('SMS désactivé') || error.message.includes('API_KEY')) {
    return res.status(503).json({ error: error.message });
  }
  
  // Erreurs de validation (données invalides)
  if (error.message.includes('obligatoire') || 
      error.message.includes('invalide') || 
      error.message.includes('n\'existe pas') ||
      error.message.includes('doit être') ||
      error.message.includes('trop court') ||
      error.message.includes('format')) {
    return res.status(400).json({ error: error.message });
  }
  
  // Erreur générique
  return res.status(500).json({ error: 'Erreur serveur' });
}

/**
 * Gestionnaire spécialisé pour les erreurs de clé dupliquée
 */
function handleDuplicateKeyError(error, res) {
  if (error.message.includes('classes_pkey') || (error.message.includes('classes') && error.message.includes('id'))) {
    return res.status(400).json({ error: 'Une classe avec cet ID existe déjà dans ce planning' });
  }
  
  if (error.message.includes('familles_nom_planning_unique')) {
    return res.status(400).json({ error: 'Une famille avec ce nom existe déjà dans ce planning' });
  }
  
  if (error.message.includes('affectations')) {
    return res.status(400).json({ error: 'Cette cellule est déjà occupée par une autre famille' });
  }
  
  return res.status(400).json({ error: 'Cet élément existe déjà' });
}

/**
 * Gestionnaire pour les erreurs de validation
 */
export function handleValidationError(field, value, res) {
  return res.status(400).json({ 
    error: `Validation échouée pour le champ '${field}' avec la valeur '${value}'` 
  });
}

/**
 * Gestionnaire pour les ressources non trouvées
 */
export function handleNotFound(resource, res) {
  return res.status(404).json({ 
    error: `${resource} non trouvé(e)` 
  });
}

/**
 * Wrapper pour les fonctions async avec gestion d'erreur automatique
 */
export function asyncHandler(fn, context = '') {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      handleApiError(error, res, context);
    }
  };
}

/**
 * Validation des paramètres requis
 */
export function validateRequiredParams(params, req, res) {
  const missing = [];
  
  for (const param of params) {
    if (!req.body[param] && !req.query[param]) {
      missing.push(param);
    }
  }
  
  if (missing.length > 0) {
    res.status(400).json({ 
      error: `Paramètres manquants: ${missing.join(', ')}` 
    });
    return false;
  }
  
  return true;
}
