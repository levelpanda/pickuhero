import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HEROES, ROLES, Hero } from './data/heroes';
import { Shuffle, RotateCcw, Trophy } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState('all');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollIndex, setRollIndex] = useState(0);

  // Filter heroes based on active role
  const filteredHeroes = useMemo(() => {
    if (activeRole === 'all') return HEROES;
    return HEROES.filter((hero) => hero.role.includes(activeRole));
  }, [activeRole]);

  // Handle drawing a hero
  const handleDraw = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setSelectedHero(null);
    
    let count = 0;
    const maxCount = 20; // Number of "flashes" before stopping
    const interval = setInterval(() => {
      setRollIndex(Math.floor(Math.random() * filteredHeroes.length));
      count++;
      
      if (count >= maxCount) {
        clearInterval(interval);
        const finalHero = filteredHeroes[Math.floor(Math.random() * filteredHeroes.length)];
        setSelectedHero(finalHero);
        setIsRolling(false);
      }
    }, 100);
  };

  const reset = () => {
    setSelectedHero(null);
    setIsRolling(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="py-8 px-4 text-center border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <h1 className="text-4xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          王者荣耀英雄抽签
        </h1>
        <p className="text-slate-400 text-sm uppercase tracking-widest font-medium">
          我的英雄池深不可测
        </p>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Role Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => {
                setActiveRole(role.id);
                reset();
              }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeRole === role.id
                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20 text-white'
                  : 'bg-slate-800/50 border-white/10 text-slate-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>

        {/* Draw Button - Positioned below filters */}
        {!selectedHero && (
          <div className="flex justify-center mb-12">
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDraw}
              disabled={isRolling}
              className="px-12 py-5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/60 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/20"
            >
              <Shuffle className={`w-6 h-6 ${isRolling ? 'animate-spin' : ''}`} />
              {isRolling ? '正在抽取...' : '开始抽签'}
            </motion.button>
          </div>
        )}

        {/* Main Display Area */}
        <div className="relative min-h-[400px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {selectedHero ? (
              <motion.div
                key="selected"
                initial={{ scale: 0.5, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="relative group">
                  <motion.div 
                    className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <img
                    src={selectedHero.avatar}
                    alt={selectedHero.name}
                    className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${selectedHero.name}/400/400`;
                    }}
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-4 -right-4 bg-yellow-500 p-3 rounded-full shadow-lg"
                  >
                    <Trophy className="w-6 h-6 text-slate-900" />
                  </motion.div>
                </div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 text-5xl font-black tracking-tight"
                >
                  {selectedHero.name}
                </motion.h2>
                <div className="mt-8 flex items-center gap-6">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    onClick={handleDraw}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 rounded-xl font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                    重新抽取
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-all border border-white/10"
                  >
                    取消
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                {/* Hero Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4 opacity-40">
                  {filteredHeroes.map((hero, idx) => (
                    <div
                      key={hero.id}
                      className={`relative flex flex-col items-center gap-1 transition-all duration-200 ${
                        isRolling && rollIndex === idx
                          ? 'scale-110 z-10 opacity-100'
                          : 'grayscale opacity-60'
                      }`}
                    >
                      <div className={`relative aspect-square w-[80%] rounded-lg overflow-hidden border ${
                        isRolling && rollIndex === idx
                          ? 'border-blue-500 ring-4 ring-blue-500/50'
                          : 'border-white/10'
                      }`}>
                        <img
                          src={hero.avatar}
                          alt={hero.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${hero.name}/100/100`;
                          }}
                        />
                      </div>
                      <span className="text-[10px] md:text-xs font-medium text-slate-400 truncate w-full text-center">
                        {hero.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-20 py-12 px-4 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>全英雄池已就绪 · 祝你上分大吉</p>
      </footer>
    </div>
  );
}
