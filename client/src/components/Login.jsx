import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="authLayout">
      <div className="panel authCard">
        <h1 className="authTitle">Sign in to continue</h1>
        <p className="authSubtitle">
          Choose your provider to start searching and save your history.
        </p>
        <div className="loginBtns">
          <button className="btn primary" onClick={() => login('github')}>
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
