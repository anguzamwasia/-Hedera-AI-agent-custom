import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Page Components
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClaimForm from './pages/ClaimForm';
import ClaimDetails from './pages/ClaimDetails';
import TrackClaim from './pages/TrackClaim';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';

// Layout Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/claim-form" element={<ClaimForm />} />
          <Route path="/claim/:claimId" element={<ClaimDetails />} />
          <Route path="/track-claim" element={<TrackClaim />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
