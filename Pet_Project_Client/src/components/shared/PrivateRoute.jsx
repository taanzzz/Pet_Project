import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// ✅ PrivateRoute — কোনো change নেই!
// useAuth() এখনও { user, loading } return করে
// BetterAuth এর useSession() internally handle করছে AuthContext এ
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default PrivateRoute;