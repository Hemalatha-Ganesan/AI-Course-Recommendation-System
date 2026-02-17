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
  const [focusedField, setFocusedField] = useState('');

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
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const inputStyle = (field) => ({
    width: '100%',
    padding: '0.875rem 1rem',
    border: `2px solid ${focusedField === field ? '#6366f1' : '#e2e8f0'}`,
    borderRadius: '12px',
    fontSize: '0.95rem',
    outline: 'none',
    background: focusedField === field ? '#fff' : '#f8fafc',
    color: '#0f172a',
    boxShadow: focusedField === field ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
    transition: 'all 0.2s ease',
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
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'350px', height:'350px', background:'rgba(255,255,255,0.06)', borderRadius:'50%', filter:'blur(60px)' }} />
        <div style={{ position:'absolute', bottom:'-100px', left:'-80px', width:'300px', height:'300px', background:'rgba(167,139,250,0.15)', borderRadius:'50%', filter:'blur(50px)' }} />

        {/* Logo */}
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontSize:'2.25rem', fontWeight:'800', letterSpacing:'-1px', marginBottom:'0.75rem' }}>
            CourseAI
          </h1>
          <div style={{ width:'48px', height:'4px', background:'rgba(255,255,255,0.45)', borderRadius:'2px', marginBottom:'1.25rem' }} />
          <p style={{ fontSize:'1.1rem', lineHeight:'1.75', color:'rgba(255,255,255,0.85)', maxWidth:'360px' }}>
            Welcome back! Continue your personalized AI-powered learning journey where you left off.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          {[
            { number: '50K+', label: 'Active Learners' },
            { number: '234',  label: 'Courses Available' },
            { number: '4.9★', label: 'Average Rating' },
            { number: '95%',  label: 'Completion Rate' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
            }}>
              <p style={{ fontSize:'1.5rem', fontWeight:'800', marginBottom:'0.25rem' }}>{stat.number}</p>
              <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.7)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{
          position: 'relative', zIndex:1,
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
        }}>
          <p style={{ fontSize:'0.9rem', color:'rgba(255,255,255,0.85)', lineHeight:'1.6', marginBottom:'0.75rem' }}>
            "CourseAI completely transformed how I learn. The AI recommendations are spot-on!"
          </p>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{
              width:'36px', height:'36px', borderRadius:'50%',
              background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontWeight:'700', fontSize:'0.875rem',
            }}>S</div>
            <div>
              <p style={{ fontWeight:'600', fontSize:'0.875rem' }}>Sarah M.</p>
              <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.6)' }}>Software Engineer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div style={{
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <div style={{ width:'100%', maxWidth:'420px' }}>

          {/* Card */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 25px 60px -12px rgba(99,102,241,0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
          }}>
            {/* Header */}
            <div style={{ marginBottom:'1.75rem' }}>
              <h2 style={{ fontSize:'1.75rem', fontWeight:'700', color:'#0f172a', marginBottom:'0.4rem' }}>
                Welcome Back 👋
              </h2>
              <p style={{ color:'#64748b', fontSize:'0.95rem' }}>
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Error */}
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
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                  <label style={{ fontSize:'0.875rem', fontWeight:'600', color:'#374151' }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize:'0.8rem', color:'#6366f1', fontWeight:'600', textDecoration:'none' }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your password"
                    required
                    style={{ ...inputStyle('password'), paddingRight:'3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)',
                      background:'none', border:'none', cursor:'pointer', color:'#94a3b8', padding:'0.25rem',
                      display:'flex', alignItems:'center',
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
              </div>

              {/* Remember Me */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  style={{ width:'17px', height:'17px', accentColor:'#6366f1', cursor:'pointer' }}
                />
                <label htmlFor="remember" style={{ fontSize:'0.875rem', color:'#64748b', cursor:'pointer' }}>
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                style={{
                  width: '100%',
                  padding: '0.95rem',
                  background: loading
                    ? '#c7d2fe'
                    : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.4)',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.3px',
                }}
              >
                {loading ? (
                  <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                    <svg style={{ animation:'spin 1s linear infinite' }} width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity:0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity:0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            {/* Sign up link */}
            <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.9rem', color:'#64748b' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color:'#4f46e5', fontWeight:'700', textDecoration:'none' }}>
                Sign up free
              </Link>
            </p>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'1.25rem 0' }}>
              <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
              <span style={{ fontSize:'0.75rem', color:'#94a3b8', fontWeight:'500' }}>TEST CREDENTIALS</span>
              <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
            </div>

            {/* Clickable Test Credentials */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {[
                { role:'Admin', email:'admin@test.com', pass:'admin123', color:'#6366f1', bg:'#eef2ff' },
                { role:'User',  email:'user@test.com',  pass:'user123',  color:'#0891b2', bg:'#ecfeff' },
              ].map((cred, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFormData({ email: cred.email, password: cred.pass });
                    setError('');
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = cred.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = `${cred.color}22`}
                  style={{
                    background: cred.bg,
                    border: `1.5px solid ${cred.color}22`,
                    borderRadius: '10px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <p style={{ fontSize:'0.7rem', fontWeight:'700', color: cred.color, marginBottom:'0.2rem', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    {cred.role} ↗
                  </p>
                  <p style={{ fontSize:'0.72rem', color:'#475569', marginBottom:'0.1rem' }}>{cred.email}</p>
                  <p style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{cred.pass}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;