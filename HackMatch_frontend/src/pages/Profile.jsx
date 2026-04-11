import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { motion as FramerMotion } from 'framer-motion';
import { User, Save, Code, Globe, Link as LinkIcon, Plus, X, Edit3, Mail, Terminal, ExternalLink } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  // Store the WHOLE user object to avoid missing fields on PUT
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/me');
      setUserData(res.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Communication with secure server failed. Please re-login.');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !userData.skills.includes(skillInput.trim())) {
      setUserData({ ...userData, skills: [...userData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      // Use the id directly from the fetched object
      await api.put(`/users/${userData.id}`, userData);
      setSuccessMsg('Identity Matrix Updated Successfully.');
      await fetchProfile(); // Refresh data
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to save profile updates. Technical error in transmission.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="animate-pulse w-16 h-16 rounded-full bg-maroon/20 border border-maroon/40" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-maroon/10 border border-maroon/20 flex items-center justify-center mb-6">
            <X className="text-maroon" size={40} />
        </div>
        <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter text-white">Transmission Failed</h2>
        <p className="text-gray-500 font-inter mb-8 max-w-sm">{error || "User identity matrix could not be resolved."}</p>
        <button 
            onClick={() => navigate('/login')}
            className="px-10 py-3 bg-maroon text-white rounded-xl font-space font-bold text-xs uppercase tracking-widest shadow-neon"
        >
            RE-AUTHENTICATE
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-maroon/10 blur-[150px] rounded-full -z-10" />
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">
              {isEditing ? "Configure" : "Identity"} <span className="text-maroon">Matrix</span>
            </h1>
            <p className="text-gray-400 font-inter text-sm">
                {isEditing ? "Recalibrate your system parameters." : "Your operative status in the network."}
            </p>
          </div>
          
          {!isEditing && (
            <FramerMotion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl font-space font-bold text-xs text-white flex items-center gap-2 hover:bg-white/10 transition-all hover:border-maroon/50 shadow-neon"
            >
              <Edit3 size={14} className="text-maroon" /> EDIT PROFILE
            </FramerMotion.button>
          )}
        </div>

        <FramerMotion.div layout transition={{ duration: 0.4 }}>
          {successMsg && (
            <FramerMotion.div 
               initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
               className="mb-6 p-3 bg-green-900/30 border border-green-500/30 rounded-xl text-green-400 text-center text-xs font-space font-bold tracking-widest uppercase"
            >
              {successMsg}
            </FramerMotion.div>
          )}

          {!isEditing ? (
            /* VIEW MODE */
            <FramerMotion.div
              key="view"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-8 border-maroon/20"
            >
                <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-maroon to-black p-1 shadow-neon flex-shrink-0">
                    <div className="w-full h-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center">
                      <span className="text-4xl font-orbitron font-bold text-white uppercase">{userData.name?.charAt(0)}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{userData.name}</h2>
                    <div className="flex items-center gap-4 text-xs text-gray-500 font-inter mb-4">
                        <span className="flex items-center gap-1"><Mail size={12} className="text-maroon" /> {userData.email}</span>
                        <span className="flex items-center gap-1"><Terminal size={12} className="text-maroon" /> Rank 1</span>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-gray-400 text-sm italic font-inter">
                        "{userData.bio || "No transmission decoded."}"
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 pt-8 border-t border-white/5">
                    <div>
                        <h3 className="text-xs font-space font-bold uppercase tracking-widest text-maroon mb-4">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                             {userData.skills?.length > 0 ? userData.skills.map(s => (
                                <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-space uppercase">{s}</span>
                             )) : <span className="text-gray-600 text-xs italic">N/A</span>}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xs font-space font-bold uppercase tracking-widest text-maroon mb-4">Portals</h3>
                        <div className="flex gap-4">
                             {userData.githubLink && (
                                <a href={userData.githubLink} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-maroon/50 transition-all text-gray-400 hover:text-white">
                                    <GithubIcon size={18} />
                                </a>
                             )}
                             {userData.linkedinLink && (
                                <a href={userData.linkedinLink} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-maroon/50 transition-all text-gray-400 hover:text-white">
                                    <LinkedinIcon size={18} />
                                </a>
                             )}
                             {!userData.githubLink && !userData.linkedinLink && <span className="text-gray-600 text-xs italic">No links established.</span>}
                        </div>
                    </div>
                </div>
            </FramerMotion.div>
          ) : (
            /* EDIT MODE */
            <FramerMotion.div
              key="edit"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass-card p-8 border-maroon/20"
            >
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                        <input
                            type="text" value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-inter text-sm outline-none focus:border-maroon/50"
                        />
                    </div>
                    <div className="space-y-2 opacity-50">
                        <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">Email (Fixed)</label>
                        <input type="email" value={userData.email} readOnly className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white font-inter text-sm cursor-not-allowed" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">Bio</label>
                    <textarea
                        value={userData.bio} onChange={(e) => setUserData({...userData, bio: e.target.value})}
                        className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-inter text-sm outline-none focus:border-maroon/50 resize-none"
                    />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">Skills Matrix</label>
                    <div className="flex gap-2">
                        <input
                            type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                            placeholder="Add specialization..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-inter text-sm outline-none focus:border-maroon/50"
                        />
                        <button type="button" onClick={handleAddSkill} className="px-4 bg-maroon text-white rounded-xl shadow-neon"><Plus size={20} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {userData.skills.map(s => (
                            <div key={s} className="px-3 py-1 bg-maroon/10 border border-maroon/30 rounded-lg flex items-center gap-2">
                                <span className="text-[10px] font-space font-bold uppercase text-white">{s}</span>
                                <button type="button" onClick={() => handleRemoveSkill(s)} className="text-maroon"><X size={10} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">GitHub</label>
                        <input type="url" value={userData.githubLink} onChange={(e) => setUserData({...userData, githubLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-maroon/50" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-space font-bold uppercase tracking-widest text-gray-500">LinkedIn</label>
                        <input type="url" value={userData.linkedinLink} onChange={(e) => setUserData({...userData, linkedinLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-maroon/50" />
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-xs font-space font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                    <button type="submit" disabled={saving} className="px-10 py-3 bg-maroon text-white rounded-xl font-space font-bold text-xs uppercase tracking-widest shadow-neon flex items-center gap-2">
                        <Save size={16} /> {saving ? "Saving..." : "Initialize Save"}
                    </button>
                </div>
              </form>
            </FramerMotion.div>
          )}
        </FramerMotion.div>
      </div>
    </div>
  );
};

// Icons with stability for old lucide versions
const GithubIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);
const LinkedinIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default Profile;
