import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavigationDrawer } from './NavigationDrawer';
import {
  Menu,
  TrendingUp,
  Gift,
  Bell,
  Compass,
  RefreshCw,
  ShieldCheck,
  FlaskConical,
  Briefcase,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    accountType,
    setAccountType,
    currency,
    setCurrency,
    formatMoney,
    currentBalance,
    equity,
    resetDemoBalance,
    setIsDepositModalOpen,
    kycVerified,
    setIsKycModalOpen,
    setIsAlertModalOpen,
    unreadAlertsCount,
    priceAlerts,
    currentUser,
    isAuthenticated,
    openAuthModalWithTab,
    setIsAuthModalOpen,
    showNotification,
    startTour,
  } = useApp();

  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  const handleCopyReferral = () => {
    const link = `https://wurlfx.com/?ref=${currentUser.referralCode || 'WURL-88219'}`;
    navigator.clipboard.writeText(link);
    showNotification(`Site Referral Link copied! Share to earn KSh 50 bonus: ${link}`, 'success');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800">
        {/* Main Navbar: Top-Left Hamburger, Wordmark, Mode Switcher, Primary Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          {/* Top-Left: Hamburger Menu Icon (☰) & WurlFX Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsNavDrawerOpen(true)}
              className="p-2 rounded-lg text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 transition-colors"
              title="Open Navigation Menu (☰)"
              aria-label="Navigation Menu"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className="flex items-center gap-2 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                  WurlFX<span className="text-emerald-400">.com</span>
                </span>
              </div>
            </button>
          </div>

          {/* Central: Active Account Mode Pill Switcher (Demo vs Real) */}
          <div className="flex items-center gap-2">
            <div className="inline-flex p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setAccountType('demo')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  accountType === 'demo'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Demo (Virtual)</span>
              </button>

              <button
                onClick={() => setAccountType('real')}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  accountType === 'real'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Real (Live)</span>
              </button>
            </div>

            {accountType === 'demo' && (
              <button
                onClick={resetDemoBalance}
                title="Reset Demo Capital to $10,000"
                className="hidden md:flex items-center gap-1 p-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-amber-300 transition-colors text-[11px]"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset $10K</span>
              </button>
            )}
          </div>

          {/* Right Zone: Cashier, Referral, Profile, Alerts */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Deposit & Cashier Button */}
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
            >
              <span>Deposit</span>
            </button>

            {/* Guided Tour Launcher */}
            <button
              onClick={() => startTour()}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors text-xs font-medium"
              title="Launch Interactive Guided Tour"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tour</span>
            </button>

            {/* Price Alerts Bell Button */}
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="relative p-1.5 rounded-lg text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
              title="Price Threshold Alerts"
            >
              <Bell className="w-4 h-4 text-emerald-400" />
              {unreadAlertsCount > 0 ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              ) : priceAlerts.filter((a) => a.isActive).length > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
              ) : null}
            </button>

            {/* User Profile or Sign In */}
            {isAuthenticated ? (
              <button
                onClick={() => openAuthModalWithTab('profile')}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors text-xs text-neutral-300 hover:text-white"
                title="View & Edit Account Profile & Security"
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left text-[11px] leading-tight">
                  <span className="font-bold block truncate max-w-[80px]">
                    {currentUser.fullName.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[9px] uppercase font-mono ${
                      currentUser.role === 'admin' ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {currentUser.role === 'admin' ? 'Admin' : 'Verified'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => openAuthModalWithTab('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/40 text-emerald-400 hover:text-white text-xs font-bold transition-colors"
                title="Sign In or Register"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Workspace Control Bar: Currency Switcher & Live Balances */}
        <div className="bg-neutral-900/60 border-t border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">Account:</span>
              <span
                className={`font-bold font-mono text-[11px] ${
                  accountType === 'demo' ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {accountType === 'demo' ? 'Demo Practice (Virtual Funds)' : 'Real Money Account (Live)'}
              </span>
            </div>

            {/* Currency Switcher & Quick Balance / Equity Readout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Currency:</span>
                <div className="inline-flex p-0.5 bg-neutral-950 border border-neutral-800 rounded">
                  <button
                    onClick={() => setCurrency('KES')}
                    className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                      currency === 'KES'
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    KES (KSh)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                      currency === 'USD'
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-neutral-300">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400">Balance:</span>
                  <span className="tabular-nums font-bold text-white">
                    {formatMoney(currentBalance)}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-neutral-400">Equity:</span>
                  <span className="tabular-nums font-bold text-emerald-400">
                    {formatMoney(equity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top-Left Navigation Drawer */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
      />
    </>
  );
};
