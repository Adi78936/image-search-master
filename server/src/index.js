import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import './passport.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

const app = express();
app.set('trust proxy', 1);

const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const guestUser = {
  _id: 'guest-user',
  provider: 'dev',
  providerId: 'guest-user',
  displayName: 'Guest User',
  photo: '',
};

const attachGuestUser = (req, _res, next) => {
  if (req.user) {
    req.isAuthenticated = () => true;
    req.logout = (cb) => {
      if (typeof cb === 'function') cb();
    };
    return next();
  }

  req.user = guestUser;
  req.isAuthenticated = () => true;
  req.logout = (cb) => {
    if (typeof cb === 'function') cb();
  };
  next();
};

if (DISABLE_AUTH) {
  app.use(attachGuestUser);
} else {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'supersecret_change_me',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.json({ ok: true, message: 'Server up' });
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
