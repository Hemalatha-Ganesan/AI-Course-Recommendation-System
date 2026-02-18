import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useUser();

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError]                     = useState('');
  const [loading, setLoading]                 = useState(false);
  const [showPass, setShowPass]               = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculateStrength = (password) => {
    let s = 0;
    if (password.length >= 6)  s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    return Math.min(s, 4);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
    if (name === 'password') setPasswordStrength(calculateStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); setLoading(false); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); setLoading(false); return;
    }
    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) navigate('/dashboard');
    else setError(result.error);
    setLoading(false);
  };

  const strengthColor = ['#e2e8f0','#ef4444','#f97316','#eab308','#22c55e'][passwordStrength];
  const strengthLabel = ['','Weak','Fair','Good','Strong'][passwordStrength];
  const strengthTextColor = ['#94a3b8','#ef4444','#f97316','#eab308','#22c55e'][passwordStrength];

  const EyeIcon = ({ visible }) => visible ? (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  return (
    <>
      <style>{`
        @keyframes signupSpin { to { transform: rotate(360deg); } }

        .signup-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        @media (max-width: 1024px) {
          .signup-page { grid-template-columns: 1fr; }
          .signup-left { display: none !important; }
        }

        .signup-left {
          background: linear-gradient(145deg, #4338ca 0%, #6d28d9 50%, #7c3aed 100%);
          padding: 3rem;
          display: flex; flex-direction: column;
          justify-content: space-between;
          color: white; position: relative; overflow: hidden;
        }
        .signup-blob1 {
          position: absolute; top: -100px; right: -100px;
          width: 350px; height: 350px; border-radius: 50%;
          background: rgba(255,255,255,0.06); filter: blur(60px);
        }
        .signup-blob2 {
          position: absolute; bottom: -100px; left: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(167,139,250,0.15); filter: blur(50px);
        }
        .signup-logo { position: relative; z-index: 1; }
        .signup-logo h1 {
          font-size: 2.25rem; font-weight: 800;
          letter-spacing: -1px; margin-bottom: 0.75rem;
        }
        .signup-logo-bar {
          width: 48px; height: 4px;
          background: rgba(255,255,255,0.45);
          border-radius: 2px; margin-bottom: 1.25rem;
        }
        .signup-logo p {
          font-size: 1.1rem; line-height: 1.75;
          color: rgba(255,255,255,0.85); max-width: 360px;
        }
        .signup-features { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 1.25rem; }
        .signup-feature { display: flex; align-items: flex-start; gap: 1rem; }
        .signup-feature-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .signup-feature-title { font-weight: 600; font-size: 1rem; margin-bottom: 0.2rem; }
        .signup-feature-desc { color: rgba(255,255,255,0.68); font-size: 0.875rem; line-height: 1.5; }
        .signup-trusted { color: rgba(255,255,255,0.55); font-size: 0.85rem; position: relative; z-index: 1; }

        .signup-right {
          background: #f1f5f9;
          display: flex; align-items: center;
          justify-content: center; padding: 2rem;
          min-height: 100vh;
        }
        .signup-card-wrap { width: 100%; max-width: 440px; }
        .signup-mobile-logo { display: none; text-align: center; margin-bottom: 2rem; }
        @media (max-width: 1024px) { .signup-mobile-logo { display: block; } }
        .signup-mobile-logo h1 {
          font-size: 1.875rem; font-weight: 900;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 0.25rem;
        }
        .signup-mobile-logo p { font-size: 0.875rem; color: #64748b; }
        .signup-card {
          background: white; border-radius: 1.5rem; padding: 2.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 25px 60px -12px rgba(99,102,241,0.15);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .signup-card h2 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-bottom: 0.4rem; }
        .signup-card > p { color: #64748b; font-size: 0.95rem; margin-bottom: 1.75rem; }
        .signup-error {
          display: flex; align-items: center; gap: 0.5rem;
          background: #fef2f2; border: 1px solid #fecaca;
          border-left: 4px solid #ef4444; border-radius: 0.75rem;
          padding: 0.875rem 1rem; margin-bottom: 1.25rem;
          color: #dc2626; font-size: 0.875rem; font-weight: 500;
        }
        .signup-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .signup-label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
        .signup-input {
          width: 100%; padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0; border-radius: 0.75rem;
          font-size: 0.95rem; outline: none;
          background: #f8fafc; color: #0f172a;
          transition: all 0.2s; box-sizing: border-box; font-family: inherit;
        }
        .signup-input:focus { border-color: #6366f1; background: #fff; box-shadow: 0 0 0 4px rgba(99,102,241,0.1); }
        .signup-input-wrap { position: relative; }
        .signup-eye {
          position: absolute; right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 0.25rem; line-height: 0;
        }
        .signup-eye:hover { color: #64748b; }
        .signup-strength { margin-top: 0.6rem; }
        .signup-strength-row { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
        .signup-strength-row span:first-child { font-size: 0.75rem; color: #94a3b8; }
        .signup-strength-row span:last-child { font-size: 0.75rem; font-weight: 600; }
        .signup-strength-bar { height: 5px; background: #e2e8f0; border-radius: 99px; overflow: hidden; }
        .signup-strength-fill { height: 100%; border-radius: 99px; transition: all 0.4s ease; }
        .signup-match { margin-top: 0.4rem; font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 0.3rem; }
        .signup-submit {
          width: 100%; padding: 0.95rem; color: white;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border: none; border-radius: 0.75rem;
          font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 15px rgba(99,102,241,0.4);
          font-family: inherit; margin-top: 0.25rem;
        }
        .signup-submit:hover:not(:disabled) { transform: translateY(-2px); }
        .signup-submit:disabled { background: #c7d2fe; box-shadow: none; cursor: not-allowed; }
        .signup-spinner { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .signup-spin { animation: signupSpin 1s linear infinite; }
        .signup-signin-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: #64748b; }
        .signup-signin-link a { color: #4f46e5; font-weight: 700; text-decoration: none; }
        .signup-signin-link a:hover { color: #4338ca; }
        .signup-terms { text-align: center; margin-top: 1rem; font-size: 0.75rem; color: #94a3b8; }
        .signup-terms span { color: #4f46e5; cursor: pointer; }
        .signup-terms span:hover { text-decoration: underline; }
      `}</style>

      <div className="signup-page">

        {/* ══ LEFT PANEL ══ */}
        <div className="signup-left">
          <div className="signup-blob1" />
          <div className="signup-blob2" />

          <div className="signup-logo">
            <h1>CourseAI</h1>
            <div className="signup-logo-bar" />
            <p>Discover personalized learning paths powered by artificial intelligence. Your journey to mastery starts here.</p>
          </div>

          <div className="signup-features">
            {[
              {
                title: 'Smart Recommendations',
                desc: 'AI analyzes your interests to suggest perfect courses',
                icon: <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
              },
              {
                title: 'Adaptive Learning',
                desc: 'Dynamic content that evolves with your progress',
                icon: <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
              },
              {
                title: 'Track Your Growth',
                desc: 'Comprehensive analytics and progress insights',
                icon: <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              },
            ].map((f, i) => (
              <div key={i} className="signup-feature">
                <div className="signup-feature-icon">{f.icon}</div>
                <div>
                  <p className="signup-feature-title">{f.title}</p>
                  <p className="signup-feature-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="signup-trusted">Trusted by 50,000+ learners worldwide</p>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="signup-right">
          <div className="signup-card-wrap">

            <div className="signup-mobile-logo">
              <h1>CourseAI</h1>
              <p>AI-powered learning platform</p>
            </div>

            <div className="signup-card">
              <h2>Create Account</h2>
              <p>Start your personalized learning journey</p>

              {error && <div className="signup-error"><span>⚠️</span> {error}</div>}

              <form className="signup-form" onSubmit={handleSubmit}>

                <div>
                  <label className="signup-label">Username</label>
                  <input type="text" name="username" value={formData.username}
                    onChange={handleChange} placeholder="johndoe" required className="signup-input" />
                </div>

                <div>
                  <label className="signup-label">Email Address</label>
                  <input type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="you@example.com" required className="signup-input" />
                </div>

                <div>
                  <label className="signup-label">Password</label>
                  <div className="signup-input-wrap">
                    <input type={showPass ? 'text' : 'password'} name="password"
                      value={formData.password} onChange={handleChange}
                      placeholder="Create a strong password" required
                      className="signup-input" style={{ paddingRight: '3rem' }} />
                    <button type="button" className="signup-eye" onClick={() => setShowPass(!showPass)}>
                      <EyeIcon visible={showPass} />
                    </button>
                  </div>
                  {formData.password && (
                    <div className="signup-strength">
                      <div className="signup-strength-row">
                        <span>Password strength</span>
                        <span style={{ color: strengthTextColor }}>{strengthLabel}</span>
                      </div>
                      <div className="signup-strength-bar">
                        <div className="signup-strength-fill" style={{
                          width: `${(passwordStrength / 4) * 100}%`,
                          background: strengthColor,
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="signup-label">Confirm Password</label>
                  <div className="signup-input-wrap">
                    <input type={showConfirmPass ? 'text' : 'password'} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleChange}
                      placeholder="Repeat your password" required
                      className="signup-input" style={{ paddingRight: '3rem' }} />
                    <button type="button" className="signup-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                      <EyeIcon visible={showConfirmPass} />
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p className="signup-match" style={{
                      color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444'
                    }}>
                      {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={loading} className="signup-submit">
                  {loading ? (
                    <span className="signup-spinner">
                      <svg className="signup-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <circle style={{opacity:0.25}} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path style={{opacity:0.75}} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>

              <p className="signup-signin-link">
                Already have an account?{' '}
                <Link to="/login">Sign in</Link>
              </p>

              <p className="signup-terms">
                By creating an account, you agree to our{' '}
                <span>Terms</span> and <span>Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;