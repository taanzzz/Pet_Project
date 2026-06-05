import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
    <div>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🐾</div>
      <h1 style={{ fontSize: 72, color: 'var(--primary)', fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>404</h1>
      <h3 style={{ marginBottom: 8 }}>Oops! Page not found</h3>
      <p style={{ color: 'var(--text2)', marginBottom: 24 }}>Looks like this page wandered off like a curious puppy!</p>
      <Link to="/" style={{ padding: '12px 28px', borderRadius: 12, fontSize: 15, fontWeight: 600, background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}>🏠 Back to Home</Link>
    </div>
  </div>
);

export default NotFoundPage;
