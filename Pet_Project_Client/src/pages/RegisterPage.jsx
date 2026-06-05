import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const inputStyle = {
  width: '100%',
  padding: '13px 14px 13px 42px',
  background: '#242018',
  border: '1.5px solid rgba(255,255,255,.08)',
  borderRadius: 12,
  fontSize: 14,
  color: '#F5F0EA',
  outline: 'none',
  transition: 'border-color .2s',
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box',
};

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const { registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const focus = e => { e.target.style.borderColor = 'rgba(240,134,106,.55)'; };
  const blur  = e => { e.target.style.borderColor = 'rgba(255,255,255,.08)'; };

  const validate = () => {
    if (!form.name.trim())  { toast.error('Name is required'); return false; }
    if (!form.email.trim()) { toast.error('Email is required'); return false; }
    if (form.password.length < 6)          { toast.error('Password must be at least 6 characters'); return false; }
    if (!/[A-Z]/.test(form.password))      { toast.error('Password needs at least one uppercase letter'); return false; }
    if (!/[a-z]/.test(form.password))      { toast.error('Password needs at least one lowercase letter'); return false; }
    if (!/[!@#$%^&*]/.test(form.password)) { toast.error('Password needs at least one special character (!@#$%^&*)'); return false; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerUser(form.name, form.email, form.password, form.photoURL || undefined);
      toast.success('Account created! Welcome to PawsHome 🐾');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  setLoading(true);
  try {
    await googleLogin();
    // redirect হবে
  } catch {
    setLoading(false);
    toast.error('Google login failed. Try again.');
  }
};

  return (
    <div style={{
      minHeight: '100vh', background: '#0E0C0A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 16px', fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
        <div style={{ width: 34, height: 34, background: '#F0866A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🐾</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 20, color: '#F5F0EA' }}>PawsHome</span>
      </div>

      {/* Card */}
      <div className="animate-scaleIn" style={{
        width: '100%', maxWidth: 440,
        background: '#1C1814', borderRadius: 24,
        border: '1px solid rgba(255,255,255,.07)',
        boxShadow: '0 32px 80px rgba(0,0,0,.55)', overflow: 'hidden',
      }}>
        {/* Hero strip */}
        <div style={{
          height: 110,
          background: 'linear-gradient(160deg, #2A1208 0%, #4A1E0C 60%, #3D1A18 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(240,134,106,.06)', top: -60, right: -50 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #1C1814 100%)', zIndex: 2 }} />
          <div style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>🐕 🐱</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ padding: '24px 28px 32px' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 24, color: '#F5F0EA', marginBottom: 4 }}>Create Account</h2>
            <p style={{ fontSize: 13, color: '#5C4A38' }}>Join PawsHome and help pets find loving homes</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* Full Name */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#7A6858', display: 'block', marginBottom: 6, letterSpacing: '.08em' }}>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: '#4A3C2E' }}>👤</span>
                <input type="text" value={form.name} required placeholder="Rahim Khan" onChange={set('name')} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#7A6858', display: 'block', marginBottom: 6, letterSpacing: '.08em' }}>EMAIL</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#4A3C2E', fontWeight: 500 }}>@</span>
                <input type="email" value={form.email} required placeholder="you@example.com" onChange={set('email')} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#7A6858', display: 'block', marginBottom: 6, letterSpacing: '.08em' }}>
                PHOTO URL <span style={{ color: '#3C2E22', fontWeight: 400 }}>(optional)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#4A3C2E' }}>🖼</span>
                <input type="url" value={form.photoURL} placeholder="https://example.com/photo.jpg" onChange={set('photoURL')} style={inputStyle} onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#7A6858', display: 'block', marginBottom: 6, letterSpacing: '.08em' }}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#4A3C2E', fontWeight: 500 }}>*</span>
                <input type={showPass ? 'text' : 'password'} value={form.password} required placeholder="••••••••" onChange={set('password')} style={{ ...inputStyle, paddingRight: 60 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A3C2E', fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <p style={{ fontSize: 10, color: '#3C2E22', marginTop: 5 }}>
                Min 6 chars · one uppercase · one lowercase · one special character (!@#$%^&*)
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: '#7A6858', display: 'block', marginBottom: 6, letterSpacing: '.08em' }}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: '#4A3C2E', fontWeight: 500 }}>✓</span>
                <input type={showConf ? 'text' : 'password'} value={form.confirmPassword} required placeholder="••••••••" onChange={set('confirmPassword')} style={{ ...inputStyle, paddingRight: 60 }} onFocus={focus} onBlur={blur} />
                <button type="button" onClick={() => setShowConf(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4A3C2E', fontSize: 11, fontWeight: 700, letterSpacing: '.06em' }}>
                  {showConf ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px 0', marginTop: 4,
              background: loading ? '#2C261E' : 'linear-gradient(135deg, #F0866A 0%, #D9623E 100%)',
              color: loading ? '#5C4A38' : '#fff',
              border: 'none', borderRadius: 50, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 28px rgba(240,134,106,.3)',
              transition: 'all .2s',
            }}>
              {loading ? 'Creating account...' : 'Create Account →'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
              <span style={{ fontSize: 11, color: '#3C2E22', fontWeight: 700, letterSpacing: '.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.06)' }} />
            </div>

            {/* Google */}
            <button type="button" onClick={handleGoogle} disabled={loading} style={{
              width: '100%', padding: '13px 0',
              background: '#242018', border: '1.5px solid rgba(255,255,255,.09)',
              borderRadius: 50, fontSize: 14, fontWeight: 600, color: '#F5F0EA',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(240,134,106,.3)'; e.currentTarget.style.background = '#2C261E'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.09)'; e.currentTarget.style.background = '#242018'; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#5C4A38', paddingTop: 2 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#F0866A', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>

      <p style={{ fontSize: 11, color: '#2C1E14', marginTop: 20 }}>© {new Date().getFullYear()} PawsHome · All rights reserved</p>
    </div>
  );
};

export default RegisterPage;