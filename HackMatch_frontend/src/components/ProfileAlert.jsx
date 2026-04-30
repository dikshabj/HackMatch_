import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileAlert = ({ isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0a0a0a] border border-maroon/30 rounded-3xl overflow-hidden glass-card shadow-2xl z-10"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maroon to-transparent" />
            
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-maroon/10 border border-maroon/20 flex items-center justify-center mb-6 shadow-neon">
                <AlertCircle className="text-maroon" size={32} />
              </div>
              
              <h2 className="text-2xl font-black mb-3 uppercase tracking-tight">Identity <span className="text-maroon">Incomplete</span></h2>
              
              <p className="text-gray-400 font-inter text-sm leading-relaxed mb-8">
                Operative, your hacker profile is missing crucial specifications (like your skills). To find the optimal squad and unlock AI matchmaking, you must complete your identity setup.
              </p>
              
              <Link to="/profile">
                <button className="w-full py-4 bg-maroon hover:bg-maroon-dark transition-all rounded-xl font-space font-bold text-white shadow-neon flex items-center justify-center gap-3 group">
                  <UserCheck size={18} />
                  CONFIGURE IDENTITY
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileAlert;
