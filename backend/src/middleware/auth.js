import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tender_management_secure_jwt_token_secret_998811';

/**
 * Authentication Middleware
 * Decodes the JWT, extracts user info, and verifies the session.
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    // Safety check: ensure tenant ID is present on all company users
    if (req.user.role !== 'PLATFORM_ADMIN' && !req.user.company_id) {
      return res.status(403).json({ error: 'Access denied. Invalid tenant context.' });
    }
    
    req.token = token; // Store token if needed for tenant-specific Supabase clients
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }
};

/**
 * Tenant Validation Middleware
 * Ensures the request context is locked to the tenant company extracted from the session.
 */
export const requireTenant = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  // PLATFORM_ADMIN acts across tenants or at platform level
  if (req.user.role === 'PLATFORM_ADMIN') {
    req.companyId = req.headers['x-tenant-id'] || req.user.company_id || '4022ee5e-9c1f-4e5b-98ff-19cbcbebe35e';
    return next();
  }

  req.companyId = req.user.company_id || '4022ee5e-9c1f-4e5b-98ff-19cbcbebe35e';
  next();
};


/**
 * RBAC Permission/Role Validation Middleware
 * Checks if the authenticated user has the required role.
 * @param {string[]} allowedRoles - List of roles permitted to access the resource
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden. This operation requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`
      });
    }

    next();
  };
};
