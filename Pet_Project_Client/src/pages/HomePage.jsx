import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PetCard from '../components/pets/PetCard';
import { getAllPets } from '../api/pets.api';
import { useAuth } from '../context/AuthContext';

const useReveal = (threshold = 0.12) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const PLACEHOLDER_PETS = [
  { name: 'Cooper', breed: 'Pembroke Welsh Corgi', age: '2 Years', species: 'Dog', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80', badge: 'New Arrival', badgeColor: '#1a7a4a' },
  { name: 'Luna', breed: 'Domestic Shorthair', age: '1 Year', species: 'Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80', badge: 'Staff Fav', badgeColor: '#b43c1e' },
  { name: 'Max', breed: 'French Bulldog', age: '3 Years', species: 'Dog', img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80' },
  { name: 'Bear', breed: 'German Shepherd', age: '4 Years', species: 'Dog', img: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400&q=80' },
  { name: 'Mango', breed: 'Persian Cat', age: '8 Months', species: 'Cat', img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80', badge: 'Gentle', badgeColor: '#6d28d9' },
  { name: 'Rio', breed: 'African Grey Parrot', age: '3 Years', species: 'Bird', img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80' },
];

const EMOJI = { Dog: '🐕', Cat: '🐈', Bird: '🦜', Rabbit: '🐰', Other: '🐾' };

const HomePage = () => {
  const [pets, setPets] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [heroRef, heroVisible] = useReveal(0.1);
  const [petsRef, petsVisible] = useReveal(0.1);
  const [whyRef, whyVisible] = useReveal(0.1);
  const [storiesRef, storiesVisible] = useReveal(0.1);
  const [careRef, careVisible] = useReveal(0.1);
  const [statsRef, statsVisible] = useReveal(0.1);
  const [adoptRef, adoptVisible] = useReveal(0.1);

  useEffect(() => {
    getAllPets()
      .then(res => setPets((res.data.pets || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  const handleAdoptNow = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/pets');
  };

  const visStyle = (visible, delay = '0s') => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(28px)',
    transition: `all 0.7s ease ${delay}`,
  });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '90vh',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        background: '#f0ece6',
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center right', opacity: 0.5,
        }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, #f0ece6 42%, transparent 78%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 48px', width: '100%' }}>
          <div style={{ ...visStyle(heroVisible), display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(180,60,30,0.1)', border: '1px solid rgba(180,60,30,0.2)', borderRadius: 50, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#b43c1e', display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#b43c1e', letterSpacing: '.04em' }}>Trusted by 10k+ families across Bangladesh</span>
          </div>

          <h1 style={{ ...visStyle(heroVisible, '0.1s'), fontSize: 'clamp(48px,6vw,80px)', fontFamily: "'Playfair Display', serif", fontWeight: 700, lineHeight: 1.1, marginBottom: 24, maxWidth: 640 }}>
            Find Your New <span style={{ color: '#b43c1e', fontStyle: 'italic' }}>Best<br />Friend</span>
          </h1>

          <p style={{ ...visStyle(heroVisible, '0.2s'), fontSize: 17, color: '#5a4a3a', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
            Connecting loving homes with pets in need across Bangladesh. Start your journey to pet parenthood today.
          </p>

          <div style={{ ...visStyle(heroVisible, '0.3s'), display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={handleAdoptNow} style={{
              padding: '16px 32px', borderRadius: 50, background: '#b43c1e', color: '#fff',
              fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(180,60,30,0.35)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#8f2e14'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#b43c1e'; e.currentTarget.style.transform = 'none'; }}
            >Adopt Now →</button>
            <Link to="/pets" style={{
              padding: '16px 32px', borderRadius: 50, background: 'rgba(255,255,255,0.85)',
              color: '#1a1008', fontSize: 15, fontWeight: 600, textDecoration: 'none',
              border: '1.5px solid rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
            >View All Pets</Link>
          </div>

          {/* Hero stats */}
          <div style={{ ...visStyle(heroVisible, '0.4s'), display: 'flex', gap: 32, marginTop: 56, flexWrap: 'wrap' }}>
            {[['5,000+', 'Pets Adopted'], ['1,200+', 'Happy Families'], ['50+', 'Cities Covered']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 900, color: '#b43c1e' }}>{num}</div>
                <div style={{ fontSize: 13, color: '#7a6858' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PETS ── */}
      <section ref={petsRef} style={{ padding: '88px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 12 }}>
          <div style={visStyle(petsVisible)}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,40px)', marginBottom: 8 }}>Meet Our Residents</h2>
            <p style={{ color: '#7a6858', fontSize: 15 }}>Lovable companions waiting for their forever homes.</p>
          </div>
          <Link to="/pets" style={{ fontSize: 14, fontWeight: 600, color: '#b43c1e', textDecoration: 'none', ...visStyle(petsVisible, '0.2s') }}>
            See all pets →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }}>
          {pets.length > 0
            ? pets.map((pet, i) => <PetCard key={pet._id} pet={pet} index={i} />)
            : PLACEHOLDER_PETS.map((pet, i) => (
              <div key={pet.name} style={{
                background: 'var(--surface)', borderRadius: 20, overflow: 'hidden',
                border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                ...visStyle(petsVisible, `${i * 0.08}s`),
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
                  <img src={pet.img} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                  {pet.badge && (
                    <span style={{ position: 'absolute', top: 12, left: 12, background: pet.badgeColor, color: '#fff', padding: '4px 12px', borderRadius: 50, fontSize: 11, fontWeight: 700 }}>{pet.badge}</span>
                  )}
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 21 }}>{pet.name}</h3>
                    <span style={{ fontSize: 13, color: '#7a6858' }}>{pet.age}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#a89078', marginBottom: 16 }}>{pet.breed}</p>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
                    {[EMOJI[pet.species] + ' ' + pet.species, 'Vaccinated'].map(t => (
                      <span key={t} style={{ padding: '4px 12px', borderRadius: 50, fontSize: 12, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)' }}>{t}</span>
                    ))}
                  </div>
                  <button onClick={handleAdoptNow} style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '11px', borderRadius: 50, border: '1.5px solid var(--border)',
                    color: 'var(--text2)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    background: 'var(--surface)', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#b43c1e'; e.currentTarget.style.color = '#b43c1e'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)'; }}
                  >View Details</button>
                </div>
              </div>
            ))
          }
        </div>
      </section>

      {/* ── WHY ADOPT ── */}
      <section ref={whyRef} style={{ background: 'var(--surface)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 64, alignItems: 'center' }}>
          <div style={visStyle(whyVisible)}>
            <div style={{ borderRadius: 24, overflow: 'hidden', height: 420, position: 'relative' }}>
              <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&q=80" alt="Happy pet adoption" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{
              background: 'var(--surface)', borderRadius: 16, padding: '20px 24px',
              boxShadow: '0 12px 40px rgba(0,0,0,.14)', minWidth: 180,
              marginTop: -60, marginLeft: 24, position: 'relative', zIndex: 1, display: 'inline-block',
            }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 900, color: '#b43c1e' }}>5,000+</div>
              <div style={{ fontSize: 13, color: '#7a6858', lineHeight: 1.4, marginTop: 4 }}>Happy pets adopted<br />this year alone.</div>
            </div>
          </div>

          <div style={visStyle(whyVisible, '0.15s')}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', marginBottom: 8, lineHeight: 1.15 }}>Why Adopt from</h2>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', color: '#b43c1e', marginBottom: 36, lineHeight: 1.15 }}>PawsHome?</h2>

            {[
              { icon: '🤝', title: 'Community Impact', text: "By adopting, you're giving a second chance to a deserving animal and freeing up space in shelters." },
              { icon: '🛡️', title: 'Professional Screening', text: 'Our matching process ensures that every pet goes to a home that fits their unique personality and needs.' },
              { icon: '💊', title: 'Health Guarantee', text: 'All PawsHome residents are fully vaccinated, microchipped, and come with full medical history.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: 18, marginBottom: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: 'rgba(180,60,30,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {item.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{item.title}</h4>
                  <p style={{ fontSize: 14, color: '#7a6858', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              </div>
            ))}

            <button onClick={handleAdoptNow} style={{
              display: 'inline-block', marginTop: 8, padding: '14px 32px', borderRadius: 50,
              background: '#b43c1e', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(180,60,30,0.3)', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#8f2e14'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#b43c1e'; e.currentTarget.style.transform = 'none'; }}
            >Start Adopting</button>
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section ref={statsRef} style={{ background: '#b43c1e', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { num: '5,000+', label: 'Pets Adopted', icon: '🐾' },
            { num: '1,200+', label: 'Happy Families', icon: '🏠' },
            { num: '50+', label: 'Cities Covered', icon: '🗺️' },
            { num: '98%', label: 'Satisfaction Rate', icon: '⭐' },
          ].map(({ num, label, icon }, i) => (
            <div key={label} style={{ ...visStyle(statsVisible, `${i * 0.1}s`) }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section ref={storiesRef} style={{ padding: '88px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,44px)', textAlign: 'center', marginBottom: 48, ...visStyle(storiesVisible) }}>
            Success Stories
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
            <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: 480, ...visStyle(storiesVisible, '0.1s') }}>
              <img src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&q=80" alt="Story" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 50%, transparent)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 32 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '.1em', marginBottom: 10, textTransform: 'uppercase' }}>The Rahman Family · Chittagong</p>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#fff', lineHeight: 1.5 }}>
                  "Buddy found his tribe, and we found our missing piece. The process was seamless and truly heartwarming."
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', flex: 1, position: 'relative', ...visStyle(storiesVisible, '0.2s') }}>
                <img src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&q=80" alt="Story 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,15,10,0.55)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 6 }}>Karim & Ginger · Dhaka</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: '#fff', fontStyle: 'italic' }}>"Pure companionship at its finest."</p>
                </div>
              </div>
              <div style={{ borderRadius: 24, background: '#b43c1e', padding: 28, flex: 1, ...visStyle(storiesVisible, '0.3s') }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, color: 'rgba(255,255,255,0.25)', lineHeight: 1, marginBottom: 12 }}>"</div>
                <p style={{ fontSize: 15, color: '#fff', lineHeight: 1.7, marginBottom: 20 }}>
                  "The team at PawsHome truly cares about where their animals go. We felt supported every step of the way."
                </p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Nadia & Duke · Sylhet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PET CARE GUIDE ── */}
      <section ref={careRef} style={{ background: 'var(--surface)', padding: '88px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, flexWrap: 'wrap', gap: 16, ...visStyle(careVisible) }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,40px)' }}>Pet Care Guide</h2>
            <Link to="/pet-care" style={{
              padding: '12px 24px', borderRadius: 50, background: '#1a1008', color: '#fff',
              fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#b43c1e'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1008'}
            >Browse All Guides</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
            {[
              { icon: '🍽️', title: 'Nutrition 101', text: 'Learn the best diets for different breeds and life stages to keep your pet healthy and energetic.', delay: '0s' },
              { icon: '🎾', title: 'Activity & Play', text: 'Keep your furry friend mentally stimulated and physically fit with our creative play ideas.', delay: '0.1s' },
              { icon: '🏥', title: 'Wellness Visits', text: 'A guide to essential vaccinations, check-ups, and preventative care for your new companion.', delay: '0.2s' },
            ].map(card => (
              <div key={card.title} style={{
                background: 'var(--surface2)', borderRadius: 20, padding: 28,
                border: '1px solid var(--border)', transition: 'all 0.25s',
                ...visStyle(careVisible, card.delay),
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(180,60,30,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>{card.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 20 }}>{card.text}</p>
                <Link to="/pet-care" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: '#b43c1e', textDecoration: 'none' }}>Read more →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section ref={adoptRef} style={{ padding: '88px 48px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,40px)', textAlign: 'center', marginBottom: 12, ...visStyle(adoptVisible) }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 15, marginBottom: 56, ...visStyle(adoptVisible, '0.1s') }}>Your journey to pet parenthood in 4 simple steps</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse Pets', text: 'Explore hundreds of adorable pets available for adoption in your area.' },
              { step: '02', icon: '❤️', title: 'Find Your Match', text: 'Filter by species, age, and location to find your perfect companion.' },
              { step: '03', icon: '📋', title: 'Submit Request', text: 'Fill out the adoption form with your pickup date and personal message.' },
              { step: '04', icon: '🏠', title: 'Welcome Home', text: 'Once approved, pick up your new best friend and start your journey!' },
            ].map(({ step, icon, title, text }, i) => (
              <div key={step} style={{ textAlign: 'center', ...visStyle(adoptVisible, `${i * 0.1}s`) }}>
                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(180,60,30,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto' }}>{icon}</div>
                  <div style={{ position: 'absolute', top: -8, right: 'calc(50% - 44px)', background: '#b43c1e', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>{step}</div>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER / CTA ── */}
      <section style={{ background: '#1a1008', padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px,4vw,48px)', color: '#f5f0ea', marginBottom: 16 }}>Ready to change a life?</h2>
        <p style={{ color: '#a89078', fontSize: 16, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Your perfect companion is just a few clicks away. Join our community of pet parents today.
        </p>
        <button onClick={handleAdoptNow} style={{
          display: 'inline-block', padding: '16px 40px', borderRadius: 50,
          background: '#f0c040', color: '#1a1008', fontSize: 16, fontWeight: 800,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(240,192,64,0.3)', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(240,192,64,0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(240,192,64,0.3)'; }}
        >Adopt Now 🐾</button>
      </section>
    </div>
  );
};

export default HomePage;