import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    login,
    currentUser,
    switchRole,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'quick'>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('user@wurlfx.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Philip Juma');
  const [phone, setPhone] = useState('0762294296');
  const [agreeTerms, setAgreeTerms] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'register' && !agreeTerms) {
      showNotification('You must accept the Terms of Service & confirm you are 18+ to register.', 'error');
      return;
    }

    login(emailOrPhone);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-5 text-neutral-100 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                WurlFX Secure Access
              </h3>
              <p className="text-[11px] text-neutral-400">
                Kenya's Premium Sports, Trading &amp; SMM Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setEmailOrPhone('user@wurlfx.com');
            }}
            className={`py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'login'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'register'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'quick'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⚡ 1-Click Login
          </button>
        </div>

        {/* Quick 1-Click Role Switcher */}
        {activeTab === 'quick' && (
          <div className="space-y-3 py-2">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Use these pre-configured verified profiles to effortlessly test customer trading, betting, and administrative capabilities:
            </p>

            <button
              type="button"
              onClick={() => {
                login('user@wurlfx.com', 'user');
                showNotification('Logged in as Verified Customer: Philip Juma', 'success');
              }}
              className="w-full p-3.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Customer Profile</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Philip Juma · ID: 34891024 · user@wurlfx.com
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Access: Forex, Sprime Crash, Sports Betting, SMM Boost
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={() => {
                login('admin@wurlfx.com', 'admin');
                showNotification('Logged in as Authorized Administrator: Sphilah Admin', 'success');
              }}
              className="w-full p-3.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Platform Administrator (Admin Role)</span>
                </div>
                <div className="text-[11px] text-neutral-400">
                  Sphilah Admin · admin@wurlfx.com
                </div>
                <div className="text-[10px] text-rose-400 font-mono">
                  Unlocks: Admin Dashboard, Paybill 400200 Reconciliation, KYC
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* Regular Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block">
                Email Address or Kenyan Phone Number
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. 0762294296 or user@wurlfx.com"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span>Password</span>
                <button
                  type="button"
                  onClick={() => showNotification('Password reset link sent to registered email.', 'info')}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Sign In to WurlFX
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-neutral-500">
                Need help logging in? WhatsApp Support: <a href="https://wa.me/254762294296" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">0762294296</a>
              </span>
            </div>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Philip Juma"
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block">Safaricom Phone Number (M-Pesa)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0762294296"
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block">Email Address</label>
              <input
                type="email"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="user@wurlfx.com"
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-neutral-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-emerald-500 mt-0.5"
                />
                <span>
                  I confirm I am 18 years or older and accept the WurlFX Terms of Service, Privacy Policy &amp; Responsible Gambling limits.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Create Account &amp; Unlock KSh 50 Referral Bonus
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
