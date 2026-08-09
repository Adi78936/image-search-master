import { useAuth } from '../context/AuthContext';
import { ApertureIcon, GitHubIcon } from './Icon';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="authLayout">
      <div className="panel authCard">
        <span className="emptyIcon">
          <ApertureIcon size={26} />
        </span>
        {/* h2: the Navbar already owns the page's single h1. */}
        <h2 className="authTitle">Sign in to start searching</h2>
        <p className="authSubtitle">
          Connect your GitHub account to search Unsplash, curate a selection, and keep
          your search history.
        </p>
        <div className="loginBtns">
          <button
            type="button"
            className="btn btn--primary btn--block"
            onClick={() => login('github')}
          >
            <GitHubIcon size={18} />
            Continue with GitHub
          </button>
        </div>
        <p className="authNote">
          We only read your public profile. Nothing is posted on your behalf.
        </p>
      </div>
    </div>
  );
}
