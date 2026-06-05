import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetById } from '../api/pets.api';
import { submitRequest } from '../api/requests.api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const SPECIES_EMOJI = { Dog: '🐕', Cat: '🐈', Bird: '🦜', Rabbit: '🐰' };

const SPECIES_BG = {
  Dog:    { bg: '#FFF3E0', accent: '#FF8F00', blob: '#FFE0B2' },
  Cat:    { bg: '#F3E5F5', accent: '#8E24AA', blob: '#E1BEE7' },
  Bird:   { bg: '#E0F7FA', accent: '#00838F', blob: '#B2EBF2' },
  Rabbit: { bg: '#F1F8E9', accent: '#558B2F', blob: '#DCEDC8' },
};

/* ── Wobbly blob SVG background ── */
const BlobBg = ({ color }) => (
  <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
    <path fill={color}
      d="M320,200 C320,280 260,340 180,340 C100,340 60,280 60,200 C60,120 120,60 200,60 C280,60 320,120 320,200Z" />
  </svg>
);

/* ── Stat pill card ── */
const StatCard = ({ icon, label, value, bg, color }) => (
  <div style={{
    background: bg, borderRadius: 16, padding: '14px 18px',
    display: 'flex', alignItems: 'center', gap: 12,
    border: `2px solid ${color}22`,
    transition: 'transform 0.2s',
  }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
  >
    <span style={{ fontSize: 26 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{value || '—'}</div>
    </div>
  </div>
);

const PetDetailPage = () => {
  const { id }       = useParams();
  const { user }     = useAuth();
  const navigate     = useNavigate();

  const [pet, setPet]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm]             = useState({ pickupDate: '', message: '' });

  useEffect(() => {
    getPetById(id)
      .then(r => setPet(r.data.pet))
      .catch(() => { toast.error('Pet not found'); navigate('/pets'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user)                  { toast.error('Please login first'); navigate('/login'); return; }
    if (!form.pickupDate)       { toast.error('Please select a pickup date'); return; }
    if (!form.message.trim())   { toast.error('Please write a message'); return; }
    setSubmitting(true);
    try {
      await submitRequest(id, form);
      toast.success('Adoption request submitted! 🐾');
      setShowForm(false);
      setForm({ pickupDate: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!pet)    return <div style={{ textAlign: 'center', padding: 64 }}>Pet not found</div>;

  const isOwner  = user?.email === pet.ownerEmail;
  const today    = new Date().toISOString().split('T')[0];
  const theme    = SPECIES_BG[pet.species] || SPECIES_BG.Dog;

  const stats = [
    { icon: '🎂', label: 'Age',         value: pet.age,              bg: '#FFF8E1', color: '#F59E0B' },
    { icon: SPECIES_EMOJI[pet.species] || '🐾', label: 'Species',   value: pet.species,          bg: '#EDE9FE', color: '#7C3AED' },
    { icon: pet.gender === 'Male' ? '♂️' : '♀️', label: 'Gender',   value: pet.gender,           bg: '#DBEAFE', color: '#2563EB' },
    { icon: '💊', label: 'Health',       value: pet.healthStatus,     bg: '#DCFCE7', color: '#16A34A' },
    { icon: '💉', label: 'Vaccination',  value: pet.vaccinationStatus, bg: '#FCE7F3', color: '#DB2777' },
    { icon: '📍', label: 'Location',     value: pet.location,         bg: '#FEF3C7', color: '#D97706' },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 1060, margin: '0 auto', padding: '32px 24px' }}>

      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 28, padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700,
          background: 'var(--surface2)', color: 'var(--text2)', border: '2px solid var(--border)',
          cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.3,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = theme.accent; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = theme.accent; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
      >← Back</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 40, alignItems: 'start' }}>

        {/* ══ LEFT ══ */}
        <div className="animate-slideLeft">

          {/* Image card with blob bg */}
          <div style={{
            position: 'relative', width: '100%', height: 380, borderRadius: 28, overflow: 'hidden',
            background: theme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 20px 60px ${theme.accent}33`,
          }}>
            <BlobBg color={theme.blob} />
            {pet.imageURL
              ? <img src={pet.imageURL} alt={pet.name}
                  style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ position: 'relative', zIndex: 1, fontSize: 130, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))' }}>
                  {SPECIES_EMOJI[pet.species] || '🐾'}
                </span>
            }

            {/* Status badge top-right */}
            <div style={{
              position: 'absolute', top: 16, right: 16, zIndex: 2,
              padding: '6px 16px', borderRadius: 50, fontSize: 12, fontWeight: 800,
              background: pet.status === 'available' ? '#22C55E' : '#A855F7',
              color: '#fff', letterSpacing: 0.5, textTransform: 'uppercase',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}>
              {pet.status === 'available' ? '✅ Available' : '💜 Adopted'}
            </div>
          </div>

          {/* Tag pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {[
              { v: pet.species, bg: '#EDE9FE', c: '#7C3AED' },
              { v: pet.gender,  bg: '#DBEAFE', c: '#1D4ED8' },
              { v: pet.breed,   bg: '#FEF3C7', c: '#92400E' },
            ].filter(x => x.v).map(({ v, bg, c }) => (
              <span key={v} style={{
                padding: '6px 16px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                background: bg, color: c, border: `1.5px solid ${c}33`,
              }}>{v}</span>
            ))}
          </div>

          {/* Adoption fee big card */}
          <div style={{
            marginTop: 20, borderRadius: 20, padding: '20px 24px',
            background: `linear-gradient(135deg, ${theme.accent}EE, ${theme.accent}99)`,
            color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: `0 8px 24px ${theme.accent}44`,
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.85, letterSpacing: 1, textTransform: 'uppercase' }}>Adoption Fee</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3 }}>One-time payment</div>
            </div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>
              ৳{pet.adoptionFee?.toLocaleString() || 0}
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="animate-slideRight">

          {/* Name + breed */}
          <div style={{ marginBottom: 8 }}>
            <h1 style={{
              fontSize: 44, fontWeight: 900, margin: 0, lineHeight: 1.1,
              background: `linear-gradient(135deg, #1a1a2e, ${theme.accent})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{pet.name}</h1>
            <p style={{ color: 'var(--text2)', fontSize: 17, margin: '6px 0 4px', fontWeight: 500 }}>{pet.breed}</p>
          </div>

          {/* Description */}
          <p style={{
            lineHeight: 1.75, color: 'var(--text2)', fontSize: 14, marginBottom: 24,
            padding: '14px 18px', background: 'var(--surface2)', borderRadius: 14,
            borderLeft: `4px solid ${theme.accent}`,
          }}>
            {pet.description || 'No description provided.'}
          </p>

          {/* Stat cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {stats.map(s => <StatCard key={s.label} {...s} />)}
          </div>

          {/* CTA */}
          {pet.status === 'adopted' ? (
            <div style={{
              padding: '16px 22px', borderRadius: 18, fontWeight: 700, fontSize: 15,
              background: 'linear-gradient(135deg,#F3E8FF,#EDE9FE)',
              color: '#7C3AED', border: '2px solid #C4B5FD',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 28 }}>💜</span>
              <span>This pet has already found a forever home!</span>
            </div>
          ) : isOwner ? (
            <div style={{
              padding: '16px 22px', borderRadius: 18, fontWeight: 700, fontSize: 15,
              background: '#FFFBEB', color: '#92400E', border: '2px solid #FCD34D',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>ℹ️</span>
              <span>You own this listing — you cannot adopt your own pet.</span>
            </div>
          ) : (
            <button
              onClick={() => setShowForm(f => !f)}
              style={{
                width: '100%', padding: '16px 32px', borderRadius: 18, fontSize: 16, fontWeight: 800,
                background: showForm
                  ? 'linear-gradient(135deg,#ef4444,#dc2626)'
                  : `linear-gradient(135deg, ${theme.accent}, ${theme.accent}CC)`,
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: showForm ? '0 8px 24px rgba(239,68,68,.35)' : `0 8px 24px ${theme.accent}44`,
                transition: 'all 0.25s', letterSpacing: 0.3,
                transform: 'scale(1)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {showForm ? '✕ Cancel Request' : '🐾 Request Adoption'}
            </button>
          )}

          {/* ── Adoption Request Form ── */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="animate-slideDown"
              style={{
                marginTop: 20, borderRadius: 20, padding: 24,
                background: 'var(--surface2)', border: `2px solid ${theme.accent}33`,
                boxShadow: `0 8px 32px ${theme.accent}18`,
              }}
            >
              <h4 style={{ marginBottom: 18, fontSize: 17, fontWeight: 800, color: theme.accent }}>
                📋 Adoption Request
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {[
                  { label: 'Pet',        value: pet.name,                          icon: '🐾' },
                  { label: 'Your Name',  value: user?.name || user?.displayName || '', icon: '👤' },
                  { label: 'Your Email', value: user?.email || '',                 icon: '📧' },
                ].map(({ label, value, icon }) => (
                  <div key={label}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {icon} {label}
                    </label>
                    <input value={value} readOnly
                      style={{ width: '100%', background: 'var(--bg)', color: 'var(--text3)', borderRadius: 10, border: '1.5px solid var(--border)', padding: '10px 14px' }} />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    📅 Preferred Pickup Date <span style={{ color: theme.accent }}>*</span>
                  </label>
                  <input
                    type="date" value={form.pickupDate} min={today}
                    onChange={e => setForm(f => ({ ...f, pickupDate: e.target.value }))}
                    style={{ width: '100%', borderRadius: 10, border: `1.5px solid ${theme.accent}55`, padding: '10px 14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    💬 Message to Owner <span style={{ color: theme.accent }}>*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell the owner why you want to adopt this pet and about your home environment..."
                    rows={4}
                    style={{ width: '100%', borderRadius: 10, border: `1.5px solid ${theme.accent}55`, padding: '10px 14px', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit" disabled={submitting}
                  style={{
                    padding: '13px', borderRadius: 14, fontWeight: 800, fontSize: 15,
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}AA)`,
                    color: '#fff', border: 'none',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'all 0.2s',
                    boxShadow: `0 6px 18px ${theme.accent}44`,
                  }}
                >
                  {submitting ? '⏳ Submitting...' : '🐾 Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetDetailPage;