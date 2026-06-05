const LoadingSpinner = ({ fullPage = true, message = 'Loading...' }) => {
  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: 'var(--text3)', fontSize: 14, fontWeight: 500 }}>{message}</p>
      </div>
    );
  }
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      border: '3px solid var(--border)',
      borderTopColor: 'var(--primary)',
      animation: 'spin 0.8s linear infinite',
      display: 'inline-block',
    }} />
  );
};

export default LoadingSpinner;