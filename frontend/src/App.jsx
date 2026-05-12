import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { HeroSection } from './components/blocks/hero-section-1';

import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Analytics from './pages/Analytics';
import AIInsights from './pages/AIInsights';
import OCRScanner from './pages/OCRScanner';
import Reports from './pages/Reports';

import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Billing from './pages/Billing';
import Security from './pages/Security';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/expenses" element={<PrivateRoute><Expenses /></PrivateRoute>} />
      <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
      <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
      <Route path="/ai-insights" element={<PrivateRoute><AIInsights /></PrivateRoute>} />
      <Route path="/ocr-scanner" element={<PrivateRoute><OCRScanner /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
      <Route path="/security" element={<PrivateRoute><Security /></PrivateRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
