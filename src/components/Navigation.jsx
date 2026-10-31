import { useState, useEffect } from 'react';
import { isSoundEnabled, toggleSound } from '../utils/audio';

const Navigation = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'admin';
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
  };

  return (
    <header className="bg-[#0B0F19]/95 backdrop-blur-xl border-b border-[#1E293B] text-white sticky top-0 z-40 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center text-xl text-amber-400 shadow-inner">
                🍽️
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B0F19]" title="Terminal Online"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-wide">
                  మమత టిఫిన్ సెంటర్
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-400/30 hidden sm:inline">
                  Luxury POS v2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Mamata Tiffin Center · 100% Pure Veg
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2">
            {/* Live Clock (Hidden on small screens) */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-[#121A2B] rounded-xl border border-[#22314E] text-slate-300 text-xs font-mono">
              <span className="text-amber-400">🕒</span>
              <span>
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              className={`p-2 rounded-xl text-xs font-bold transition-all border ${
                soundOn
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/30 hover:bg-amber-400/20'
                  : 'bg-[#121A2B] text-slate-500 border-[#22314E] hover:text-slate-300'
              }`}
              title={soundOn ? 'Mute sound effects' : 'Enable sound effects'}
            >
              {soundOn ? '🔊 Sound' : '🔇 Muted'}
            </button>

            {/* Billing Tab (Available to everyone) */}
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                activeTab === 'billing'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-300'
                  : 'text-slate-300 hover:text-white hover:bg-[#182338]'
              }`}
            >
              <span>🧾</span>
              <span>బిల్లింగ్</span>
              <span className="hidden md:inline text-xs opacity-80">/ Billing</span>
            </button>

            {/* Admin-only Tabs */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab('menu')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                    activeTab === 'menu'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-300'
                      : 'text-slate-300 hover:text-white hover:bg-[#182338]'
                  }`}
                >
                  <span>📋</span>
                  <span>మెనూ</span>
                  <span className="hidden md:inline text-xs opacity-80">/ Menu</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-300'
                      : 'text-emerald-400 hover:text-white hover:bg-[#182338] border border-emerald-500/30'
                  }`}
                >
                  <span>📊</span>
                  <span>ఆల్ రెవెన్యూ</span>
                  <span className="hidden md:inline text-xs opacity-80">/ Analytics</span>
                </button>
              </>
            )}

            {/* User Profile & Logout */}
            <div className="pl-2 border-l border-[#1E293B] flex items-center space-x-2">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-white flex items-center justify-end gap-1">
                  {isAdmin ? '👑' : '🧑‍💼'} {currentUser?.name || 'Counter'}
                </span>
                <span className="text-[10px] text-amber-400 uppercase font-semibold">
                  {isAdmin ? 'Administrator' : 'Billing Staff'}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-[#162034] hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-[#263756] hover:border-rose-700/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Log out of system"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">లాగౌట్</span>
                <span className="hidden md:inline text-[10px] opacity-75">/ Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
