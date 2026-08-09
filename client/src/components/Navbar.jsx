import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const name = user?.displayName || '';
  const showUser = Boolean(user);

  return (
    <header className="header panel">
      <div className="brandGroup">
        <div className="brand">
          <span className="brandMark" aria-hidden="true">
            *
          </span>
          MERN Image Search
        </div>
        <p className="tagline">
          Find and curate Unsplash photography in seconds.
        </p>
      </div>

      {showUser && (
        <div className="userBadge">
          {user.photo && (
            <img
              src={user.photo}
              alt={name}
              width={34}
              height={34}
              className="userAvatar"
              loading="lazy"
            />
          )}
          <div className="userDetails">
            <span className="userLabel">Signed in as</span>
            <span className="userName">{name}</span>
          </div>
          <button
            type="button"
            className="btn subtle"
            onClick={logout}
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
