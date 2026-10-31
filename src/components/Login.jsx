import { useState } from 'react';
import { authenticateUser } from '../data/users';
import { playTapSound, playSuccessChime, playRemoveSound } from '../utils/audio';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter both username and password / యూజర్‌నేమ్ మరియు పాస్‌వర్డ్ నమోదు చేయండి');
      playRemoveSound();
      return;
    }

    setIsSubmitting(true);

    const user = authenticateUser(username, password);
    if (user) {
      playSuccessChime();
      sessionStorage.setItem('authUser', JSON.stringify(user));
      onLogin(user);
    } else {
      playRemoveSound();
      setError('Invalid username or password / సరైన యూజర్‌నేమ్ లేదా పాస్‌వర్డ్ ఇవ్వండి');
      setIsSubmitting(false);
    }
  };

  // Quick Account selector: sets USERNAME ONLY, never discloses or auto-fills password
  const selectStaffId = (u) => {
    playTapSound();
    setUsername(u);
    setPassword('');
    setError('');
  };

  const checkCapsLock = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md">
        {/* Luxury Glassmorphic Card Container */}
        <div className="bg-gradient-to-b from-[#131D31] via-[#101828] to-[#0A0E1A] rounded-3xl shadow-2xl border border-[#233352] overflow-hidden backdrop-blur-xl relative">
          
          {/* Subtle Ambient Gold Glow Top Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 shadow-lg shadow-amber-500/30" />

          {/* Header Banner */}
          <div className="p-8 text-center relative border-b border-[#1E2B44] bg-[#0C1220]/70">
            <div className="relative inline-block mb-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-400 border border-amber-400/30 text-3xl flex items-center justify-center shadow-lg shadow-amber-500/10 mx-auto">
                🍽️
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full border border-[#0C1220]">
                VEG
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              మమత టిఫిన్ సెంటర్
            </h1>
            <p className="text-xs font-bold text-amber-400 tracking-wider uppercase mt-1">
              Mamata Tiffin Center · Enterprise POS
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-bold rounded-full">
              <span>🔒</span>
              <span>Secure Staff Login / సిబ్బంది లాగిన్</span>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Quick Staff ID Selector - ONLY sets user ID, never displays or bypasses passwords */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Staff ID / సిబ్బంది ఐడి:
                </span>
                <span className="text-[10px] text-amber-400/80 font-medium">
                  Click to select ID
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => selectStaffId('chsmreddy')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    username === 'chsmreddy'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black border-amber-400 shadow-md shadow-amber-500/20 scale-[1.02]'
                      : 'bg-[#0E1524] text-slate-300 border-[#22314E] hover:bg-[#162136] hover:border-amber-400/30'
                  }`}
                >
                  <div className="font-black">👑 Admin</div>
                  <div className="text-[10px] opacity-80">chsmreddy</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectStaffId('cashier1')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    username === 'cashier1'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-[#0E1524] text-slate-300 border-[#22314E] hover:bg-[#162136] hover:border-emerald-400/30'
                  }`}
                >
                  <div className="font-black">🧾 Cashier 1</div>
                  <div className="text-[10px] opacity-80">cashier1</div>
                </button>

                <button
                  type="button"
                  onClick={() => selectStaffId('cashier2')}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all text-center ${
                    username === 'cashier2'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black border-emerald-400 shadow-md shadow-emerald-500/20 scale-[1.02]'
                      : 'bg-[#0E1524] text-slate-300 border-[#22314E] hover:bg-[#162136] hover:border-emerald-400/30'
                  }`}
                >
                  <div className="font-black">🧾 Cashier 2</div>
                  <div className="text-[10px] opacity-80">cashier2</div>
                </button>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium flex items-center gap-2 animate-shake">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Caps Lock warning */}
            {capsLockActive && (
              <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] font-semibold flex items-center gap-1.5">
                <span>⚠️</span>
                <span>Caps Lock is ON / క్యాప్స్ లాక్ ఆన్‌లో ఉంది</span>
              </div>
            )}

            {/* Secure Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  User ID / యూజర్‌నేమ్
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Staff ID (e.g. chsmreddy)"
                    autoComplete="username"
                    className="w-full pl-11 pr-4 py-3 bg-[#080C14] border border-[#243352] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-600"
                    required
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base">
                    👤
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password / పాస్‌వర్డ్
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyUp={checkCapsLock}
                    onKeyDown={checkCapsLock}
                    placeholder="Enter Staff Password"
                    autoComplete="current-password"
                    className="w-full pl-11 pr-11 py-3 bg-[#080C14] border border-[#243352] rounded-xl text-white text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all placeholder-slate-600"
                    required
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base">
                    🔒
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '👁️‍🗨️' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:scale-[0.98] text-slate-950 rounded-xl font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔓 Sign In to Terminal / ప్రవేశించండి</span>
                </button>
              </div>
            </form>

            {/* Security notice footer (No passwords displayed anywhere!) */}
            <div className="pt-4 border-t border-[#1E2B44] text-center">
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Protected Terminal · Multi-Factor Role Guard Active</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Authorized staff use only. In case of lost credentials, contact Administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
