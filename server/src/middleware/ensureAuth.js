const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

export default function ensureAuth(req, res, next) {
  if (DISABLE_AUTH) return next();
  if (req.isAuthenticated?.()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}
