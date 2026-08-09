import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import User from './models/User.js';
import './passport.js';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';

const app = express();
const DISABLE_AUTH = process.env.DISABLE_AUTH === 'true';

mongoose
  .connect(process.env.MONGO_URI, { dbName: 'mern_oauth_images' })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error', err));

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const ensureGuestUser = (() => {
  const provider = 'dev';
  const providerId = 'guest-user';
  let cachedPromise = null;

  const load = async () => {
    const existing = await User.findOne({ provider, providerId });
    if (existing) return existing;
    return User.create({ provider, providerId, displayName: 'Guest User', photo: '' });
  };

  return () => {
    if (!cachedPromise) {
      cachedPromise = load().catch((err) => {
        cachedPromise = null;
        throw err;
      });
    }
    return cachedPromise;
  };
})();

const attachGuestUser = (req, _res, next) => {
  if (req.user) {
    req.isAuthenticated = () => true;
    req.logout = (cb) => {
      if (typeof cb === 'function') cb();
    };
    return next();
  }

  ensureGuestUser()
    .then((user) => {
      req.user = user;
      req.isAuthenticated = () => true;
      req.logout = (cb) => {
        if (typeof cb === 'function') cb();
      };
      next();
    })
    .catch(next);
};

if (DISABLE_AUTH) {
  app.use(attachGuestUser);
} else {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, dbName: 'mern_oauth_images' }),
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
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
