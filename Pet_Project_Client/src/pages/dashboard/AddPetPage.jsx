import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPet } from '../../api/pets.api';
import toast from 'react-hot-toast';

const INITIAL = {
  name: '', species: 'Dog', breed: '', age: '', gender: 'Male',
  imageURL: '', healthStatus: 'Good', vaccinationStatus: 'Up to date',
  location: '', adoptionFee: '', description: '',
};

/* Shared field label */
const Label = ({ text, required }) => (
  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
    {text}{required && <span style={{ color: 'var(--primary)', marginLeft: 2 }}>*</span>}
  </label>
);

const AddPetPage = () => {
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  /* Live image preview */
  const handleImageChange = (v) => {
    set('imageURL', v);
    if (v.startsWith('http')) setPreview(v);
    else setPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.location || !form.adoptionFee || !form.description) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await createPet({ ...form, adoptionFee: Number(form.adoptionFee) });
      toast.success('Pet listing created! 🐾');
      navigate('/dashboard/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ maxWidth: 720 }}>
      <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Add New Pet</h2>
        <p style={{ color: 'var(--text2)' }}>List a pet for adoption to help them find a loving home</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="animate-fadeInUp delay-1" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 28, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16, color: 'var(--primary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>📋 Basic Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <div>
              <Label text="Pet Name" required />
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Buddy" style={{ width: '100%' }} />
            </div>

            <div>
              <Label text="Species" required />
              <select value={form.species} onChange={e => set('species', e.target.value)} style={{ width: '100%' }}>
                {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label text="Breed" required />
              <input value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="e.g. Golden Retriever" style={{ width: '100%' }} />
            </div>

            <div>
              <Label text="Age" required />
              <input value={form.age} onChange={e => set('age', e.target.value)} placeholder="e.g. 2 years" style={{ width: '100%' }} />
            </div>

            <div>
              <Label text="Gender" />
              <select value={form.gender} onChange={e => set('gender', e.target.value)} style={{ width: '100%' }}>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <Label text="Location" required />
              <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Chittagong" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp delay-2" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 28, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16, color: 'var(--primary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>🏥 Health & Details</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            <div>
              <Label text="Health Status" />
              <select value={form.healthStatus} onChange={e => set('healthStatus', e.target.value)} style={{ width: '100%' }}>
                {['Excellent', 'Good', 'Fair', 'Needs Care'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label text="Vaccination Status" />
              <select value={form.vaccinationStatus} onChange={e => set('vaccinationStatus', e.target.value)} style={{ width: '100%' }}>
                {['Up to date', 'Partial', 'Not vaccinated', 'N/A'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label text="Adoption Fee (৳)" required />
              <input type="number" min="0" value={form.adoptionFee} onChange={e => set('adoptionFee', e.target.value)} placeholder="e.g. 2500" style={{ width: '100%' }} />
            </div>

            <div>
              <Label text="Owner Email" />
              <input value={user?.email || ''} readOnly style={{ width: '100%', background: 'var(--surface2)', color: 'var(--text3)' }} />
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp delay-3" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 28, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16, color: 'var(--primary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>🖼 Photo & Description</h4>
          <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: 16 }}>
            <div>
              <Label text="Image URL (imgbb or direct)" />
              <input value={form.imageURL} onChange={e => handleImageChange(e.target.value)} placeholder="https://..." style={{ width: '100%' }} />
              {!preview && (
                <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Upload to imgbb.com first, then paste the link here</p>
              )}
            </div>
            {preview && (
              <div style={{ borderRadius: 10, overflow: 'hidden', height: 140, background: 'var(--surface2)' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setPreview('')}
                />
              </div>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <Label text="Description" required />
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the pet's personality, habits, and any special needs..."
              rows={4} style={{ width: '100%' }}
            />
          </div>
        </div>

        <div className="animate-fadeInUp delay-4" style={{ display: 'flex', gap: 10 }}>
          <button
            type="submit" disabled={loading}
            className="btn-primary"
            style={{
              padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: 'var(--primary)', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .7 : 1, transition: 'all 0.2s',
            }}
          >{loading ? '⏳ Adding...' : '🐾 Add Pet Listing'}</button>
          <button
            type="button" onClick={() => navigate('/dashboard')}
            style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0e0d5'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}
          >Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddPetPage;