import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Users, Plus, Calendar, MapPin, ArrowRight, Zap, Search,
  Star, CheckCircle, Clock, Globe, Settings, LayoutDashboard, MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 border-white/5 bg-white/[0.03] backdrop-blur-xl hover:border-maroon/30 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-space font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <Icon size={18} className="text-maroon" />
    </div>
    <div className="text-3xl font-black text-white">{value}</div>
  </motion.div>
);

// ─── Volunteer Card ───────────────────────────────────────────────────────────
const VolunteerCard = ({ user, onInvite }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="glass-card p-5 border-white/5 bg-white/[0.02] hover:border-maroon/30 transition-all"
  >
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-maroon/20 flex items-center justify-center flex-shrink-0 text-xl font-black text-maroon">
        {user.name?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-white truncate">{user.name}</h4>
        <p className="text-[11px] text-gray-500 font-inter mb-2">{user.preferredRole || 'Developer'} · {user.experienceLevel || 'Intermediate'}</p>
        {user.skills?.slice(0, 3).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {user.skills.slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 font-space">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
    <button
      onClick={() => onInvite(user)}
      className="mt-4 w-full py-2 rounded-xl border border-maroon/30 text-maroon text-[11px] font-space font-bold uppercase tracking-widest hover:bg-maroon hover:text-white transition-all"
    >
      Invite as Volunteer
    </button>
  </motion.div>
);

// ─── Hackathon Mini Card ──────────────────────────────────────────────────────
const HackathonMiniCard = ({ h }) => {
  const getStatus = () => {
    const now = new Date();
    const date = new Date(h.date);
    if (date > now) return { label: 'Upcoming', color: 'text-blue-400 bg-blue-900/20 border-blue-800/40' };
    return { label: 'Past', color: 'text-gray-400 bg-white/5 border-white/10' };
  };
  const status = getStatus();
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="glass-card p-5 border-white/5 bg-white/[0.02] hover:border-maroon/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-sm text-white leading-tight flex-1 pr-2">{h.title}</h4>
        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-space font-bold uppercase flex-shrink-0 ${status.color}`}>
          {status.label}
        </span>
      </div>
      <div className="space-y-1">
        {h.date && (
          <p className="flex items-center gap-2 text-[11px] text-gray-500 font-inter">
            <Calendar size={11} className="text-maroon" />
            {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
        {h.location && (
          <p className="flex items-center gap-2 text-[11px] text-gray-500 font-inter">
            <MapPin size={11} className="text-maroon" />
            {h.location}
          </p>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main OrganizerDashboard ──────────────────────────────────────────────────
const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [myHackathons, setMyHackathons] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview | hackathons | volunteers
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [invitedIds, setInvitedIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [meRes, hackRes, usersRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/hackathons'),
        api.get('/users'),
      ]);
      setUser(meRes.data);
      // Filter to organizer's own hackathons
      const mine = hackRes.data.filter(
        (h) => h.organizer?.email === meRes.data.email
      );
      setMyHackathons(mine);
      // Only students as potential volunteers
      const studentVolunteers = usersRes.data.filter(
        (u) => u.roles?.some((r) => r.name === 'ROLE_STUDENT')
      );
      setVolunteers(studentVolunteers);
    } catch (err) {
      console.error('Failed to load organizer data', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (volunteer) => {
    try {
      await api.post('/requests/send', { recipientId: volunteer.id });
      setInvitedIds((prev) => [...prev, volunteer.id]);
    } catch (err) {
      console.error('Invite failed', err);
    }
  };

  const filteredVolunteers = volunteers.filter((v) =>
    volunteerSearch
      ? v.name?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
        [...(v.skills || [])].some((s) => s.toLowerCase().includes(volunteerSearch.toLowerCase()))
      : true
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-maroon/20 border border-maroon/40" />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hackathons', label: 'My Hackathons', icon: Trophy },
    { id: 'volunteers', label: 'Find Volunteers', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      {/* BG decor */}
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-maroon/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 -left-1/4 w-96 h-96 bg-maroon/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 rounded-full bg-maroon/20 border border-maroon/30 text-[10px] font-space font-bold text-maroon uppercase tracking-widest flex items-center gap-1.5">
                <Trophy size={10} /> Organizer
              </div>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
              Organizer <span className="text-maroon">Command Center</span>
            </h1>
            <p className="text-gray-400 font-inter text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Welcome, {user?.name || 'Organizer'} — System Operational
            </p>
          </motion.div>
        </header>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard label="My Hackathons" value={myHackathons.length} icon={Trophy} delay={0} />
          <StatCard label="Available Volunteers" value={volunteers.length} icon={Users} delay={0.1} />
          <StatCard label="Invites Sent" value={invitedIds.length} icon={CheckCircle} delay={0.2} />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-8 p-1.5 glass-card border-white/5 bg-white/[0.02] rounded-2xl w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-space font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id
                    ? 'bg-maroon text-white shadow-neon'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Create Hackathon CTA */}
              <Link to="/hackathons/create">
                <motion.div
                  whileHover={{ y: -5, borderColor: 'rgba(128,0,0,0.5)' }}
                  className="glass-card p-8 border-white/5 bg-white/[0.02] flex flex-col h-full group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-maroon text-white flex items-center justify-center mb-6 shadow-neon">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Create Hackathon</h3>
                  <p className="text-gray-500 text-sm font-inter leading-relaxed mb-6 flex-1">
                    Publish a new hackathon event and start accepting teams.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-space font-bold uppercase tracking-widest text-maroon group-hover:text-white transition-colors">
                    Start Now <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>

              {/* Find Volunteers */}
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(128,0,0,0.5)' }}
                onClick={() => setActiveTab('volunteers')}
                className="glass-card p-8 border-white/5 bg-white/[0.02] flex flex-col h-full group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 text-maroon group-hover:bg-maroon group-hover:text-white flex items-center justify-center mb-6 transition-all">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Find Volunteers</h3>
                <p className="text-gray-500 text-sm font-inter leading-relaxed mb-6 flex-1">
                  Browse skilled participants and invite them to help organize your event.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-space font-bold uppercase tracking-widest text-maroon group-hover:text-white transition-colors">
                  Browse Talent <ArrowRight size={14} />
                </div>
              </motion.div>

              {/* My Hackathons */}
              <motion.div
                whileHover={{ y: -5, borderColor: 'rgba(128,0,0,0.5)' }}
                onClick={() => setActiveTab('hackathons')}
                className="glass-card p-8 border-white/5 bg-white/[0.02] flex flex-col h-full group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 text-maroon group-hover:bg-maroon group-hover:text-white flex items-center justify-center mb-6 transition-all">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">My Hackathons</h3>
                <p className="text-gray-500 text-sm font-inter leading-relaxed mb-6 flex-1">
                  Manage and track all hackathons you've organized.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-space font-bold uppercase tracking-widest text-maroon group-hover:text-white transition-colors">
                  Manage Events <ArrowRight size={14} />
                </div>
              </motion.div>

              {/* Promo banner */}
              <div className="md:col-span-2 lg:col-span-3 glass-card p-8 border-maroon/20 bg-gradient-to-br from-maroon/5 to-transparent relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Zap size={40} className="text-maroon opacity-20" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
                      Reach the Right <span className="text-maroon">Talent</span>
                    </h2>
                    <p className="text-gray-400 font-inter text-sm max-w-xl">
                      Our AI matching engine connects your hackathon with the best participants. Post your event and let the talent come to you.
                    </p>
                  </div>
                  <Link to="/hackathons/create">
                    <button className="px-8 py-4 bg-maroon rounded-xl font-space font-bold text-xs text-white shadow-neon flex items-center gap-3 hover:bg-maroon-dark transition-all">
                      POST HACKATHON
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── HACKATHONS TAB ── */}
          {activeTab === 'hackathons' && (
            <motion.div
              key="hackathons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  My <span className="text-maroon">Hackathons</span>
                </h2>
                <Link to="/hackathons/create">
                  <button className="px-5 py-2.5 bg-maroon rounded-xl font-space font-bold text-[11px] text-white shadow-neon flex items-center gap-2 hover:bg-maroon-dark transition-all">
                    <Plus size={14} /> New Hackathon
                  </button>
                </Link>
              </div>

              {myHackathons.length === 0 ? (
                <div className="glass-card p-16 border-white/5 text-center">
                  <Trophy size={40} className="text-maroon/40 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">No Hackathons Yet</h3>
                  <p className="text-gray-500 text-sm font-inter mb-6">Create your first hackathon and start building communities.</p>
                  <Link to="/hackathons/create">
                    <button className="px-6 py-3 bg-maroon rounded-xl font-space font-bold text-xs text-white shadow-neon hover:bg-maroon-dark transition-all">
                      CREATE FIRST HACKATHON
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myHackathons.map((h) => (
                    <HackathonMiniCard key={h.id} h={h} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── VOLUNTEERS TAB ── */}
          {activeTab === 'volunteers' && (
            <motion.div
              key="volunteers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  Find <span className="text-maroon">Volunteers</span>
                </h2>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or skill..."
                    value={volunteerSearch}
                    onChange={(e) => setVolunteerSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-maroon/50 font-inter text-sm"
                  />
                </div>
              </div>

              {filteredVolunteers.length === 0 ? (
                <div className="glass-card p-16 border-white/5 text-center">
                  <Users size={40} className="text-maroon/40 mx-auto mb-4" />
                  <p className="text-gray-500 font-inter">No volunteers found for your search.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVolunteers.map((v) =>
                    invitedIds.includes(v.id) ? (
                      <motion.div
                        key={v.id}
                        className="glass-card p-5 border-green-800/30 bg-green-900/10 flex items-center gap-4"
                      >
                        <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-sm text-white">{v.name}</p>
                          <p className="text-[11px] text-green-400 font-space uppercase tracking-widest">Invite Sent</p>
                        </div>
                      </motion.div>
                    ) : (
                      <VolunteerCard key={v.id} user={v} onInvite={handleInvite} />
                    )
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
