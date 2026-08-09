import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

const HAS_GITHUB = Boolean(
  process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const commonVerify = (profile, done) => {
  try {
    const user = {
      _id: `${profile.provider}_${profile.id}`,
      provider: profile.provider,
      providerId: profile.id,
      displayName: profile.displayName || profile.username || 'User',
      photo: profile.photos?.[0]?.value || '',
    };
    return done(null, user);
  } catch (e) {
    return done(e);
  }
};

const callbackURL =
  process.env.CALLBACK_URL ||
  'https://image-search-master.onrender.com/auth/github/callback';

if (HAS_GITHUB) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL,
      },
      (_accessToken, _refreshToken, profile, done) => commonVerify(profile, done),
    ),
  );
} else {
  console.warn(
    '[auth] GitHub OAuth not configured - set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable.',
  );
}
