import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Trophy, Users, Link2, 
  ArrowLeft, Zap, Shield, Globe, Info, MessageCircle, AlertCircle
} from 'lucide-react';
import api from '../services/api';

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHackathonDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchHackathonDetails = async () => {
    try {
      const res = await api.get(`/hackathons/${id}`);
      setHackathon(res.data);
    } catch (err) {
      console.error("Failed to load event details", err);
      setError("The event signal could not be retrieved from the mainframe.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-t-2 border-maroon animate-spin mb-4" />
        <p className="text-gray-500 font-space text-[10px] uppercase tracking-widest animate-pulse">Scanning Event Memory...</p>
      </div>
    );
  }

  if (error || !hackathon) {
    return (
      <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center">
        <AlertCircle size={48} className="text-maroon/40 mb-6" />
        <h2 className="text-2xl font-black uppercase mb-4">Event Signal Lost</h2>
        <p className="text-gray-500 max-w-sm mb-8">{error || "This hackathon has been archived or deleted."}</p>
        <button onClick={() => navigate('/hackathons')} className="px-8 py-3 bg-maroon text-white rounded-xl font-space font-bold text-xs">
          RETURN TO HUB
        </button>
      </div>
    );
  }

  const tags = hackathon.tags ? hackathon.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-maroon/5 to-transparent -z-10" />
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-maroon/10 blur-[120px] rounded-full -z-10 text-maroon" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link to="/hackathons" className="inline-flex items-center gap-2 text-gray-500 hover:text-maroon transition-colors mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-space font-bold uppercase tracking-[0.2em]">Return to Events</span>
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-10">
            {/* Main Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-maroon/20 border border-maroon/30 text-maroon text-[10px] font-space font-bold uppercase tracking-widest">
                  {hackathon.category || 'HACKATHON'}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-space font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Globe size={11} /> {hackathon.type || 'Online'}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                {hackathon.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-8 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Calendar size={18} className="text-maroon" />
                  </div>
                  <div>
                    <p className="text-[9px] font-space font-bold text-gray-500 uppercase tracking-widest">Date</p>
                    <p className="text-sm font-bold text-white">
                      {new Date(hackathon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Clock size={18} className="text-maroon" />
                  </div>
                  <div>
                    <p className="text-[9px] font-space font-bold text-gray-500 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-white">{hackathon.duration || '48 Hours'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <MapPin size={18} className="text-maroon" />
                  </div>
                  <div>
                    <p className="text-[9px] font-space font-bold text-gray-500 uppercase tracking-widest">Venue</p>
                    <p className="text-sm font-bold text-white">{hackathon.location || 'Remote'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={hackathon.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop"} 
                alt={hackathon.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
            </div>

            {/* Content Tabs / Description */}
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Info size={20} className="text-maroon" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Project <span className="text-maroon">Brief</span></h2>
                </div>
                <p className="text-gray-400 font-inter leading-relaxed whitespace-pre-wrap">
                  {hackathon.description}
                </p>
              </section>

              {hackathon.prizes && (
                <section className="glass-card p-8 border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent">
                  <div className="flex items-center gap-3 mb-6">
                    <Trophy size={20} className="text-maroon" />
                    <h2 className="text-xl font-black uppercase tracking-tight">Reward <span className="text-maroon">Pool</span></h2>
                  </div>
                  <p className="text-white/80 font-inter leading-relaxed whitespace-pre-wrap">
                    {hackathon.prizes}
                  </p>
                </section>
              )}

              {hackathon.rules && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Shield size={20} className="text-maroon" />
                    <h2 className="text-xl font-black uppercase tracking-tight">Submission <span className="text-maroon">Rules</span></h2>
                  </div>
                  <p className="text-gray-400 font-inter leading-relaxed whitespace-pre-wrap">
                    {hackathon.rules}
                  </p>
                </section>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-32 space-y-6">
            <div className="glass-card p-6 border-white/10 bg-white/[0.03] backdrop-blur-xl">
              <h3 className="text-sm font-space font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                < Zap size={14} className="text-maroon" /> Take Action
              </h3>
              
              <a 
                href={hackathon.registrationLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full mb-4 py-4 bg-maroon hover:bg-maroon-dark text-white rounded-xl font-space font-bold text-xs uppercase tracking-[0.2em] shadow-neon transition-all flex items-center justify-center gap-2 group"
              >
                APPLY NOW
                <Link2 size={16} className="group-hover:rotate-12 transition-transform" />
              </a>
              
              <button 
                onClick={() => navigate('/search')}
                className="w-full py-4 border border-white/5 bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl font-space font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                FIND TEAMMATES
                <Users size={16} />
              </button>
              
              <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-space font-bold text-gray-500 uppercase">Organized by</span>
                  <span className="text-xs font-bold text-white">{hackathon.organizer?.name || "System Base"}</span>
                </div>
                {hackathon.website && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-space font-bold text-gray-500 uppercase">Official Hub</span>
                    <a href={hackathon.website} className="text-xs font-bold text-maroon hover:underline">Visit Site</a>
                  </div>
                )}
              </div>
            </div>

            {/* Tags Card */}
            {tags.length > 0 && (
              <div className="glass-card p-6 border-white/10 bg-white/[0.03]">
                <h3 className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                  Target Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-space text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Support CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20">
              <MessageCircle size={24} className="text-blue-500 mb-4" />
              <h4 className="font-bold text-white mb-2">Need Support?</h4>
              <p className="text-xs text-gray-500 font-inter mb-4">Contact the organizers directly if you have technical queries.</p>
              <p className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{hackathon.contact || "support@hackmatch.io"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
