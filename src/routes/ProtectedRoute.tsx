import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthProvider';

export const ProtectedRoute = () => {
    const auth = useAuth();

    if (!auth) {
        return <div>Loading...</div>;
    }

    const { session, loading } = auth;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    // <Outlet /> renders the child route (like /settings or /home)
    return <Outlet />;
};