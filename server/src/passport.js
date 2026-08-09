import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/User.js';

const HAS_GITHUB = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

const commonVerify = async (profile, done) => {
  try {
    const provider = profile.provider;
    const providerId = profile.id;
    const displayName = profile.displayName || profile.username || 'User';
    const photo = profile.photos?.[0]?.value || '';

    let user = await User.findOne({ provider, providerId });
    if (!user) {
      user = await User.create({ provider, providerId, displayName, photo });
    }

    return done(null, user);
  } catch (e) {
    return done(e);
  }
};

if (HAS_GITHUB) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      (_accessToken, _refreshToken, profile, done) => commonVerify(profile, done),
    ),
  );
} else {
  console.warn(
    '[auth] GitHub OAuth not configured - set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable.',
  );
}
