import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPetById, updatePet } from '../../api/pets.api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';

const Label = ({ text, required }) => (
  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
    {text}{required && <span style={{ color: 'var(--primary)', marginLeft: 2 }}>*</span>}
  </label>
);

const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    getPetById(id)
      .then(r => setForm(r.data.pet))
      .catch(() => { toast.error('Pet not found'); navigate('/dashboard/my-listings'); })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.location || !form.adoptionFee) {
      toast.error('Please fill all required fields');
      return;
    }
    setSaving(true);
    try {
      await updatePet(id, { ...form, adoptionFee: Number(form.adoptionFee) });
      toast.success('Pet updated successfully! 🐾');
      navigate('/dashboard/my-listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) return <LoadingSpinner />;

  const textFields = [
    { k: 'name',        l: 'Pet Name',          t: 'text',   required: true  },
    { k: 'breed',       l: 'Breed',             t: 'text',   required: true  },
    { k: 'age',         l: 'Age',               t: 'text',   required: true  },
    { k: 'location',    l: 'Location',          t: 'text',   required: true  },
    { k: 'adoptionFee', l: 'Adoption Fee (৳)',  t: 'number', required: true  },
    { k: 'imageURL',    l: 'Image URL',         t: 'url',    required: false },
  ];

  return (
    <div className="page-enter" style={{ maxWidth: 720 }}>
      <div className="animate-fadeInUp" style={{ marginBottom: 28 }}>
        <h2 style={{ marginBottom: 4 }}>Edit Pet: {form.name}</h2>
        <p style={{ color: 'var(--text2)' }}>Update the listing information below</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="animate-fadeInUp delay-1" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 28, marginBottom: 20 }}>
          <h4 style={{ marginBottom: 16, color: 'var(--primary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}>📋 Basic Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {textFields.map(({ k, l, t, required }) => (
              <div key={k}>
                <Label text={l} required={required} />
                <input
                  type={t}
                  value={form[k] || ''}
                  onChange={e => set(k, e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            ))}

            <div>
              <Label text="Species" />
              <select value={form.species} onChange={e => set('species', e.target.value)} style={{ width: '100%' }}>
                {['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label text="Gender" />
              <select value={form.gender} onChange={e => set('gender', e.target.value)} style={{ width: '100%' }}>
                <option>Male</option><option>Female</option>
              </select>
            </div>

            <div>
              <Label text="Health Status" />
              <select value={form.healthStatus} onChange={e => set('healthStatus', e.target.value)} style={{ width: '100%' }}>
                {['Excellent', 'Good', 'Fair', 'Needs Care'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <Label text="Vaccination" />
              <select value={form.vaccinationStatus} onChange={e => set('vaccinationStatus', e.target.value)} style={{ width: '100%' }}>
                {['Up to date', 'Partial', 'Not vaccinated', 'N/A'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ gridColumn: '1/-1' }}>
              <Label text="Description" />
              <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={4} style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        <div className="animate-fadeInUp delay-2" style={{ display: 'flex', gap: 10 }}>
          <button
            type="submit" disabled={saving}
            className="btn-primary"
            style={{
              padding: '12px 32px', borderRadius: 10, fontWeight: 700, fontSize: 14,
              background: 'var(--primary)', color: '#fff', border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? .7 : 1,
            }}
          >{saving ? '⏳ Saving...' : '💾 Save Changes'}</button>
          <button
            type="button" onClick={() => navigate('/dashboard/my-listings')}
            style={{ padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 14, background: 'var(--surface2)', color: 'var(--text2)', border: '1px solid var(--border)', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f0e0d5'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--surface2)'}
          >Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditPetPage;