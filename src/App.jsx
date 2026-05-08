/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Gamepad2, X, Maximize2, Minimize2, ExternalLink, Flame, Trophy, Palette, Zap, Sparkles, Ghost, Clock } from 'lucide-react';
import gamesData from './data/games.json';

const CATEGORIES = ['All', 'Puzzle', 'Classic', 'Arcade', 'Action', 'Sports'];
const THEMES = [
  { id: 'radiation', name: 'Radiation', color: '#00FF00', icon: Zap },
  { id: 'supernova', name: 'Supernova', color: '#FF007F', icon: Sparkles },
  { id: 'vibe', name: 'Amethyst', color: '#8A2BE2', icon: Palette },
  { id: 'glitch', name: 'Glitch', color: '#00FFFF', icon: Ghost }
];

export default function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('wt_theme') || 'radiation');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('wt_theme', currentTheme);
  }, [currentTheme]);

  const filteredGames = useMemo(() => {
    return gamesData.games.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface)] text-white font-sans selection:bg-[var(--primary)] selection:text-black transition-colors duration-500 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)] blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--primary)] blur-[120px] rounded-full" 
        />
        
        {/* Animated Background Anomalies */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0],
              scale: [0, 1.5, 0],
              x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
              y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
            className="absolute w-64 h-64 bg-[var(--primary)] blur-[80px] rounded-full opacity-0"
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setSelectedGame(null);
              setSearchQuery('');
              setActiveCategory('All');
            }}
          >
            <div className="w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all duration-300 shadow-[0_0_20px_var(--primary-glow)]">
              <Gamepad2 className="text-black w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-brand">
              wheresthenuke
              <span className="text-[var(--primary)]">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <a href="#" className="hover:text-[var(--primary)] transition-colors">Hot</a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">New</a>
              <a href="#" className="hover:text-[var(--primary)] transition-colors">Top</a>
            </div>
            
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />
            
            {/* Theme Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 gap-1">
              {THEMES.map(theme => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setCurrentTheme(theme.id)}
                    className={`p-1.5 rounded-full transition-all duration-300 relative group overflow-hidden ${
                      currentTheme === theme.id ? 'bg-[var(--primary)] text-black' : 'hover:bg-white/10'
                    }`}
                    title={theme.name}
                  >
                    <Icon size={14} className="relative z-10" />
                    {currentTheme === theme.id && (
                      <motion.div 
                        layoutId="theme-orbit"
                        className="absolute inset-0 bg-white opacity-20"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <button className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 hover:bg-[var(--primary)] hover:text-black px-6 py-2.5 rounded-full transition-all duration-300 border border-white/10 hover:border-[var(--primary)] shadow-[0_0_15px_transparent] hover:shadow-[var(--primary-glow)]">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-16">
        {!selectedGame ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-16"
          >
            {/* Hero Section */}
            <section className="text-center space-y-8 py-8 md:py-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-4">
                  <Flame size={12} />
                  <span>Version 2.0 Live</span>
                </div>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] text-display">
                  UNLIMITED<br />
                  <span className="text-[var(--primary)] drop-shadow-[0_0_30px_var(--primary-glow)]">GAMES.</span>
                </h2>
              </motion.div>
              
              <p className="text-white/50 text-base md:text-xl max-w-xl mx-auto font-medium leading-relaxed">
                Experience the net's most explosive collection of games. 
                Fast, free, and completely unblocked.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto relative group">
                <div className="absolute inset-0 bg-[var(--primary)]/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[var(--primary)] transition-colors" />
                <input 
                  type="text"
                  placeholder="Search for a game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 text-xl focus:outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all duration-300 placeholder:text-white/20 relative z-10"
                />
              </div>
            </section>

            {/* Filter Section */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                    activeCategory === category 
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-black shadow-[0_0_20px_var(--primary-glow)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-white/60 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Games Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <div 
                      onClick={() => setSelectedGame(game)}
                      className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden hover:border-[var(--primary)]/50 transition-all duration-500 cursor-pointer relative hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_20px_var(--primary-glow)]"
                    >
                      <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                        <img 
                          src={game.thumbnail} 
                          alt={game.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent opacity-80 group-hover:opacity-20 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center text-black shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                             <Gamepad2 size={32} />
                           </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--primary)]">
                          {game.category}
                        </div>
                      </div>
                      <div className="p-6 space-y-2 relative">
                        <h3 className="text-xl font-bold tracking-tight group-hover:text-[var(--primary)] transition-colors text-display">
                          {game.title}
                        </h3>
                        <p className="text-sm text-white/30 line-clamp-2">
                          {game.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          </motion.div>
        ) : (
          /* Game Detail / Play Section */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <button 
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-white/40 hover:text-[var(--primary)] transition-colors uppercase text-[10px] font-black tracking-[0.2em] mb-4 group"
                >
                  <X size={14} className="group-hover:rotate-90 transition-transform" />
                  Abort Mission
                </button>
                <div className="flex flex-wrap items-center gap-4">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-display">
                    {selectedGame.title}
                  </h2>
                  <span className="bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {selectedGame.category}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleFullscreen}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all group"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} className="group-hover:scale-110 transition-transform" />}
                </button>
                <a 
                  href={selectedGame.iframeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all group"
                  title="Open in New Tab"
                >
                  <ExternalLink size={24} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            <div className="aspect-video w-full bg-black/40 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl relative shadow-[var(--primary-glow)] ring-1 ring-white/10">
              <iframe 
                src={selectedGame.iframeUrl}
                title={selectedGame.title}
                className="w-full h-full border-none"
                allowFullScreen
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Trophy size={160} />
                  </div>
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-display">
                    <Trophy className="text-[var(--primary)]" size={24} />
                    Mission Intel
                  </h3>
                  <p className="text-white/50 leading-relaxed text-lg font-medium">
                    {selectedGame.description}
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10">
                      Puzzle
                    </div>
                    <div className="bg-white/5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/10">
                      Single Player
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8 relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-[var(--primary)]/10 blur-[60px] rounded-full" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 italic">Server Status</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                      <span className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">Active Players</span>
                        <span className="text-lg font-black text-brand italic">12.4k</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "75%" }}
                          className="h-full bg-[var(--primary)]"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-sm font-medium text-white/50">Daily Highscore</span>
                        <span className="font-black text-[var(--primary)] text-display italic">44,020</span>
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/5">
                        <span className="text-sm font-medium text-white/50">Avg. Session</span>
                        <span className="font-bold flex items-center gap-2">12m <Clock size={14} className="text-white/20" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-24 py-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start opacity-70 hover:opacity-100 transition-opacity duration-500">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <Gamepad2 className="text-[var(--primary)] w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic text-brand">
                wheresthenuke
              </h1>
            </div>
            <p className="text-xs font-medium text-white/30 leading-relaxed uppercase tracking-widest">
              The premier destination for elite web entertainment. Deploying fun since 2024.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Protocols</h4>
              <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-white/40">
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Safety</a>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--primary)]">Operation</h4>
              <nav className="flex flex-col gap-3 text-xs font-bold uppercase tracking-widest text-white/40">
                <a href="#" className="hover:text-white transition-colors">Discord</a>
                <a href="#" className="hover:text-white transition-colors">X / Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </nav>
            </div>
          </div>

          <div className="md:text-right space-y-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/20 leading-loose">
              &copy; 2024 WTN Network.<br />
              Secure Transmission Encrypted.<br />
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
