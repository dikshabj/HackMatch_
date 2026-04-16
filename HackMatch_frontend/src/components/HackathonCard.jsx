import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Zap, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HackathonCard = ({ hackathon, index }) => {
  const {
    id, title, description, date, location, category, type, image,
    prizes, tags, duration
  } = hackathon;

  // Status calculation
  const getStatus = () => {
    const eventDate = new Date(date);
    const now = new Date();
    const diff = eventDate - now;

    if (diff < 0) return { label: 'Ended', color: 'bg-gray-500/20 text-gray-500 border-gray-500/30' };
    if (diff < 86400000 * 2) return { label: 'Starting Soon', color: 'bg-green-500/20 text-green-400 border-green-500/30 pulse' };
    return { label: 'Upcoming', color: 'bg-maroon/20 text-maroon border-maroon/30' };
  };

  const status = getStatus();
  const skillTags = tags ? tags.split(',').map(t => t.trim()) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col h-full glass-card border-white/5 bg-white/[0.02] overflow-hidden hover:border-maroon/30 transition-all duration-500"
    >
      {/* Banner Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
        <img
          src={image || `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className={`px-3 py-1 rounded-full border text-[10px] font-space font-bold uppercase tracking-widest backdrop-blur-md ${status.color}`}>
            {status.label}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-space font-bold text-white uppercase tracking-widest backdrop-blur-md">
            {category || 'Innovation'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-inter">
                <Calendar size={13} className="text-maroon" />
                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-inter">
                <MapPin size={13} className="text-maroon" />
                {location || 'Remote'}
            </div>
        </div>

        <h3 className="text-xl font-black uppercase tracking-tight mb-3 group-hover:text-maroon transition-colors line-clamp-1">
          {title}
        </h3>
        
        <p className="text-gray-500 text-xs font-inter leading-relaxed mb-6 line-clamp-2">
          {description}
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] font-space font-bold text-gray-600 uppercase tracking-widest">Prize Pool</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Trophy size={14} className="text-maroon" />
                    {prizes ? (prizes.length > 15 ? prizes.substring(0, 12) + '...' : prizes) : 'Goodies'}
                </span>
            </div>
            <div className="flex flex-col gap-1 text-right">
                <span className="text-[10px] font-space font-bold text-gray-600 uppercase tracking-widest">Duration</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 justify-end">
                    <Clock size={14} className="text-maroon" />
                    {duration || '48H'}
                </span>
            </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-7 h-7 rounded-full border border-black bg-maroon/20 flex items-center justify-center text-[10px] font-bold text-maroon overflow-hidden">
                <Users size={12} />
              </div>
            ))}
            <div className="w-7 h-7 rounded-full border border-black bg-[#111] flex items-center justify-center text-[8px] font-bold text-gray-500">
                +12
            </div>
          </div>

          <Link to={`/hackathons/${id}`}>
            <button className="flex items-center gap-2 text-[10px] font-space font-bold uppercase tracking-widest text-maroon group-hover:text-white transition-all">
              Details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>

      {/* Decorative pulse for starting soon */}
      {status.label === 'Starting Soon' && (
        <div className="absolute inset-0 border border-green-500/20 rounded-[inherit] -z-10 animate-ping opacity-20" />
      )}
    </motion.div>
  );
};

export default HackathonCard;
