import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPets, deletePet } from '../../api/pets.api';
import { getPetRequests, updateRequestStatus } from '../../api/requests.api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const MyListingsPage = () => {
  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [reqModal, setReqModal] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPets = () => {
    getMyPets()
      .then(r => setPets(r.data.pets))
      .catch(() => toast.error('Failed to load listings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPets(); }, []);

  const openRequests = async (pet) => {
    setReqModal(pet);
    setRequests([]);
    setReqLoading(true);
    try {
      const res = await getPetRequests(pet._id);
      setRequests(res.data.requests);
    } catch {
      toast.error('Failed to load requests');
    } finally {
      setReqLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this pet listing? This cannot be undone.')) return;
    try {
      await deletePet(id);
      toast.success('Pet listing deleted');
      setPets(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  /* BUG FIX: previous logic tried to update OTHER requests inside the same
     .map(), causing wrong status changes. Now: approve the selected request,
     reject all OTHER pending requests for that pet (only on approve). */
  const handleStatus = async (reqId, status) => {
    try {
      await updateRequestStatus(reqId, status);
      toast.success(`Request ${status} successfully`);

      if (status === 'approved') {
        // Mark the approved one, reject other pending ones
        setRequests(prev =>
          prev.map(r => {
            if (r._id === reqId) return { ...r, status: 'approved' };
            if (r.status === 'pending') return { ...r, status: 'rejected' };
            return r;
          })
        );
        // Update the pet card to 'adopted'
        setPets(prev =>
          prev.map(p => p._id === reqModal._id ? { ...p, status: 'adopted' } : p)
        );
        // Update the modal reference so the badge refreshes
        setReqModal(prev => prev ? { ...prev, status: 'adopted' } : prev);
      } else {
        // Just update the rejected/pending request
        setRequests(prev =>
          prev.map(r => r._id === reqId ? { ...r, status } : r)
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  const total     = pets.length;
  const available = pets.filter(p => p.status === 'available').length;
  const adopted   = pets.filter(p => p.status === 'adopted').length;

  const statusColor = {
    available: { bg: 'var(--accent-light)',  color: 'var(--accent)' },
    adopted:   { bg: '#F3E8FF',              color: '#7C3AED'        },
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>My Pet Listings</h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>Manage your listings and review adoption requests</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/add-pet')}
          className="btn-primary"
          style={{ padding: '10px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}
        >+ Add New Pet</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
        {[['Total', total, 'var(--primary)'], ['Available', available, 'var(--accent)'], ['Adopted', adopted, '#7C3AED']].map(([l, v, c], i) => (
          <div key={l} className={`animate-fadeInUp delay-${i + 1}`} style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 20, textAlign: 'center' }}>
            <div className="stat-value" style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 900, color: c }}>{v}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {pets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
          <h3 style={{ color: 'var(--text2)', marginBottom: 8 }}>No listings yet</h3>
          <p style={{ marginBottom: 20 }}>Start by adding your first pet listing</p>
          <button onClick={() => navigate('/dashboard/add-pet')} style={{ padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer' }}>
            Add First Pet
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 20 }}>
          {pets.map((pet, idx) => (
            <div
              key={pet._id}
              className={`pet-card animate-fadeInUp delay-${(idx % 6) + 1}`}
              style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}
            >
              {/* Image */}
              <div className="pet-card-img" style={{ height: 190, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, position: 'relative', overflow: 'hidden' }}>
                {pet.imageURL
                  ? <img src={pet.imageURL} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span>{pet.species === 'Dog' ? '🐕' : pet.species === 'Cat' ? '🐈' : pet.species === 'Bird' ? '🦜' : '🐰'}</span>
                }
                <span style={{
                  position: 'absolute', top: 10, right: 10,
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                  background: (statusColor[pet.status] || statusColor.available).bg,
                  color: (statusColor[pet.status] || statusColor.available).color,
                }}>{pet.status}</span>
              </div>

              {/* Info */}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <h3 style={{ fontSize: 18 }}>{pet.name}</h3>
                  <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, color: 'var(--primary)', fontWeight: 700 }}>
                    ৳{pet.adoptionFee?.toLocaleString()}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>{pet.breed} · {pet.age}</p>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => openRequests(pet)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#EEF2FF', color: '#4F46E5', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >📋 Requests</button>
                  <button onClick={() => navigate(`/dashboard/edit-pet/${pet._id}`)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'var(--surface2)', color: 'var(--text2)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >✏️ Edit</button>
                  <button onClick={() => navigate(`/pets/${pet._id}`)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'var(--surface2)', color: 'var(--text2)', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >👁 View</button>
                  <button onClick={() => handleDelete(pet._id)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: '#FFE8E8', color: '#C53030', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >🗑 Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Requests Modal ── */}
      {reqModal && (
        <div
          className="modal-backdrop"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={() => setReqModal(null)}
        >
          <div
            className="modal-content"
            style={{ background: 'var(--surface)', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,.25)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 1 }}>
              <div>
                <h3 style={{ marginBottom: 2 }}>Requests for {reqModal.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text3)' }}>
                  {reqLoading ? 'Loading...' : `${requests.length} request${requests.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              <button onClick={() => setReqModal(null)} style={{ background: 'var(--surface2)', border: 'none', width: 36, height: 36, borderRadius: '50%', fontSize: 18, cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0e0d5'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}
              >✕</button>
            </div>

            <div style={{ padding: '20px 28px 28px' }}>
              {reqLoading ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ fontSize: 36, animation: 'spin 1s linear infinite' }}>🐾</div>
                </div>
              ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text3)' }}>
                  <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
                  <p style={{ fontWeight: 500, color: 'var(--text2)' }}>No adoption requests yet</p>
                  <p style={{ fontSize: 13, marginTop: 4 }}>Share your listing to attract more interest</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {requests.map(r => {
                    const statusStyle = {
                      pending:  { bg: '#FFF3CD', color: '#856404' },
                      approved: { bg: 'var(--accent-light)', color: 'var(--accent)' },
                      rejected: { bg: '#FFE8E8', color: '#C53030' },
                    }[r.status] || {};

                    return (
                      <div key={r._id} style={{ background: 'var(--surface2)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', transition: 'border-color 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{r.requesterName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{r.requesterEmail}</div>
                          </div>
                          <span style={{ padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, textTransform: 'capitalize' }}>{r.status}</span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>
                          📅 Pickup: <strong>{r.pickupDate}</strong>
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text2)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>
                          "{r.message}"
                        </p>
                        {r.status === 'pending' && reqModal.status !== 'adopted' && (
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              onClick={() => handleStatus(r._id, 'approved')}
                              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >✓ Approve</button>
                            <button
                              onClick={() => handleStatus(r._id, 'rejected')}
                              style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, background: '#e53e3e', color: '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >✗ Reject</button>
                          </div>
                        )}
                        {reqModal.status === 'adopted' && r.status === 'pending' && (
                          <p style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Pet already adopted — cannot action this request.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListingsPage;