import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle2, Clock, Trash2, ExternalLink, ShieldAlert, User as UserIcon, Target } from 'lucide-react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts', 'sent', 'received'

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [notifs, sent, received] = await Promise.all([
        api.get('/notifications'),
        api.get('/requests/sent'),
        api.get('/requests/received')
      ]);
      setNotifications(notifs.data);
      // Case-insensitive status check for robustness
      setSentRequests(sent.data.filter(r => r.status?.toString().toUpperCase() === 'PENDING'));
      setReceivedRequests(received.data.filter(r => r.status?.toString().toUpperCase() === 'PENDING'));
    } catch (err) {
      console.error('Error fetching data:', err);
      toast.error("Failed to sync neural updates. Check uplink connection.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/mark-as-read/${id}`);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await api.put(`/requests/${requestId}/${status}`);
      toast.success(`Request ${status.toLowerCase()}ed.`);
      fetchAllData();
    } catch (err) {
      console.error('Action failed:', err);
      toast.error('Operation failed.');
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 relative overflow-hidden bg-black text-white">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-maroon/10 blur-[150px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-maroon/20 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon/10 border border-maroon/30 text-maroon text-[10px] font-space font-bold uppercase tracking-[0.2em] mb-4"
            >
              <Bell size={12} /> Neural Alerts
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Your <span className="text-maroon">Chronicle</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest transition-all ${activeTab === 'alerts' ? 'bg-maroon text-white shadow-neon' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              Alerts ({notifications.filter(n => !n.isRead).length})
            </button>
            <button 
              onClick={() => setActiveTab('received')}
              className={`px-4 py-2 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest transition-all ${activeTab === 'received' ? 'bg-maroon text-white shadow-neon' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              Incoming ({receivedRequests.length})
            </button>
            <button 
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 rounded-xl text-[10px] font-space font-bold uppercase tracking-widest transition-all ${activeTab === 'sent' ? 'bg-maroon text-white shadow-neon' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            >
              Outbound ({sentRequests.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="h-24 w-full glass-card animate-pulse border-white/5" />
             ))
          ) : activeTab === 'alerts' ? (
            <>
              {notifications.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button onClick={markAllAsRead} className="text-[10px] font-space font-bold uppercase text-maroon hover:text-white transition-colors">
                    Mark All As Read
                  </button>
                </div>
              )}
              {notifications.length === 0 ? (
                <EmptyState icon={ShieldAlert} title="Radio Silence" desc="No new intel received in this terminal." />
              ) : (
                <AnimatePresence>
                  {notifications.map((notif, idx) => (
                    <NotificationItem key={notif.id} notif={notif} idx={idx} markAsRead={markAsRead} setActiveTab={setActiveTab} />
                  ))}
                </AnimatePresence>
              )}
            </>
          ) : activeTab === 'sent' ? (
            sentRequests.length === 0 ? (
                <EmptyState icon={Clock} title="No Outbound Links" desc="You haven't initiated any connection sequences yet." />
            ) : (
                sentRequests.map((req, idx) => (
                    <RequestItem key={req.id} req={req} idx={idx} type="sent" />
                ))
            )
          ) : (
            receivedRequests.length === 0 ? (
                <EmptyState icon={Target} title="No Incoming Signals" desc="Waiting for other operatives to reach out." />
            ) : (
                receivedRequests.map((req, idx) => (
                    <RequestItem key={req.id} req={req} idx={idx} type="received" onAction={handleRequestAction} />
                ))
            )
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, desc }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center glass-card border-white/5 bg-white/[0.02]">
        <Icon className="mx-auto text-gray-700 mb-4" size={48} />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 font-inter text-sm">{desc}</p>
    </motion.div>
);

const NotificationItem = ({ notif, idx, markAsRead, setActiveTab }) => {
    const handleAction = (e) => {
        if (!notif.isRead) markAsRead(notif.id);
        
        // If it's a connection request, switch to Incoming tab
        if (notif.type === 'CONNECTION_REQUEST') {
            e.preventDefault();
            setActiveTab('received');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative overflow-hidden glass-card p-6 border transition-all duration-300 cursor-pointer ${
            notif.isRead 
                ? 'bg-white/[0.02] border-white/5 hover:border-white/10' 
                : 'bg-maroon/[0.03] border-maroon/20 hover:border-maroon/40 shadow-[0_0_20px_rgba(128,0,0,0.05)]'
            }`}
            onClick={handleAction}
        >
            <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
                <div className={`mt-1 p-2.5 rounded-xl border ${
                notif.isRead 
                    ? 'bg-white/5 border-white/10 text-gray-500' 
                    : 'bg-maroon/10 border-maroon/30 text-maroon'
                }`}>
                <Bell size={20} />
                </div>
                <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <h4 className={`text-lg font-bold tracking-tight ${notif.isRead ? 'text-gray-400' : 'text-white'}`}>
                    {notif.title}
                    </h4>
                    {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-maroon animate-pulse" />
                    )}
                </div>
                <p className={`text-sm font-inter leading-relaxed ${notif.isRead ? 'text-gray-500' : 'text-gray-300'}`}>
                    {notif.message}
                </p>
                <div className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-space text-gray-500 uppercase font-bold tracking-wider">
                        <Clock size={12} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {notif.actionUrl && (
                        <div className="flex items-center gap-1.5 text-[10px] font-space text-maroon group-hover:text-white uppercase font-bold tracking-wider transition-colors">
                        Execute Action <ExternalLink size={12} />
                        </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </motion.div>
    );
};

const RequestItem = ({ req, idx, type, onAction }) => {
    const user = type === 'sent' ? req.receiver : req.sender;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-card p-6 border-white/5 bg-white/[0.02] flex items-center justify-between gap-6"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-maroon/10 border border-maroon/20 overflow-hidden flex items-center justify-center">
                    {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <UserIcon className="text-maroon/40" size={24} />}
                </div>
                <div>
                    <h4 className="text-white font-bold">{user.name}</h4>
                    <p className="text-[10px] font-space text-gray-500 uppercase tracking-widest">
                        {type === 'sent' ? 'Awaiting Pickup' : 'Incoming Connection Request'}
                    </p>
                </div>
            </div>

            {type === 'received' && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => onAction(req.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-maroon/20 border border-maroon/40 rounded-lg text-[10px] font-space font-bold uppercase hover:bg-maroon transition-all"
                    >
                        Accept
                    </button>
                    <button 
                        onClick={() => onAction(req.id, 'REJECTED')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-space font-bold uppercase hover:bg-white/10 transition-all"
                    >
                        Decline
                    </button>
                </div>
            )}

            {type === 'sent' && (
                <div className="px-4 py-2 bg-maroon/5 border border-maroon/20 rounded-lg">
                    <span className="text-[10px] font-space font-bold text-maroon uppercase tracking-widest">Neural Link Pending</span>
                </div>
            )}
        </motion.div>
    );
};

export default Notifications;
