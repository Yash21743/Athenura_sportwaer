import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', background: '#f9f9f9' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FF3B30' }}>404 - Page Not Found</h1>
      <p style={{ color: '#888', fontSize: '1rem' }}>This page does not exist</p>
      <button onClick={() => navigate('/')} style={{ marginTop: '16px', padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Go Home</button>
    </div>
  );
};

export default NotFound;
