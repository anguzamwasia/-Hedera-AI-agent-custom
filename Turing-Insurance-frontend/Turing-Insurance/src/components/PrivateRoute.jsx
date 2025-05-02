// src/routes/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ✅ Use the hook

const PrivateRoute = ({ children }) => {
  const { currentUser, loading } = useAuth(); // ✅ Use useAuth instead of useContext(AuthContext)
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  return currentUser ? (
    children ? children : <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
};

export default PrivateRoute;
