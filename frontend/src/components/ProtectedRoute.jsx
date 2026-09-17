import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();
  const user = auth?.user ?? null;

  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}
