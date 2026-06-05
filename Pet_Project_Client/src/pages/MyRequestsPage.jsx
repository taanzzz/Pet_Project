import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyRequests, cancelRequest } from '../api/requests.api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_STYLE = {
  pending:  { background: '#FFF3CD', color: '#856404' },
  approved: { background: 'var(--accent-light)', color: 'var(--accent)' },
  rejected: { background: '#FFE8E8', color: '#C53030' },
};

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyRequests()
      .then(res => setRequests(res.data.requests))
      .catch(() => toast.error('Failed to load requests'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this adoption request?')) return;
    try {
      await cancelRequest(id);
      toast.success('Request cancelled');
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="page-enter" style={{ padding: '48px 24px', maxWidth: 1000, margin: '0 auto' }}>

      <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>My Adoption Requests</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Track all your adoption requests in one place</p>
      </div>

      {requests.length === 0 ? (
        <div className="animate-scaleIn" style={{ textAlign: 'center', padding: '72px 24px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 20, color: 'var(--text2)', marginBottom: 8 }}>No requests yet</h3>
          <p style={{ marginBottom: 24 }}>Browse our pets and submit your first adoption request!</p>
          <button
            onClick={() => navigate('/pets')}
            className="btn-primary"
            style={{ padding: '11px 28px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
          >Browse Pets 🐾</button>
        </div>
      ) : (
        <>
          {/* Summary chips */}
          <div className="animate-fadeInUp delay-1" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
            {['pending', 'approved', 'rejected'].map(s => {
              const count = requests.filter(r => r.status === s).length;
              if (!count) return null;
              return (
                <span key={s} style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  ...(STATUS_STYLE[s] || {}),
                }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}: {count}
                </span>
              );
            })}
          </div>

          {/* Table */}
          <div className="animate-fadeInUp delay-2" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: 'var(--surface2)' }}>
                    {['Pet Name', 'Request Date', 'Pickup Date', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '13px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.6px', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, i) => (
                    <tr
                      key={req._id}
                      style={{
                        borderTop: '1px solid var(--border)',
                        transition: 'background 0.15s',
                        animation: `fadeInUp 0.4s ${i * 0.05}s both`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 600, fontSize: 14 }}>{req.petName}</td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                        {new Date(req.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap' }}>{req.pickupDate}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                          ...(STATUS_STYLE[req.status] || {}),
                        }}>{req.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {(req.petId) && (
                            <button
                              onClick={() => navigate(`/pets/${req.petId?._id || req.petId}`)}
                              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; }}
                            >View Pet</button>
                          )}
                          {req.status === 'pending' && (
                            <button
                              onClick={() => handleCancel(req._id)}
                              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FFE8E8', color: '#C53030', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >Cancel</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyRequestsPage;