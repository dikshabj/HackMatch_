import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Calendar, MapPin, Link2, FileText, Tag, DollarSign,
  Phone, Globe, Hash, ChevronRight, ChevronLeft, Check, X,
  Upload, Clock, Users, Zap, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── STEP CONFIG ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Basic Info',    icon: Trophy },
  { id: 2, label: 'Details',      icon: FileText },
  { id: 3, label: 'Logistics',    icon: MapPin },
  { id: 4, label: 'Prizes & Tags', icon: DollarSign },
];

// ─── REUSABLE INPUT ──────────────────────────────────────────────────────────
const FormField = ({ label, required, children, hint }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-1 text-[10px] font-space font-bold uppercase tracking-[0.2em] text-gray-400">
      {label}
      {required && <span className="text-maroon">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-600 font-inter">{hint}</p>}
  </div>
);

const Input = ({ icon: Icon, ...props }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors"
      />
    )}
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-white placeholder-gray-600
        focus:outline-none focus:border-maroon/60 focus:bg-maroon/5 transition-all font-inter text-sm`}
    />
  </div>
);

const Textarea = ({ icon: Icon, rows = 4, ...props }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        size={16}
        className="absolute left-4 top-4 text-gray-500 group-focus-within:text-maroon transition-colors"
      />
    )}
    <textarea
      rows={rows}
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-white placeholder-gray-600
        focus:outline-none focus:border-maroon/60 focus:bg-maroon/5 transition-all font-inter text-sm resize-none`}
    />
  </div>
);

const Select = ({ icon: Icon, children, ...props }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-maroon transition-colors"
      />
    )}
    <select
      {...props}
      className={`w-full bg-[#111] border border-white/10 rounded-xl py-3 ${Icon ? 'pl-11' : 'pl-4'} pr-4 text-white
        focus:outline-none focus:border-maroon/60 focus:bg-maroon/5 transition-all font-inter text-sm appearance-none`}
    >
      {children}
    </select>
  </div>
);

// ─── TAG INPUT ────────────────────────────────────────────────────────────────
const TagInput = ({ tags, setTags, placeholder }) => {
  const [input, setInput] = useState('');
  const add = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) setTags([...tags, input.trim()]);
      setInput('');
    }
  };
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-wrap gap-2 focus-within:border-maroon/60 transition-all min-h-[50px]">
      {tags.map((t) => (
        <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 bg-maroon/20 border border-maroon/30 rounded-lg text-[11px] font-space text-maroon">
          {t}
          <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))}>
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={add}
        placeholder={tags.length === 0 ? placeholder : 'Add more...'}
        className="flex-1 min-w-[120px] bg-transparent text-white text-sm font-inter placeholder-gray-600 outline-none"
      />
    </div>
  );
};

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-10">
    {STEPS.map((s, i) => {
      const done = current > s.id;
      const active = current === s.id;
      const Icon = s.icon;
      return (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ scale: active ? 1.1 : 1 }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                done   ? 'bg-maroon border-maroon' :
                active ? 'bg-maroon/20 border-maroon' :
                         'bg-white/5 border-white/10'
              }`}
            >
              {done ? <Check size={15} className="text-white" /> : <Icon size={15} className={active ? 'text-maroon' : 'text-gray-600'} />}
            </motion.div>
            <span className={`text-[9px] font-space uppercase tracking-widest ${active ? 'text-maroon' : 'text-gray-600'}`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-10 mb-4 transition-all ${current > s.id ? 'bg-maroon' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
const CreateHackathon = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    // Step 1
    title: '',
    category: '',
    type: '',
    date: '',
    duration: '',
    // Step 2
    description: '',
    eligibility: '',
    rules: '',
    // Step 3
    location: '',
    registrationLink: '',
    website: '',
    socialMedia: '',
    contact: '',
    // Step 4
    prizes: '',
    image: '',
    tags: [],
    hashtags: [],
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const setArr = (field) => (val) => setForm({ ...form, [field]: val });

  // ── Validation per step ──
  const validate = () => {
    if (step === 1) {
      if (!form.title.trim()) return 'Hackathon title is required.';
      if (!form.category)     return 'Please select a category.';
      if (!form.type)         return 'Please select event type.';
      if (!form.date)         return 'Event date is required.';
    }
    if (step === 2) {
      if (!form.description.trim()) return 'Description is required.';
    }
    if (step === 3) {
      if (!form.registrationLink.trim()) return 'Registration link is required.';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => s + 1);
  };

  const prev = () => { setError(''); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        tags:     form.tags.join(', '),
        hashtags: form.hashtags.join(', '),
      };
      await api.post('/hackathons', payload);
      navigate('/organizer/dashboard', { state: { created: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hackathon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 relative overflow-hidden">
      {/* BG blobs */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-maroon/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 -left-32 w-80 h-80 bg-maroon/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon/20 border border-maroon/30 text-[10px] font-space text-maroon uppercase tracking-widest mb-4">
            <Trophy size={11} /> Organizer Portal
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">
            Create <span className="text-maroon">Hackathon</span>
          </h1>
          <p className="text-gray-500 text-sm font-inter">Fill in the details to publish your event</p>
        </motion.div>

        {/* Step Indicator */}
        <StepIndicator current={step} />

        {/* Form Card */}
        <div className="glass-card border-white/5 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-maroon to-transparent" />

          <AnimatePresence mode="wait">
            {/* ══ STEP 1: Basic Info ══════════════════════════════════════════ */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">
                  Basic <span className="text-maroon">Information</span>
                </h2>

                <FormField label="Hackathon Title" required>
                  <Input icon={Trophy} placeholder="e.g. BuildX Spring Hackathon 2025" value={form.title} onChange={set('title')} />
                </FormField>

                <div className="grid grid-cols-2 gap-5">
                  <FormField label="Category" required>
                    <Select icon={Tag} value={form.category} onChange={set('category')}>
                      <option value="">Select category</option>
                      <option value="AI/ML">AI / ML</option>
                      <option value="Web3">Web3 / Blockchain</option>
                      <option value="FinTech">FinTech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="EdTech">EdTech</option>
                      <option value="Open Innovation">Open Innovation</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormField>

                  <FormField label="Event Type" required>
                    <Select icon={Globe} value={form.type} onChange={set('type')}>
                      <option value="">Select type</option>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                      <option value="Hybrid">Hybrid</option>
                    </Select>
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <FormField label="Event Date" required>
                    <Input icon={Calendar} type="date" value={form.date} onChange={set('date')} min={new Date().toISOString().split('T')[0]} />
                  </FormField>

                  <FormField label="Duration" hint="e.g. 24 hours, 2 days">
                    <Input icon={Clock} placeholder="e.g. 48 hours" value={form.duration} onChange={set('duration')} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 2: Details ═════════════════════════════════════════════ */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">
                  Event <span className="text-maroon">Details</span>
                </h2>

                <FormField label="Description" required hint="Give participants a clear picture of what to expect">
                  <Textarea icon={FileText} placeholder="Describe your hackathon — theme, goals, what participants will build..." value={form.description} onChange={set('description')} rows={5} />
                </FormField>

                <FormField label="Eligibility" hint="Who can participate?">
                  <Textarea placeholder="e.g. Open to all students, professionals welcome, teams of 2–5..." value={form.eligibility} onChange={set('eligibility')} rows={3} />
                </FormField>

                <FormField label="Rules & Guidelines" hint="Important rules for participation">
                  <Textarea placeholder="e.g. No plagiarism, project must be built during the event, max team size 4..." value={form.rules} onChange={set('rules')} rows={4} />
                </FormField>
              </motion.div>
            )}

            {/* ══ STEP 3: Logistics ══════════════════════════════════════════ */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">
                  Logistics & <span className="text-maroon">Links</span>
                </h2>

                <FormField label="Venue / Location" hint="City, campus, or 'Online'">
                  <Input icon={MapPin} placeholder="e.g. IIT Delhi, New Delhi or Online" value={form.location} onChange={set('location')} />
                </FormField>

                <FormField label="Registration Link" required hint="Where should participants register?">
                  <Input icon={Link2} type="url" placeholder="https://devfolio.co/hackathon/..." value={form.registrationLink} onChange={set('registrationLink')} />
                </FormField>

                <FormField label="Official Website">
                  <Input icon={Globe} type="url" placeholder="https://yourhackathon.com" value={form.website} onChange={set('website')} />
                </FormField>

                <div className="grid grid-cols-2 gap-5">
                  <FormField label="Social Media Link">
                    <Input icon={Link2} type="url" placeholder="Twitter / LinkedIn / Discord" value={form.socialMedia} onChange={set('socialMedia')} />
                  </FormField>

                  <FormField label="Contact Info">
                    <Input icon={Phone} placeholder="email or phone" value={form.contact} onChange={set('contact')} />
                  </FormField>
                </div>
              </motion.div>
            )}

            {/* ══ STEP 4: Prizes & Tags ═══════════════════════════════════════ */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="p-8 space-y-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-6">
                  Prizes & <span className="text-maroon">Visibility</span>
                </h2>

                <FormField label="Prize Pool" hint="Describe all prizes — 1st, 2nd, bounties, etc.">
                  <Textarea icon={DollarSign} placeholder={`e.g.\n🥇 1st Place — ₹50,000\n🥈 2nd Place — ₹25,000\n🏆 Best UI/UX — ₹5,000`} value={form.prizes} onChange={set('prizes')} rows={5} />
                </FormField>

                <FormField label="Banner Image URL" hint="A cover image URL for your hackathon card">
                  <Input icon={Upload} type="url" placeholder="https://..." value={form.image} onChange={set('image')} />
                  {form.image && (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={form.image}
                      alt="Preview"
                      className="mt-2 w-full h-40 object-cover rounded-xl border border-white/10"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                </FormField>

                <FormField label="Tags" hint="Press Enter or comma to add (e.g. React, Python, ML)">
                  <TagInput tags={form.tags} setTags={setArr('tags')} placeholder="Add skill tags..." />
                </FormField>

                <FormField label="Hashtags" hint="For discovery — press Enter or comma to add">
                  <TagInput tags={form.hashtags} setTags={setArr('hashtags')} placeholder="#hackathon #ai #buildx..." />
                </FormField>

                {/* Preview Summary */}
                <div className="mt-4 p-5 rounded-2xl bg-maroon/5 border border-maroon/20 space-y-3">
                  <h3 className="text-[10px] font-space font-bold uppercase tracking-widest text-maroon mb-3">Event Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-inter">
                    {[
                      ['Title', form.title || '—'],
                      ['Category', form.category || '—'],
                      ['Type', form.type || '—'],
                      ['Date', form.date || '—'],
                      ['Duration', form.duration || '—'],
                      ['Location', form.location || '—'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span className="text-gray-500">{k}: </span>
                        <span className="text-white font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Error Banner ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-8 mb-4 flex items-center gap-3 px-4 py-3 bg-red-900/20 border border-red-700/30 rounded-xl"
              >
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-xs font-inter">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Nav Buttons ── */}
          <div className="px-8 pb-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={step === 1 ? () => navigate('/organizer/dashboard') : prev}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-[11px] font-space uppercase tracking-widest transition-all"
            >
              <ChevronLeft size={14} />
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 4 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={next}
                className="flex items-center gap-2 px-7 py-2.5 bg-maroon rounded-xl text-white text-[11px] font-space font-bold uppercase tracking-widest shadow-neon hover:bg-maroon-dark transition-all"
              >
                Next Step
                <ChevronRight size={14} />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2.5 bg-maroon rounded-xl text-white text-[11px] font-space font-bold uppercase tracking-widest shadow-neon hover:bg-maroon-dark transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap size={14} />
                    Publish Hackathon
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHackathon;
