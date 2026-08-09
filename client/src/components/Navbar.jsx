import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ApertureIcon, LogOutIcon, MoonIcon, SunIcon } from './Icon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const name = user?.displayName || '';

  return (
    <header className="header panel">
      <div className="brandGroup">
        <h1 className="brand">
          <span className="brandMark">
            <ApertureIcon size={20} />
          </span>
          Image Search
        </h1>
        <p className="tagline">Find and curate Unsplash photography in seconds.</p>
      </div>

      <div className="headerActions">
        <button
          type="button"
          className="btn btn--subtle btn--icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </button>

        {user && (
          <div className="userBadge">
            {user.photo && (
              <img
                src={user.photo}
                alt=""
                width={32}
                height={32}
                className="userAvatar"
                loading="lazy"
              />
            )}
            <span className="userDetails">
              <span className="userLabel">Signed in</span>
              <span className="userName">{name}</span>
            </span>
            <button type="button" className="btn btn--subtle" onClick={logout}>
              <LogOutIcon size={18} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
