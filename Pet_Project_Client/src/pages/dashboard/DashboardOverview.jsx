import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyPets } from '../../api/pets.api';
import { getMyRequests } from '../../api/requests.api';

const DashboardOverview = () => {
  const { user }   = useAuth();
  const [myPets,   setMyPets]  = useState([]);
  const [myReqs,   setMyReqs]  = useState([]);
  const [loading,  setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getMyPets().then(r => setMyPets(r.data.pets)).catch(() => {}),
      getMyRequests().then(r => setMyReqs(r.data.requests)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'My Listings',      value: myPets.length,                                         color: 'var(--primary)', icon: '🐾' },
    { label: 'Available',        value: myPets.filter(p => p.status === 'available').length,    color: 'var(--accent)',  icon: '✅' },
    { label: 'Adopted',          value: myPets.filter(p => p.status === 'adopted').length,      color: '#7C3AED',        icon: '💜' },
    { label: 'My Requests',      value: myReqs.length,                                          color: 'var(--primary)', icon: '📋' },
    { label: 'Approved',         value: myReqs.filter(r => r.status === 'approved').length,     color: 'var(--accent)',  icon: '🎉' },
    { label: 'Pending',          value: myReqs.filter(r => r.status === 'pending').length,      color: '#D97706',        icon: '⏳' },
  ];

  const quickActions = [
    { to: '/dashboard/add-pet',      label: ' Add New Pet',    primary: true  },
    { to: '/dashboard/my-listings',  label: ' My Listings',   primary: false },
    { to: '/my-requests',            label: ' My Requests',   primary: false },
    { to: '/pets',                   label: ' Browse Pets',   primary: false },
  ];

  return (
    <div className="page-enter">
      
      <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          Here is a summary of your PawsHome activity
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`animate-fadeInUp delay-${i + 1}`}
            style={{
              background: 'var(--surface)', borderRadius: 14,
              border: '1px solid var(--border)', padding: '20px 16px', textAlign: 'center',
              transition: 'transform 0.25s, box-shadow 0.25s',
              cursor: 'default',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div
              className="stat-value"
              style={{ fontFamily: "'Playfair Display',serif", fontSize: 34, fontWeight: 900, color: s.color, lineHeight: 1 }}
            >
              {loading ? '—' : s.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      
      <div className="animate-fadeInUp delay-4" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 17 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {quickActions.map(({ to, label, primary }) => (
            <Link
              key={to} to={to}
              className={primary ? 'btn-primary' : ''}
              style={{
                padding: '10px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14,
                background: primary ? 'var(--primary)' : 'var(--surface2)',
                color: primary ? '#fff' : 'var(--text2)',
                textDecoration: 'none', transition: 'all 0.2s ease',
                border: primary ? 'none' : '1px solid var(--border)',
                display: 'inline-block',
              }}
              onMouseEnter={e => { if (!primary) { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; } }}
              onMouseLeave={e => { if (!primary) { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; } }}
            >{label}</Link>
          ))}
        </div>
      </div>

      
      {myPets.length > 0 && (
        <div className="animate-fadeInUp delay-5" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 17 }}>Recent Listings</h3>
            <Link to="/dashboard/my-listings" style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {myPets.slice(0, 4).map(pet => (
              <div key={pet._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--surface2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {pet.imageURL
                    ? <img src={pet.imageURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐈' : pet.species === 'Bird' ? '🦜' : '🐰')
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{pet.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{pet.breed} · {pet.age}</div>
                </div>
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0,
                  background: pet.status === 'available' ? 'var(--accent-light)' : '#F3E8FF',
                  color: pet.status === 'available' ? 'var(--accent)' : '#7C3AED',
                }}>{pet.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;