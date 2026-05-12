import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card border border-border p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
            <Wallet size={32} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to manage your finances</p>
        </div>

        {error && <p className="text-destructive text-sm text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
