import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';

// Layouts
import AppShell from './components/layout/AppShell';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import TeamHealth from './pages/TeamHealth';
import Sentiment from './pages/Sentiment';
import Productivity from './pages/Productivity';
import Jelling from './pages/Jelling';
import Activities from './pages/Activities';
import Kudos from './pages/Kudos';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Comparison from './pages/Comparison';
import Sustainability from './pages/Sustainability';

export default function App() {
  const { user, token, isInitializing, loadUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      loadUser();
    }
  }, [token, loadUser]);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div>
          <p className="text-sm text-slate-500 font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/comparison" element={<Comparison />} />
        
        {/* Protected Routes */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/teams" element={user ? <Teams /> : <Navigate to="/login" />} />
          <Route path="/teams/:id" element={user ? <TeamDetail /> : <Navigate to="/login" />} />
          <Route path="/team-health" element={user ? <TeamHealth /> : <Navigate to="/login" />} />
          <Route path="/sentiment" element={user ? <Sentiment /> : <Navigate to="/login" />} />
          <Route path="/productivity" element={user ? <Productivity /> : <Navigate to="/login" />} />
          <Route path="/jelling" element={user ? <Jelling /> : <Navigate to="/login" />} />
          <Route path="/activities" element={user ? <Activities /> : <Navigate to="/login" />} />
          <Route path="/kudos" element={user ? <Kudos /> : <Navigate to="/login" />} />
          <Route path="/notifications" element={user ? <Notifications /> : <Navigate to="/login" />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/sustainability" element={user ? <Sustainability /> : <Navigate to="/login" />} />
          
          {/* Admin Route */}
          <Route 
            path="/admin" 
            element={user?.role === 'admin' ? <Admin /> : <Navigate to="/dashboard" />} 
          />
        </Route>
      </Routes>
    </>
  );
}
