/**
 * Middleware réutilisables pour éviter la duplication
 */

/**
 * Middleware CORS standard pour toutes les APIs
 */
export function corsMiddleware(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Session');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (next) next();
}

/**
 * Middleware spécialisé CORS pour SMS (POST uniquement)
 */
export function corsMiddlewareSMS(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Session');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (next) next();
}

/**
 * Middleware de validation des méthodes HTTP
 */
export function validateMethod(allowedMethods) {
  return (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      res.setHeader('Allow', allowedMethods);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    if (next) next();
  };
}

/**
 * Middleware de logging des requêtes
 */
export function logRequest(apiName) {
  return (req, res, next) => {
    console.log(`📡 ${apiName} endpoint appelé - ${req.method} ${req.url}`);
    if (next) next();
  };
}

/**
 * Wrapper pour appliquer les middlewares communs
 */
export function applyCommonMiddleware(req, res, allowedMethods = ['GET', 'POST', 'PUT', 'DELETE']) {
  corsMiddleware(req, res);
  
  if (req.method === 'OPTIONS') {
    return { handled: true };
  }
  
  if (!allowedMethods.includes(req.method)) {
    res.setHeader('Allow', allowedMethods);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return { handled: true };
  }
  
  return { handled: false };
}
