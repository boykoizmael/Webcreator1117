import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Check, 
  AlertCircle, 
  Crown, 
  Shield, 
  Zap, 
  Eye, 
  EyeOff, 
  LogOut, 
  Sparkles,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { 
  getActiveUser, 
  loginAccount, 
  registerAccount, 
  resetPasswordDirect, 
  logoutAccount, 
  isUsernameTaken 
} from '../utils/accountManager';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'reset';
  onSuccess?: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signup',
  onSuccess
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'reset'>(initialTab);
  const [activeUser, setActiveUserState] = useState<UserAccount | null>(getActiveUser());

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status and feedback
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setTab(initialTab);
    setActiveUserState(getActiveUser());
    setError(null);
    setSuccessMsg(null);
  }, [isOpen, initialTab]);

  // Real-time username uniqueness preview check during sign-up
  useEffect(() => {
    if (tab === 'signup' && username.trim().length >= 3) {
      const taken = isUsernameTaken(username.trim());
      setIsUsernameAvailable(!taken);
    } else {
      setIsUsernameAvailable(null);
    }
  }, [username, tab]);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const result = loginAccount(email, password);
    if (result.success && result.user) {
      setActiveUserState(result.user);
      setSuccessMsg(`Welcome back, ${result.user.username}!`);
      if (onSuccess) onSuccess(result.user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setError(result.error || 'Sign in failed. Check your credentials.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match! Please verify both fields.');
      return;
    }

    const result = registerAccount(email, password, username);
    if (result.success && result.user) {
      setActiveUserState(result.user);
      setSuccessMsg(`Account created! Your unique gamertag is "${result.user.username}".`);
      if (onSuccess) onSuccess(result.user);
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setError(result.error || 'Registration failed.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const result = resetPasswordDirect(email, password);
    if (result.success) {
      setSuccessMsg('Password successfully reset! You can now sign in with your new password.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setTab('signin');
      }, 1600);
    } else {
      setError(result.error || 'Could not reset password.');
    }
  };

  const handleLogout = () => {
    logoutAccount();
    setActiveUserState(null);
    setSuccessMsg('You have been signed out.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        id="auth-accounts-modal"
        className="relative w-full max-w-md bg-[#131622] border border-[#2c354a] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232a3d] bg-[#181d2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-950/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                <span>Player Accounts & Leaderboard</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                  100% Secure
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">
                Claim your unique Custom Username for the leaderboard!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#252c40] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is ALREADY LOGGED IN: Show Profile & Sign Out */}
        {activeUser ? (
          <div className="p-6 space-y-4">
            <div className="bg-[#181d2c] border border-[#2b354b] rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow">
                    {activeUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-base font-black text-white flex items-center gap-2">
                      <span>{activeUser.username}</span>
                      {activeUser.rank === 'vip' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400" /> VIP
                        </span>
                      )}
                      {activeUser.rank === 'nolife' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 font-bold border border-purple-500/40 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-purple-400" /> NoLife
                        </span>
                      )}
                      {activeUser.rank === 'sidekick' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-emerald-400" /> SideKick
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {activeUser.email}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] px-2 py-0.5 rounded bg-[#232a3d] text-emerald-300 font-mono font-bold">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#232b3d]">
                <div className="bg-[#121520] p-2.5 rounded-xl border border-[#212739]">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Leaderboard Spot</span>
                  <span className="font-bold text-white">#3 Ranked Player</span>
                </div>
                <div className="bg-[#121520] p-2.5 rounded-xl border border-[#212739]">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Custom Username</span>
                  <span className="font-bold text-emerald-400 font-mono">Locked & Unique</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
              >
                Continue Playing
              </button>

              <button
                onClick={handleLogout}
                className="py-2.5 px-4 bg-red-950/70 hover:bg-red-900/80 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Tab Switcher */}
            <div className="grid grid-cols-3 gap-1 bg-[#0e111a] p-1 rounded-xl border border-[#242c3f]">
              <button
                type="button"
                onClick={() => { setTab('signup'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'signup'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Account
              </button>

              <button
                type="button"
                onClick={() => { setTab('signin'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'signin'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => { setTab('reset'); setError(null); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  tab === 'reset'
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reset Pass
              </button>
            </div>

            {/* Error or Success Notice */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-start gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM 1: CREATE ACCOUNT */}
            {tab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Custom Username (for Leaderboard)
                    </label>
                    {isUsernameAvailable === true && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Available & Unique
                      </span>
                    )}
                    {isUsernameAvailable === false && (
                      <span className="text-[11px] text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Name Taken!
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. ShadowMaster, ProGamer77"
                      maxLength={20}
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    No duplicate names allowed. Your chosen username will show on the website leaderboards!
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Choose a secure password (min 4 chars)"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="bg-[#161a27] p-2.5 rounded-xl border border-[#273148] text-[11px] text-gray-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>No verification settings or code delays!</span>
                  </div>
                  <p>
                    Email + Password = Instant Account. Passwords can be reset anytime without SMS or email verification codes.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Create Account & Claim Gamertag</span>
                </button>
              </form>
            )}

            {/* FORM 2: SIGN IN */}
            {tab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Email or Custom Username
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email or custom username"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setTab('reset'); setError(null); }}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-emerald-400 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </form>
            )}

            {/* FORM 3: RESET PASSWORD */}
            {tab === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 mb-0.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <span>Direct Password Reset (No Verification Needed)</span>
                  </div>
                  <p className="text-[11px] text-amber-300/80">
                    Just type your registered email and choose your new password. It updates instantly.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Your Registered Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="account@gmail.com"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (min 4 chars)"
                      className="w-full bg-[#0c0e15] border border-[#272f44] focus:border-amber-400 rounded-xl py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-gray-500 outline-none transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-950/50 cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update & Reset Password Directly</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
