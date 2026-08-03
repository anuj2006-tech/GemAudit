import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tender_management_secure_jwt_token_secret_998811');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'super-admin') {
      return res.status(403).json({ error: 'Access denied. Super Admin privileges required.' });
    }
    next();
  });
};
