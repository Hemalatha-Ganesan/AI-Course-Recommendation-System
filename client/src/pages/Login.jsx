import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <>
      {/* ── Embedded CSS guarantees layout even if Tailwind isn't loaded ── */}
      <style>{`
        @keyframes loginSpin { to { transform: rotate(360deg); } }

        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        @media (max-width: 1024px) {
          .login-page { grid-template-columns: 1fr; }
          .login-left { display: none !important; }
        }

        .login-left {
          background: linear-gradient(145deg, #4338ca 0%, #6d28d9 50%, #7c3aed 100%);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .login-blob1 {
          position: absolute; top: -100px; right: -100px;
          width: 350px; height: 350px; border-radius: 50%;
          background: rgba(255,255,255,0.06); filter: blur(60px);
        }
        .login-blob2 {
          position: absolute; bottom: -100px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(167,139,250,0.15); filter: blur(50px);
        }
        .login-logo { position: relative; z-index: 1; }
        .login-logo h1 {
          font-size: 2.25rem; font-weight: 800;
          letter-spacing: -1px; margin-bottom: 0.75rem;
        }
        .login-logo-bar {
          width: 48px; height: 4px;
          background: rgba(255,255,255,0.45);
          border-radius: 2px; margin-bottom: 1.25rem;
        }
        .login-logo p {
          font-size: 1.1rem; line-height: 1.75;
          color: rgba(255,255,255,0.85); max-width: 360px;
        }
        .login-stats {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
        }
        .login-stat {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 1rem; padding: 1rem;
        }
        .login-stat strong {
          display: block; font-size: 1.5rem;
          font-weight: 900; margin-bottom: 0.25rem;
        }
        .login-stat span { font-size: 0.875rem; color: rgba(255,255,255,0.7); }
        .login-testimonial {
          position: relative; z-index: 1;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 1rem; padding: 1.25rem;
        }
        .login-testimonial p {
          font-size: 0.875rem; color: rgba(255,255,255,0.9);
          line-height: 1.7; margin-bottom: 1rem;
        }
        .login-testimonial-author {
          display: flex; align-items: center; gap: 0.75rem;
        }
        .login-avatar {
          width: 2.25rem; height: 2.25rem; border-radius: 50%;
          background: linear-gradient(135deg, #a78bfa, #60a5fa);
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.875rem; flex-shrink: 0;
        }
        .login-right {
          background: #f1f5f9;
          display: flex; align-items: center;
          justify-content: center; padding: 2rem;
          min-height: 100vh;
        }
        .login-card-wrap { width: 100%; max-width: 440px; }
        .login-mobile-logo {
          display: none; text-align: center; margin-bottom: 2rem;
        }
        @media (max-width: 1024px) {
          .login-mobile-logo { display: block; }
          .login-right { min-height: 100vh; }
        }
        .login-mobile-logo h1 {
          font-size: 1.875rem; font-weight: 900;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }
        .login-mobile-logo p { font-size: 0.875rem; color: #64748b; }
        .login-card {
          background: white; border-radius: 1.5rem; padding: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 25px 60px -12px rgba(99,102,241,0.15);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .login-card h2 {
          font-size: 1.75rem; font-weight: 700;
          color: #0f172a; margin-bottom: 0.4rem;
        }
        .login-card > p {
          color: #64748b; font-size: 0.95rem; margin-bottom: 1.75rem;
        }
        .login-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef2f2; border: 1px solid #fecaca;
          border-left: 4px solid #ef4444; border-radius: 0.75rem;
          padding: 0.875rem 1rem; margin-bottom: 1.25rem;
          color: #dc2626; font-size: 0.875rem; font-weight: 500;
        }
        .login-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .login-label {
          display: block; font-size: 0.875rem;
          font-weight: 600; color: #374151; margin-bottom: 0.5rem;
        }
        .login-label-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 0.5rem;
        }
        .login-input {
          width: 100%; padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0; border-radius: 0.75rem;
          font-size: 0.95rem; outline: none;
          background: #f8fafc; color: #0f172a;
          transition: all 0.2s; box-sizing: border-box;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #6366f1; background: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        .login-input-wrap { position: relative; }
        .login-eye {
          position: absolute; right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 0.25rem; line-height: 0;
        }
        .login-eye:hover { color: #64748b; }
        .login-forgot {
          font-size: 0.8rem; font-weight: 600; color: #6366f1;
          background: none; border: none; cursor: pointer;
          font-family: inherit;
        }
        .login-forgot:hover { color: #4338ca; }
        .login-check { display: flex; align-items: center; gap: 0.625rem; }
        .login-check input { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; }
        .login-check label { font-size: 0.875rem; color: #475569; cursor: pointer; }
        .login-submit {
          width: 100%; padding: 0.95rem; color: white;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border: none; border-radius: 0.75rem;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 15px rgba(99,102,241,0.4);
          font-family: inherit;
        }
        .login-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.5); }
        .login-submit:disabled { background: #c7d2fe; box-shadow: none; cursor: not-allowed; }
        .login-spinner {
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
        }
        .login-spin { animation: loginSpin 1s linear infinite; }
        .login-signup-link {
          text-align: center; margin-top: 1.5rem;
          font-size: 0.9rem; color: #64748b;
        }
        .login-signup-link a {
          color: #4f46e5; font-weight: 700; text-decoration: none;
        }
        .login-signup-link a:hover { color: #4338ca; }
        .login-divider {
          display: flex; align-items: center;
          gap: 0.75rem; margin: 1.25rem 0;
        }
        .login-divider-line { flex: 1; height: 1px; background: #e2e8f0; }
        .login-divider span {
          font-size: 11px; font-weight: 600; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .login-creds { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .login-cred-btn {
          text-align: left; padding: 0.75rem; border-radius: 0.75rem;
          cursor: pointer; transition: all 0.2s; border: 2px solid;
          font-family: inherit; background: none;
        }
        .login-cred-admin { background: #eef2ff; border-color: #c7d2fe; }
        .login-cred-admin:hover { background: #e0e7ff; border-color: #818cf8; }
        .login-cred-user  { background: #ecfeff; border-color: #a5f3fc; }
        .login-cred-user:hover  { background: #cffafe; border-color: #22d3ee; }
        .login-cred-role {
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;
        }
        .login-cred-admin .login-cred-role { color: #6366f1; }
        .login-cred-user  .login-cred-role { color: #0891b2; }
        .login-cred-email { font-size: 12px; color: #475569; }
        .login-cred-pass  { font-size: 12px; color: #94a3b8; }
      `}</style>

      <div className="login-page">

        {/* ══ LEFT PANEL ══ */}
        <div className="login-left">
          <div className="login-blob1" />
          <div className="login-blob2" />

          <div className="login-logo">
            <h1>CourseAI</h1>
            <div className="login-logo-bar" />
            <p>Welcome back! Continue your AI-powered learning journey where you left off.</p>
          </div>

          <div className="login-stats">
            {[
              { number: '50K+', label: 'Active Learners' },
              { number: '234',  label: 'Courses Available' },
              { number: '4.9★', label: 'Average Rating' },
              { number: '95%',  label: 'Completion Rate' },
            ].map((s, i) => (
              <div key={i} className="login-stat">
                <strong>{s.number}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="login-testimonial">
            <p>"CourseAI completely transformed how I learn. The AI recommendations are spot-on and save me hours!"</p>
            <div className="login-testimonial-author">
              <div className="login-avatar">S</div>
              <div>
                <strong style={{ display:'block', fontSize:'0.875rem' }}>Sarah M.</strong>
                <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)' }}>Software Engineer</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="login-right">
          <div className="login-card-wrap">

            <div className="login-mobile-logo">
              <h1>CourseAI</h1>
              <p>AI-powered learning platform</p>
            </div>

            <div className="login-card">
              <h2>Welcome Back 👋</h2>
              <p>Sign in to continue your learning journey</p>

              {error && (
                <div className="login-error">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form className="login-form" onSubmit={handleSubmit}>

                {/* Email */}
                <div>
                  <label className="login-label">Email Address</label>
                  <input
                    type="email" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" required
                    className="login-input"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="login-label-row">
                    <label className="login-label" style={{ margin:0 }}>Password</label>
                    <button type="button" className="login-forgot"
                      onClick={() => alert('Password reset coming soon!')}>
                      Forgot password?
                    </button>
                  </div>
                  <div className="login-input-wrap">
                    <input
                      type={showPass ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="Enter your password" required
                      className="login-input" style={{ paddingRight: '3rem' }}
                    />
                    <button type="button" className="login-eye" onClick={() => setShowPass(!showPass)}>
                      {showPass ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember */}
                <div className="login-check">
                  <input type="checkbox" id="remember"
                    checked={remember} onChange={() => setRemember(!remember)} />
                  <label htmlFor="remember">Remember me for 30 days</label>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} className="login-submit">
                  {loading ? (
                    <span className="login-spinner">
                      <svg className="login-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign In →'}
                </button>
              </form>

              <p className="login-signup-link">
                Don't have an account?{' '}
                <Link to="/signup">Sign up free</Link>
              </p>

              <div className="login-divider">
                <div className="login-divider-line" />
                <span>Test Credentials</span>
                <div className="login-divider-line" />
              </div>

              <div className="login-creds">
                <button type="button" className="login-cred-btn login-cred-admin"
                  onClick={() => fillCredentials('hemalathaganesan08@gmial.com', 'Hemalatha Ganesan')}>
                  <div className="login-cred-role">Admin ↗</div>
                  <div className="login-cred-email">admin@test.com</div>
                  <div className="login-cred-pass">admin123</div>
                </button>
                <button type="button" className="login-cred-btn login-cred-user"
                  onClick={() => fillCredentials('user@test.com', 'user123')}>
                  <div className="login-cred-role">User ↗</div>
                  <div className="login-cred-email">user@test.com</div>
                  <div className="login-cred-pass">user123</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;