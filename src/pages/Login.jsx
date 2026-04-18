import { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';

export default function Login({ setCurrentPage }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setCurrentPage('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1"></div>
        <div className="auth-orb auth-orb-2"></div>
      </div>

      <div className="auth-container">
        <div className="auth-logo" onClick={() => setCurrentPage('home')}>
          <img src="/alobidan.png" alt="AloBidan" className="logo-img" style={{ height: '40px', objectFit: 'contain' }} />
          <span className="logo-text">Alo<span className="logo-accent">Bidan</span></span>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-title">Selamat Datang Kembali!</h1>
            <p className="auth-subtitle">Masuk ke akun AloBidan Bunda</p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-credentials">
            <strong>Demo Akun:</strong>
            <p>Email: <code>bunda@contoh.com</code></p>
            <p>Password: <code>password123</code></p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  id="login-email"
                  type="email"
                  className="auth-input"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon"></span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? 'Sembunyi' : 'Lihat'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <label className="remember-me">
                <input type="checkbox" id="remember-me" />
                <span>Ingat saya</span>
              </label>
              <button type="button" className="forgot-btn">Lupa password?</button>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={loading}
              id="login-submit"
            >
              {loading ? <span className="loading-spinner"></span> : 'Masuk'}
            </button>
          </form>

          <div className="auth-divider">
            <span>atau masuk dengan</span>
          </div>

          <div className="social-login">
            <button className="social-login-btn">
              Google
            </button>
            <button className="social-login-btn">
              Facebook
            </button>
          </div>

          <p className="auth-switch">
            Belum punya akun?{' '}
            <button className="auth-link" onClick={() => setCurrentPage('register')}>
              Daftar Gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
