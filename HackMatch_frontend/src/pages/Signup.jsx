import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration Successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration Failed! ' + (err.response?.data?.message || 'Please try again.'));
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-maroon/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-maroon/10 blur-[100px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10 border-maroon/20 bg-black/40 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maroon to-transparent" />
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black mb-2 uppercase tracking-tight">New <span className="text-maroon">Identity</span></h1>
            <p className="text-gray-500 text-xs font-space tracking-widest uppercase">Create your nexus account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Codename</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-maroon/50 focus:bg-maroon/5 transition-all font-inter text-sm"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@nexus.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-maroon/50 focus:bg-maroon/5 transition-all font-inter text-sm"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-maroon/50 focus:bg-maroon/5 transition-all font-inter text-sm"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-maroon rounded-xl font-space font-black text-white shadow-neon flex items-center justify-center gap-2 group hover:bg-maroon-dark transition-all duration-300 active:scale-95"
            >
              CREATE IDENTITY
              <UserPlus size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500 font-inter font-medium leading-relaxed">
            By creating an identity, you agree to our <span className="text-white">Neural Policy</span> and <span className="text-white">Encryption Protocols</span>.
          </p>

          <p className="mt-8 text-center text-xs text-gray-500 font-inter">
            Already verified? <Link to="/login" className="text-maroon hover:underline font-bold">Access Vault</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
