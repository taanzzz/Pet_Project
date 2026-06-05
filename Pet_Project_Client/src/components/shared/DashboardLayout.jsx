import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../shared/Navbar';

const links = [
  { to: '/dashboard', icon: '⚡', label: 'Overview', end: true },
  { to: '/dashboard/my-listings', icon: '🐾', label: 'My Listings' },
  { to: '/dashboard/add-pet', icon: '➕', label: 'Add Pet' },
  { to: '/my-requests', icon: '📋', label: 'My Requests' },
];

const DashboardLayout = () => (
  <>
    <Navbar />
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        padding: '24px 12px', flexShrink: 0,
        position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflowY: 'auto',
      }}>
        <p style={{
          fontSize: 11, fontWeight: 700, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '.8px',
          padding: '0 12px', marginBottom: 10,
        }}>Dashboard</p>

        {links.map(({ to, icon, label, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 8,
            fontSize: 14, fontWeight: isActive ? 600 : 400,
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--text2)',
            background: isActive ? 'var(--primary-light)' : 'transparent',
            transition: 'all 0.2s', marginBottom: 2,
          })}
            onMouseEnter={e => { if (!e.currentTarget.style.color.includes('primary')) { e.currentTarget.style.background = 'var(--surface2)'; } }}
            onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) { e.currentTarget.style.background = 'transparent'; } }}
          >
            <span style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, padding: 32, overflowY: 'auto', background: 'var(--bg)' }}>
        <Outlet />
      </div>
    </div>
  </>
);

export default DashboardLayout;