const PetCarePage = () => {
  const tips = [
    { icon: '🍖', title: 'Balanced Nutrition', text: 'Feed your pet a vet-approved diet appropriate for their species, age, and health. Fresh water should always be available.' },
    { icon: '🏃', title: 'Regular Exercise', text: 'Dogs need daily walks and playtime. Cats benefit from interactive toys. Exercise prevents obesity and behavioral issues.' },
    { icon: '💉', title: 'Vaccination Schedule', text: 'Keep vaccinations up to date to protect against preventable diseases. Schedule annual vet check-ups regularly.' },
    { icon: '🛁', title: 'Grooming', text: 'Regular brushing, nail trimming, and bathing keep your pet healthy and comfortable. Long-haired breeds need more frequent grooming.' },
    { icon: '🦷', title: 'Dental Care', text: "Brush your pet's teeth regularly or provide dental chews. Dental disease affects over 80% of pets by age 3." },
    { icon: '❤️', title: 'Mental Stimulation', text: 'Provide toys, puzzles, and social interaction. A mentally stimulated pet is a happy, well-behaved pet.' },
    { icon: '🏥', title: 'Regular Vet Visits', text: "Don't wait until your pet is sick. Preventive care catches issues early and saves money in the long run." },
    { icon: '🆔', title: 'Microchip & ID Tags', text: 'Microchip your pet and keep ID tags updated. This dramatically increases reunion chances if they get lost.' },
  ];
  return (
    <div style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', marginBottom: 12 }}>Pet Care Tips</h2>
        <p style={{ color: 'var(--text2)' }}>Expert advice to help your new companion thrive in their forever home</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
        {tips.map(t => (
          <div key={t.title} style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)', padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
            <h4 style={{ marginBottom: 8, fontSize: 16 }}>{t.title}</h4>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{t.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetCarePage;
