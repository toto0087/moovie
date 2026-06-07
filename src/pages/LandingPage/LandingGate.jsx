import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LandingPage } from './LandingPage';

export function LandingGate() {
  const { isAuthenticated, loading } = useAuth();

  // Wait for JWT rehydration before deciding where to redirect
  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <LandingPage />;
}
