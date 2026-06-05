import { useEffect, useState } from 'react';
import PetCard from '../components/pets/PetCard';
import { getAllPets } from '../api/pets.api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const SPECIES = ['All', 'Dog', 'Cat', 'Bird', 'Rabbit', 'Other'];

const AllPetsPage = () => {
  const [pets, setPets]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [species, setSpecies] = useState('All');
  const [sort, setSort]       = useState('');

  const fetchPets = () => {
    setLoading(true);
    const params = {};
    if (search)           params.search  = search;
    if (species !== 'All') params.species = species;
    if (sort)             params.sort    = sort;
    getAllPets(params)
      .then(res => setPets(res.data.pets))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPets(); }, [species, sort]);          // re-fetch on filter change
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPets();
  };

  return (
    <div className="page-enter" style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Header */}
      <div className="animate-fadeInUp" style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 12 }}>All Available Pets</h2>
        <p style={{ color: 'var(--text2)' }}>Find your perfect companion from our wide selection of loving pets</p>
      </div>

      {/* Search & Sort bar */}
      <form
        onSubmit={handleSearch}
        className="animate-fadeInUp delay-1"
        style={{
          background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)',
          padding: '18px 20px', marginBottom: 20,
          display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
        }}
      >
        <input
          placeholder="🔍  Search by name or breed..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ maxWidth: 200 }}
        >
          <option value="">Sort by…</option>
          <option value="fee-asc">Fee: Low → High</option>
          <option value="fee-desc">Fee: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
        <button
          type="submit"
          className="btn-primary"
          style={{
            padding: '10px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14,
            background: 'var(--primary)', color: '#fff', border: 'none', cursor: 'pointer',
          }}
        >Search</button>
      </form>

      {/* Species filter chips */}
      <div className="animate-fadeInUp delay-2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {SPECIES.map(s => (
          <button
            key={s}
            onClick={() => setSpecies(s)}
            style={{
              padding: '7px 18px', borderRadius: 20,
              border: `1.5px solid ${species === s ? 'var(--primary)' : 'var(--border)'}`,
              background: species === s ? 'var(--primary-light)' : 'var(--surface)',
              color: species === s ? 'var(--primary)' : 'var(--text2)',
              fontSize: 13, fontWeight: species === s ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.2s ease',
            }}
          >
            {s === 'All' ? '🐾 All' : s === 'Dog' ? '🐕 Dogs' : s === 'Cat' ? '🐈 Cats' : s === 'Bird' ? '🦜 Birds' : s === 'Rabbit' ? '🐰 Rabbits' : s}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && pets.length > 0 && (
        <p className="animate-fadeIn" style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
          Showing <strong style={{ color: 'var(--text)' }}>{pets.length}</strong> {pets.length === 1 ? 'pet' : 'pets'}
          {species !== 'All' ? ` · ${species}` : ''}
          {search ? ` matching "${search}"` : ''}
        </p>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : pets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text3)' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
          <h3 style={{ fontSize: 20, color: 'var(--text2)', marginBottom: 8 }}>No pets found</h3>
          <p>Try adjusting your search or filters</p>
          {(search || species !== 'All') && (
            <button
              onClick={() => { setSearch(''); setSpecies('All'); }}
              style={{ marginTop: 16, padding: '9px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
            >Clear Filters</button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
          {pets.map((pet, i) => <PetCard key={pet._id} pet={pet} index={i} />)}
        </div>
      )}
    </div>
  );
};

export default AllPetsPage;