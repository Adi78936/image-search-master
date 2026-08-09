import { Router } from 'express';
import passport from 'passport';

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';
const HAS_GITHUB = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

const redirectHome = (_req, res) => res.redirect(CLIENT_URL);
const failureRedirect = `${CLIENT_URL}/login`;
const notConfigured = (provider) => (_req, res) =>
  res
    .status(503)
    .json({ error: `${provider} OAuth is not configured on the server.` });

if (DISABLE_AUTH) {
  router.get('/github', redirectHome);
  router.get('/github/callback', redirectHome);
} else {
  if (HAS_GITHUB) {
    router.get('/github', passport.authenticate('github', { scope: ['read:user'] }));
    router.get(
      '/github/callback',
      passport.authenticate('github', { failureRedirect }),
      (_req, res) => res.redirect(CLIENT_URL),
    );
  } else {
    router.get('/github', notConfigured('GitHub'));
    router.get('/github/callback', redirectHome);
  }
}

router.get('/user', (req, res) => {
  if (req.user) {
    const { _id, displayName, photo } = req.user;
    return res.json({ _id, displayName, photo });
  }

  if (DISABLE_AUTH) {
    return res.json({ _id: 'guest-user', displayName: 'Guest User', photo: '' });
  }

  return res.json(null);
});

router.post('/logout', (req, res, next) => {
  const finish = () => res.clearCookie('connect.sid').json({ ok: true });

  if (DISABLE_AUTH) {
    return finish();
  }

  if (typeof req.logout === 'function') {
    req.logout((err) => {
      if (err) return next(err);
      if (req.session && typeof req.session.destroy === 'function') {
        req.session.destroy(() => finish());
      } else {
        finish();
      }
    });
    return;
  }

  finish();
});

export default router;
