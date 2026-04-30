import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trophy, Zap, SortAsc, LayoutGrid, List as ListIcon, Calendar, Info } from 'lucide-react';
import api from '../services/api';
import HackathonCard from '../components/HackathonCard';

const CATEGORIES = ['All', 'AI/ML', 'Web3', 'FinTech', 'HealthTech', 'Open Innovation', 'Sustainability', 'Gaming', 'Cybersecurity'];

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid'); // grid | list
    const [statusFilter, setStatusFilter] = useState('Upcoming'); // Upcoming | Ongoing | Ended

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const res = await api.get('/hackathons');
            setHackathons(res.data);
        } catch (err) {
            console.error("Failed to load events", err);
            setError("The neural network failed to synchronize event data.");
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = hackathons.filter(h => {
        const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              h.tags?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
        
        // Basic status logic for filtering
        const eventDate = new Date(h.date);
        const now = new Date();
        const diff = eventDate - now;

        if (statusFilter === 'Upcoming') return matchesSearch && matchesCategory && diff >= 0;
        if (statusFilter === 'Ended') return matchesSearch && matchesCategory && diff < 0;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-40 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-full border-t-2 border-maroon animate-spin" />
                    <p className="text-gray-500 font-space text-[10px] uppercase tracking-[0.3em] animate-pulse">Synchronizing Events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-maroon/5 blur-[150px] rounded-full -z-10" />
            
            <div className="max-w-7xl mx-auto">
                {/* Hero / Header */}
                <header className="mb-12 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-px bg-maroon" />
                            <span className="text-maroon font-space font-bold text-[10px] uppercase tracking-[0.3em]">Neural Events Terminal</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.9]">
                            Find Your Next <br />
                            <span className="text-maroon">Breakthrough</span> Challenge
                        </h1>
                        <p className="text-gray-500 font-inter text-sm max-w-lg">
                            From high-stakes AI hackathons to community builds, discover thousands of events where your identity meets its potential.
                        </p>
                    </motion.div>
                </header>

                {/* Search & Filter Hub */}
                <div className="glass-card p-6 border-white/5 bg-white/[0.03] backdrop-blur-xl mb-12 sticky top-24 z-30 flex flex-col gap-6">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search by event title, tech stack, or theme..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-maroon/40 focus:bg-maroon/5 transition-all font-inter text-sm"
                            />
                        </div>

                        {/* Status Toggle */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                            {['Upcoming', 'Ended'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-6 py-2.5 rounded-lg text-[10px] font-space font-bold uppercase tracking-widest transition-all ${
                                        statusFilter === s ? 'bg-maroon text-white shadow-neon' : 'text-gray-500 hover:text-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* View Toggle */}
                        <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                            {[
                                { id: 'grid', icon: LayoutGrid },
                                { id: 'list', icon: ListIcon }
                            ].map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => setViewMode(v.id)}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === v.id ? 'bg-maroon/20 text-maroon' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <v.icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Scroll */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                        <Filter size={16} className="text-maroon flex-shrink-0" />
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full border text-[10px] font-space font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                                    selectedCategory === cat 
                                        ? 'border-maroon text-maroon bg-maroon/10 shadow-[0_0_15px_rgba(128,0,0,0.15)]'
                                        : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {filteredEvents.length > 0 ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                        >
                            {filteredEvents.map((event, idx) => (
                                <HackathonCard key={event.id} hackathon={event} index={idx} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-40 glass-card border-white/5 bg-white/[0.02]"
                        >
                            <Zap size={40} className="text-maroon/40 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-2">No Matching Events Signal</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                We couldn't find any events matching your current filters. Try adjusting your search query or category.
                            </p>
                            <button 
                                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                                className="mt-8 px-8 py-3 bg-maroon/20 border border-maroon/40 text-maroon rounded-xl font-space font-bold text-[10px] uppercase tracking-widest hover:bg-maroon hover:text-white transition-all"
                            >
                                RESET FILTERS
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Hackathons;
