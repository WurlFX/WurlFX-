import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  FlaskConical,
  Briefcase,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Plane,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  LogOut,
  ChevronRight,
  ChevronDown,
  Trophy,
  Activity,
  Flame,
  Layers,
  PhoneCall,
  MessageSquare,
  Mail,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    accountType,
    setAccountType,
    setIsDepositModalOpen,
    setIsContactModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    openAuthModalWithTab,
    logout,
    currentUser,
    betSlip,
    formatMoney,
    currentBalance,
    equity,
    showNotification,
  } = useApp();

  const [sportsExpanded, setSportsExpanded] = useState(false);
  const [boostExpanded, setBoostExpanded] = useState(false);

  if (!isOpen) return null;

  const handleSelectTab = (tab: typeof activeTab) => {
    setActiveTab(tab);
    onClose();
  };

  const handleSelectAccountMode = (mode: 'demo' | 'real') => {
    setAccountType(mode);
    setActiveTab('terminal');
    onClose();
    showNotification(
      mode === 'demo'
        ? 'Switched to Demo Account (Virtual Funds — Risk-Free Practice).'
        : 'Switched to Real Account (Live Market Capital).',
      'info'
    );
  };

  const handleOpenDeposit = () => {
    setIsDepositModalOpen(true);
    onClose();
  };

  const handleOpenProfileSecurity = () => {
    if (isAuthenticated) {
      openAuthModalWithTab('profile');
    } else {
      openAuthModalWithTab('login');
    }
    onClose();
  };

  const handleOpenHelp = () => {
    setIsContactModalOpen(true);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Sidebar Panel */}
      <div className="relative w-80 max-w-[85vw] bg-neutral-950 border-r border-neutral-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block">
                WurlFX<span className="text-emerald-400">.com</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                Trading, Digital &amp; Sports Hub
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Mode Quick Switcher Card */}
        <div className="p-3 bg-neutral-900/60 border-b border-neutral-800/80">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center justify-between">
            <span>Active Account Mode</span>
            <span className={`px-1.5 py-0.2 rounded font-mono text-[9px] ${
              accountType === 'demo' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {accountType === 'demo' ? 'VIRTUAL' : 'LIVE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs font-semibold">
            <button
              onClick={() => handleSelectAccountMode('demo')}
              className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                accountType === 'demo'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Demo</span>
            </button>
            <button
              onClick={() => handleSelectAccountMode('real')}
              className={`py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-all ${
                accountType === 'real'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Real</span>
            </button>
          </div>

          <div className="mt-2 text-xs flex justify-between items-center text-neutral-400 px-1">
            <span>Available Balance:</span>
            <span className="font-bold text-white tabular-nums">
              {formatMoney(currentBalance)}
            </span>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {/* 1. Trading Dashboard (Default Focus) */}
          <button
            onClick={() => handleSelectTab('terminal')}
            className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
              activeTab === 'terminal'
                ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Trading Dashboard</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
              Default
            </span>
          </button>

          {/* 2. Demo Account Toggle */}
          <button
            onClick={() => handleSelectAccountMode('demo')}
            className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
              accountType === 'demo' && activeTab === 'terminal'
                ? 'bg-neutral-900 text-amber-300 font-medium'
                : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="block font-medium">Demo Account</span>
                <span className="text-[10px] text-neutral-500 block">Virtual practice reserves ($10,000)</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* 3. Real Account Toggle */}
          <button
            onClick={() => handleSelectAccountMode('real')}
            className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
              accountType === 'real' && activeTab === 'terminal'
                ? 'bg-neutral-900 text-emerald-300 font-medium'
                : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="block font-medium">Real Account</span>
                <span className="text-[10px] text-neutral-500 block">Live capital execution &amp; payouts</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* Divider */}
          <div className="h-px bg-neutral-900 my-2" />

          {/* 4. Deposit & Cashier */}
          <button
            onClick={handleOpenDeposit}
            className="w-full p-2.5 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>Deposit &amp; Cashier</span>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
              M-Pesa STK
            </span>
          </button>

          {/* 5. Withdrawals */}
          <button
            onClick={handleOpenDeposit}
            className="w-full p-2.5 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ArrowUpRight className="w-4 h-4 text-neutral-400" />
              <span>Withdrawals</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* 6. Trading History */}
          <button
            onClick={() => {
              setActiveTab('terminal');
              onClose();
              // Scroll to positions table
              const el = document.getElementById('positions-history-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full p-2.5 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-sky-400" />
              <span>Trading History &amp; Orders</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* Divider */}
          <div className="h-px bg-neutral-900 my-2" />

          {/* 7. Sports Betting (Expandable Section) */}
          <div className="space-y-1">
            <button
              onClick={() => setSportsExpanded(!sportsExpanded)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'betting'
                  ? 'bg-rose-950/30 text-rose-300 font-bold border border-rose-500/30'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Plane className="w-4 h-4 text-rose-500" />
                <span>Sports Betting</span>
                {betSlip.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {betSlip.length}
                  </span>
                )}
              </div>
              {sportsExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* Submenu for Sports Betting */}
            {sportsExpanded && (
              <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-rose-500/30 ml-3">
                <button
                  onClick={() => handleSelectTab('betting')}
                  className="w-full text-left py-1.5 px-2 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    <span>Football Fixtures &amp; Odds</span>
                  </span>
                  <span className="text-[9px] text-neutral-500">EPL / La Liga</span>
                </button>
                <button
                  onClick={() => handleSelectTab('betting')}
                  className="w-full text-left py-1.5 px-2 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3 h-3 text-rose-400" />
                    <span>Sprime Aviator Crash</span>
                  </span>
                  <span className="text-[9px] text-rose-400 font-bold">100x Multiplier</span>
                </button>
              </div>
            )}
          </div>

          {/* 8. Boost Hub — Social Media Promotion (Expandable Section) */}
          <div className="space-y-1">
            <button
              onClick={() => setBoostExpanded(!boostExpanded)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'boosting' || activeTab === 'campaigns'
                  ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Boost Hub — SMM Promotion</span>
              </div>
              {boostExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* Submenu for Boost Hub */}
            {boostExpanded && (
              <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-emerald-500/30 ml-3">
                <button
                  onClick={() => handleSelectTab('boosting')}
                  className="w-full text-left py-1.5 px-2 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
                >
                  Direct Services (TikTok, IG, YouTube)
                </button>
                <button
                  onClick={() => handleSelectTab('campaigns')}
                  className="w-full text-left py-1.5 px-2 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
                >
                  Bundled Campaign Packages
                </button>
                <button
                  onClick={() => handleSelectTab('orders')}
                  className="w-full text-left py-1.5 px-2 text-[11px] text-neutral-400 hover:text-white hover:bg-neutral-900 rounded transition-colors"
                >
                  Active Growth Order Tracking
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-900 my-2" />

          {/* 9. Profile & Security */}
          <button
            onClick={handleOpenProfileSecurity}
            className="w-full p-2.5 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left">
                <span className="block font-medium">
                  {isAuthenticated ? 'Profile & Security' : 'Sign In / Register'}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {isAuthenticated
                    ? `${currentUser.fullName} · ID: ${currentUser.kycIdNumber || '34891024'}`
                    : 'Access Encrypted Account'}
                </span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* 10. Help & Support */}
          <button
            onClick={handleOpenHelp}
            className="w-full p-2.5 rounded-xl flex items-center justify-between text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-neutral-400" />
              <div className="text-left">
                <span className="block font-medium">Help &amp; Support</span>
                <span className="text-[10px] text-neutral-500">24/7 WhatsApp &amp; Helpline</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          </button>

          {/* 11. Log Out (Only when authenticated) */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full p-2.5 rounded-xl flex items-center justify-between text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors mt-2"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4" />
                <span className="font-semibold">Log Out</span>
              </div>
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-neutral-900 text-[10px] text-neutral-500 text-center">
          <span>WurlFX Platform Kenya · Currency: KES</span>
        </div>
      </div>
    </div>
  );
};
