import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trophy, User, LogOut, LayoutDashboard, Menu, X, Bell } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Teammates', path: '/search', icon: Search },
    { name: 'Hackathons', path: '/hackathons', icon: Trophy },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="w-full px-4">
        <div className={`relative flex items-center justify-between px-6 h-14 rounded-xl border transition-all duration-500 ${
          scrolled 
            ? 'background-blur-xl bg-black/60 border-maroon/30 shadow-[0_0_30px_rgba(128,0,0,0.15)]' 
            : 'bg-transparent border-transparent'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center shadow-neon relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
              <span className="text-white font-orbitron font-black text-xl relative">H</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-white font-orbitron font-extrabold text-xl tracking-tighter leading-none">
                HACK<span className="text-maroon">MATCH</span>
              </span>
              <span className="text-[10px] text-maroon font-orbitron tracking-[0.2em] font-bold uppercase mt-1">
                Alliance
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 group overflow-hidden rounded-lg`}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <link.icon size={16} className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-maroon group-hover:text-white'}`} />
                    <span className={`font-orbitron text-xs uppercase tracking-widest transition-colors duration-300 ${
                      isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-white'
                    }`}>
                      {link.name}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-maroon shadow-neon rounded-lg -z-0"
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-maroon w-0 group-hover:w-full transition-all duration-300"
                  />
                </Link>
              );
            })}

            <div className="w-[1px] h-6 bg-white/10 mx-4" />

            <Link
              to="/profile"
              className={`p-2 rounded-full border border-maroon/20 hover:border-maroon/60 transition-all duration-300 group ${
                location.pathname === '/profile' ? 'bg-maroon/20' : 'bg-transparent'
              }`}
            >
              <User size={18} className="text-maroon group-hover:text-white transition-colors" />
            </Link>

            <button className="relative p-2 rounded-full border border-maroon/20 hover:border-maroon/60 transition-all duration-300 group ml-2">
              <Bell size={18} className="text-maroon group-hover:text-white transition-colors" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-maroon rounded-full border border-black" />
            </button>

            <button 
              onClick={handleLogout}
              className="ml-4 p-2 text-gray-500 hover:text-maroon transition-all duration-300 hover:rotate-12"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 p-6 rounded-2xl bg-black/95 border border-maroon/30 backdrop-blur-2xl md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 text-white font-orbitron text-sm uppercase tracking-widest"
              >
                <link.icon className="text-maroon" />
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
