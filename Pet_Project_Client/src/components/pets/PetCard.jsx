import { useNavigate } from 'react-router-dom';

const SPECIES_EMOJI = { Dog: '🐕', Cat: '🐈', Bird: '🦜', Rabbit: '🐰', Other: '🐾' };

const statusStyle = {
  available: { background: '#E5F4EC', color: '#0F6E56' },
  adopted:   { background: '#F3E8FF', color: '#7C3AED' },
};

const PetCard = ({ pet, index = 0 }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`pet-card animate-fadeInUp delay-${(index % 6) + 1}`}
      onClick={() => navigate(`/pets/${pet._id}`)}
      style={{
        background: 'var(--surface)', borderRadius: 16,
        border: '1px solid var(--border)', overflow: 'hidden',
        boxShadow: 'var(--shadow)', cursor: 'pointer',
      }}
    >
      {/* Image */}
      <div className="pet-card-img" style={{
        height: 215, background: 'var(--surface2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 72, position: 'relative', overflow: 'hidden',
      }}>
        {pet.imageURL
          ? <img src={pet.imageURL} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span>{SPECIES_EMOJI[pet.species] || '🐾'}</span>
        }
        <span style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
          ...(statusStyle[pet.status] || statusStyle.available),
        }}>{pet.status}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <h3 style={{ fontSize: 19, margin: 0 }}>{pet.name}</h3>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: 'var(--primary)', flexShrink: 0 }}>
            ৳{pet.adoptionFee?.toLocaleString() || 0}
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>{pet.breed} · {pet.age}</p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
          {[
            `${SPECIES_EMOJI[pet.species] || ''} ${pet.species}`,
            pet.gender,
            pet.healthStatus,
          ].filter(Boolean).map(tag => (
            <span key={tag} style={{
              padding: '3px 10px', borderRadius: 20, fontSize: 11,
              background: 'var(--surface2)', color: 'var(--text3)',
              border: '1px solid var(--border)',
            }}>{tag}</span>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>📍 {pet.location}</span>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/pets/${pet._id}`); }}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700,
              background: 'var(--primary-light)', color: 'var(--primary)',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
          >View Details</button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;