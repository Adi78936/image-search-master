# MERN Image Search - Local Setup Guide

Unsplash-powered search with GitHub OAuth on a MERN stack.

> **⚠️ Security notice:** Never commit real credentials. Both `.env` files are listed in `.gitignore`. Use the `.env.example` templates below and keep your actual secrets out of version control.

## Prerequisites
- Node.js 20+ and npm 10+
- MongoDB running locally on `mongodb://localhost:27017`
- A GitHub OAuth app and an Unsplash access key

## 1. Clone & Install
```bash
# from the repo root
cd server
npm install

cd ../client
npm install
```

## 2. Configure Environment Variables
Both apps read from `.env` files. Copy the examples and fill in your secrets before starting anything:

```bash
cd server
cp .env.example .env   # then open .env and replace every placeholder

cd ../client
cp .env.example .env   # edit if your API URL differs
```

### Server `.env` (required)
Open `server/.env` and set values for:

| Variable | Purpose |
| -------- | ------- |
| `PORT` | Express port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Random string for session cookies |
| `CLIENT_URL` | URL where the React app runs (default `http://localhost:5173`) |
| `UNSPLASH_ACCESS_KEY` | Unsplash API access key |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials |
| `DISABLE_AUTH` | Set `true` only to bypass OAuth and browse as a guest (dev helper) |

**OAuth callbacks**  
Add the following URLs (and production equivalents) to your GitHub OAuth app:
```
http://localhost:5000/auth/github/callback
```

### Client `.env` (optional)
`VITE_API_BASE=http://localhost:5000` is included in the sample. Change it if your API lives elsewhere.

## 3. Project Structure
```
mern-oauth-image-search-nodocker/
  client/            # React + Vite front-end
    src/
      components/    # UI pieces (Navbar, SearchBar, Login, etc.)
      context/       # Auth context provider and hooks
      api.js         # Fetch helpers + base URL
      App.jsx        # Main app shell
      styles.css     # Global styling and theme tokens
    index.html       # Vite entry template
    vite.config.js   # Vite dev/build configuration

  server/            # Express + Passport back-end
    src/
      middleware/    # Auth guards (e.g. ensureAuth)
      models/        # Mongoose models (User, Search)
      routes/        # API + OAuth routes
      index.js       # Express app bootstrapping
      passport.js    # Passport strategy setup
    package.json     # Server scripts and dependencies
```

## 4. Run the Apps
Start the API first, then the client:

```bash
cd server
npm run dev

# new terminal
cd client
npm run dev
```

Open `http://localhost:5173`. You will land on the login screen until you authenticate with one of the enabled providers. The navigation bar provides a **Sign out** button to end your session.

## API Snapshot
- `GET /api/top-searches` -> top 5 search terms (global)
- `POST /api/search` -> body `{ term }`, returns Unsplash image results (auth required)
- `GET /api/history` -> recent searches for the signed-in user (auth required)
- `GET /auth/user` -> current user profile or `null`
- `POST /auth/logout` -> clears the session

## Troubleshooting
- Confirm MongoDB is running and reachable at the URI in `server/.env`.
- If OAuth login keeps redirecting to `/login`, re-check your client/secret values and callback URLs.
- To explore the UI without real credentials, temporarily set `DISABLE_AUTH=true` and restart the server; the app will auto-sign in as a guest.
- Restart both client and server after changing any `.env` file so new values are loaded.

Happy building!
