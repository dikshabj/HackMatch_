import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Zap, ArrowRight, Shield, Globe, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      title: "Find Your Squad",
      desc: "Connect with the perfect teammates based on skills and vision.",
      icon: Users,
      color: "from-maroon-light to-maroon",
      path: "/search"
    },
    {
      title: "Active Hackathons",
      desc: "Explore top-tier hackathons and compete with the best in the industry.",
      icon: Trophy,
      color: "from-maroon to-maroon-dark",
      path: "/hackathons"
    },
    {
      title: "AI Matching",
      desc: "Our smart engine suggests teammates who complement your skillset.",
      icon: Cpu,
      color: "from-maroon-dark to-black",
      path: "/search"
    }
  ];

  return (
    <div className="relative pt-20 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-bg.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-maroon/10 border border-maroon/30 text-maroon text-[10px] font-space font-bold uppercase tracking-[0.2em] mb-6">
              <Zap size={12} fill="currentColor" />
              Powering the next generation of builders
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[0.95] tracking-tight">
              BUILD <span className="text-maroon">FASTER</span><br />
              TOGETHER.
            </h1>
            
            <p className="text-lg text-gray-400 max-w-lg mb-10 leading-relaxed font-inter">
              The ultimate platform for developers to find teammates, collaborate on projects, and dominate hackathons globally.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to={localStorage.getItem('token') ? "/dashboard" : "/signup"}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 bg-maroon rounded-xl font-space font-bold text-white shadow-neon flex items-center gap-2 group transition-all duration-300"
                >
                  {localStorage.getItem('token') ? "GO TO DASHBOARD" : "GET STARTED"}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
              <button className="px-8 py-3.5 rounded-xl border border-white/10 font-space font-bold text-white hover:bg-white/5 transition-all duration-300">
                LATEST UPDATES
              </button>
            </div>
          </motion.div>

          {/* Hero Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
               <div className="absolute inset-0 bg-maroon/20 blur-[100px] rounded-full animate-pulse" />
               <div className="relative h-full w-full border border-maroon/40 rounded-3xl backdrop-blur-3xl overflow-hidden shadow-2xl">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-maroon to-transparent" />
                   <div className="p-8">
                       <div className="flex items-center justify-between mb-8">
                           <div className="h-2 w-12 bg-maroon/40 rounded" />
                           <div className="h-2 w-6 bg-maroon/40 rounded" />
                       </div>
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="mb-6 opacity-40">
                            <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
                            <div className="h-2 w-1/2 bg-white/5 rounded" />
                         </div>
                       ))}
                   </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter">Accelerate Your <span className="text-maroon">Success</span></h2>
            <p className="text-gray-500 font-inter max-w-xl mx-auto uppercase text-xs tracking-[0.3em]">Built by hackers, for hackers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:border-maroon/40 hover:bg-maroon/[0.02] transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight">{item.title}</h3>
                <p className="text-gray-500 mb-6 font-inter text-sm leading-relaxed">{item.desc}</p>
                <Link to={item.path} className="inline-flex items-center gap-2 text-maroon font-orbitron text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                  Learn More <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
