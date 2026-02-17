import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useUser();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [focusedField, setFocusedField] = useState('');

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    return Math.min(strength, 4);
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
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData.username, formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const strengthColor = ['#e2e8f0', '#ef4444', '#f97316', '#eab308', '#22c55e'][passwordStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthTextColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][passwordStrength];

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '0.875rem 1rem',
    border: `2px solid ${focusedField === fieldName ? '#6366f1' : '#e2e8f0'}`,
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    background: focusedField === fieldName ? '#fff' : '#f8fafc',
    color: '#0f172a',
    boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── Left Branding Panel ── */}
      <div style={{
        background: 'linear-gradient(145deg, #4338ca 0%, #6d28d9 50%, #7c3aed 100%)',
        padding: '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative blobs */}
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'350px', height:'350px', background:'rgba(255,255,255,0.06)', borderRadius:'50%', filter:'blur(60px)' }} />
        <div style={{ position:'absolute', bottom:'-100px', left:'-80px', width:'300px', height:'300px', background:'rgba(167,139,250,0.15)', borderRadius:'50%', filter:'blur(50px)' }} />

        {/* Logo */}
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontSize:'2.25rem', fontWeight:'800', letterSpacing:'-1px', marginBottom:'0.75rem' }}>
            CourseAI
          </h1>
          <div style={{ width:'48px', height:'4px', background:'rgba(255,255,255,0.45)', borderRadius:'2px', marginBottom:'1.25rem' }} />
          <p style={{ fontSize:'1.1rem', lineHeight:'1.75', color:'rgba(255,255,255,0.85)', maxWidth:'360px' }}>
            Discover personalized learning paths powered by artificial intelligence. Your journey to mastery starts here.
          </p>
        </div>

        {/* Feature cards */}
        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {[
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: 'Smart Recommendations',
              desc: 'AI analyzes your interests to suggest perfect courses',
            },
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'Adaptive Learning',
              desc: 'Dynamic content that evolves with your progress',
            },
            {
              icon: (
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Track Your Growth',
              desc: 'Comprehensive analytics and progress insights',
            },
          ].map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'1rem' }}>
              <div style={{
                width:'48px', height:'48px', flexShrink:0,
                background:'rgba(255,255,255,0.1)',
                backdropFilter:'blur(10px)',
                border:'1px solid rgba(255,255,255,0.15)',
                borderRadius:'12px',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight:'600', fontSize:'1rem', marginBottom:'0.2rem' }}>{f.title}</p>
                <p style={{ color:'rgba(255,255,255,0.68)', fontSize:'0.875rem', lineHeight:'1.5' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem', position:'relative', zIndex:1 }}>
          Trusted by 50,000+ learners worldwide
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width:'100%', maxWidth:'440px' }}>

          {/* Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 25px 60px -12px rgba(99,102,241,0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            <h2 style={{ fontSize:'1.75rem', fontWeight:'700', color:'#0f172a', marginBottom:'0.4rem' }}>
              Create Account
            </h2>
            <p style={{ color:'#64748b', fontSize:'0.95rem', marginBottom:'1.75rem' }}>
              Start your personalized learning journey
            </p>

            {/* Error message */}
            {error && (
              <div style={{
                background:'#fef2f2',
                border:'1px solid #fecaca',
                borderLeft:'4px solid #ef4444',
                borderRadius:'10px',
                padding:'0.875rem 1rem',
                marginBottom:'1.25rem',
                color:'#dc2626',
                fontSize:'0.875rem',
                fontWeight:'500',
                display:'flex',
                alignItems:'center',
                gap:'0.5rem',
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

              {/* Username */}
              <div>
                <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'600', color:'#374151', marginBottom:'0.5rem' }}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  placeholder="johndoe"
                  required
                  style={inputStyle('username')}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'600', color:'#374151', marginBottom:'0.5rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="you@example.com"
                  required
                  style={inputStyle('email')}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'600', color:'#374151', marginBottom:'0.5rem' }}>
                  Password
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Create a strong password"
                    required
                    style={{ ...inputStyle('password'), paddingRight:'3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'0.25rem',
                    }}
                  >
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

                {/* Password strength bar */}
                {formData.password && (
                  <div style={{ marginTop:'0.6rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.35rem' }}>
                      <span style={{ fontSize:'0.75rem', color:'#94a3b8' }}>Password strength</span>
                      <span style={{ fontSize:'0.75rem', fontWeight:'600', color: strengthTextColor }}>{strengthLabel}</span>
                    </div>
                    <div style={{ height:'5px', background:'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                      <div style={{
                        height:'100%',
                        width:`${(passwordStrength / 4) * 100}%`,
                        background: strengthColor,
                        borderRadius:'99px',
                        transition:'all 0.4s ease',
                      }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label style={{ display:'block', fontSize:'0.875rem', fontWeight:'600', color:'#374151', marginBottom:'0.5rem' }}>
                  Confirm Password
                </label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Repeat your password"
                    required
                    style={{ ...inputStyle('confirmPassword'), paddingRight:'3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    style={{
                      position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'0.25rem',
                    }}
                  >
                    {showConfirmPass ? (
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

                {/* Match indicator */}
                {formData.confirmPassword && (
                  <p style={{
                    marginTop:'0.4rem', fontSize:'0.8rem', fontWeight:'500',
                    color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444',
                    display:'flex', alignItems:'center', gap:'0.3rem'
                  }}>
                    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width:'100%',
                  padding:'0.95rem',
                  background: loading
                    ? '#c7d2fe'
                    : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color:'white',
                  border:'none',
                  borderRadius:'12px',
                  fontSize:'1rem',
                  fontWeight:'700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
                  transition:'all 0.2s ease',
                  marginTop:'0.25rem',
                  letterSpacing:'0.3px',
                }}
                onMouseEnter={e => { if (!loading) e.target.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
              >
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                    <svg style={{ animation:'spin 1s linear infinite' }} width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>

            {/* Sign in link */}
            <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.9rem', color:'#64748b' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#4f46e5', fontWeight:'700', textDecoration:'none' }}>
                Sign in
              </Link>
            </p>

            {/* Terms */}
            <p style={{ textAlign:'center', marginTop:'1rem', fontSize:'0.75rem', color:'#94a3b8' }}>
              By creating an account, you agree to our{' '}
              <span style={{ color:'#4f46e5', cursor:'pointer' }}>Terms</span>
              {' '}and{' '}
              <span style={{ color:'#4f46e5', cursor:'pointer' }}>Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .signup-grid { grid-template-columns: 1fr !important; }
          .signup-left { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Signup;