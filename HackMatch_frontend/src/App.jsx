import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CreateHackathon from './pages/CreateHackathon';
import Hackathons from './pages/Hackathons';
import HackathonDetails from './pages/HackathonDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 rounded-full border-t-2 border-maroon animate-spin"></div>
      </div>
    );
  }

  return (
    <SocketProvider userId={user?.id}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-maroon/30">
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            } />
            <Route path="/messages" element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            <Route path="/organizer/dashboard" element={
              <ProtectedRoute requiredRole="ROLE_ORGANIZER">
                <OrganizerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/hackathons/create" element={
              <ProtectedRoute requiredRole="ROLE_ORGANIZER">
                <CreateHackathon />
              </ProtectedRoute>
            } />

            <Route path="/hackathons/:id" element={
              <ProtectedRoute>
                <HackathonDetails />
              </ProtectedRoute>
            } />

            <Route path="/hackathons" element={
              <ProtectedRoute>
                <Hackathons />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </SocketProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
