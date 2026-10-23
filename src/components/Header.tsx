import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  Sparkles,
  Layers,
  Clock,
  Wallet,
  PhoneCall,
  ShieldAlert,
  ArrowRightLeft,
  RefreshCw,
  Bell,
  Plane,
  ShieldCheck,
  User,
  Lock,
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
    setIsContactModalOpen,
    kycVerified,
    setIsKycModalOpen,
    setIsAlertModalOpen,
    unreadAlertsCount,
    priceAlerts,
    currentUser,
    setIsAuthModalOpen,
    betSlip,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur border-b border-neutral-800">
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('terminal')}
            className="flex items-center gap-2 text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                WurlFX<span className="text-emerald-400">.com</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'terminal'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Trading Terminal
          </button>

          <button
            onClick={() => setActiveTab('betting')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
              activeTab === 'betting'
                ? 'text-rose-400 border-b-2 border-rose-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-rose-500" />
            <span>Sports &amp; Sprime</span>
            {betSlip.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {betSlip.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('boosting')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'boosting'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Social Boost
          </button>

          <button
            onClick={() => setActiveTab('campaigns')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'campaigns'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Campaigns
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'wallet'
                ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Wallet &amp; Paybill
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'admin'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Desk */}
        <div className="flex items-center gap-2 shrink-0">
          {/* User Account / Login Button */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors text-xs text-neutral-300 hover:text-white"
            title="Switch User / View Login Profile"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              currentUser.role === 'admin'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left text-[11px] leading-tight">
              <span className="font-bold block truncate max-w-[90px]">{currentUser.fullName.split(' ')[0]}</span>
              <span className={`text-[9px] uppercase font-mono ${currentUser.role === 'admin' ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentUser.role === 'admin' ? 'Superadmin' : 'Verified'}
              </span>
            </div>
          </button>

          {/* Price Alerts Bell Button */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="relative p-1.5 rounded-md text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
            title="Set & Receive Currency Price Threshold Alerts"
          >
            <Bell className="w-4 h-4 text-emerald-400" />
            {unreadAlertsCount > 0 ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadAlertsCount}
              </span>
            ) : priceAlerts.filter(a => a.isActive).length > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            ) : null}
          </button>

          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            Deposit &amp; Cashier
          </button>
        </div>
      </div>

      {/* Secondary Workspace Control Bar: Account Mode, Currency Switcher, Live Account Equity */}
      <div className="bg-neutral-900/60 border-t border-neutral-800/80 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Account Mode Segmented Selector */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-medium">Account:</span>
            <div className="inline-flex p-0.5 bg-neutral-950 border border-neutral-800 rounded-md">
              <button
                onClick={() => setAccountType('demo')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  accountType === 'demo'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Demo (Practice Funds)
              </button>
              <button
                onClick={() => setAccountType('real')}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                  accountType === 'real'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Real Trading</span>
                {accountType === 'real' && !kycVerified && (
                  <span className="text-[10px] text-amber-400 underline" onClick={(e) => { e.stopPropagation(); setIsKycModalOpen(true); }}>
                    (Verify ID)
                  </span>
                )}
              </button>
            </div>

            {accountType === 'demo' && (
              <button
                onClick={resetDemoBalance}
                title="Reset virtual balance to $10,000"
                className="text-neutral-400 hover:text-amber-400 p-1 hover:bg-neutral-800 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Currency Display Switcher: KES / USD */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Display:</span>
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

            {/* Balance & Equity Summary */}
            <div className="flex items-center gap-3 text-neutral-300">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400">Balance:</span>
                <span className="tabular-nums font-semibold text-white">
                  {formatMoney(currentBalance)}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-neutral-400">Equity:</span>
                <span className="tabular-nums font-semibold text-emerald-400">
                  {formatMoney(equity)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden items-center justify-between pt-2 mt-2 border-t border-neutral-800 text-xs overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'terminal' ? 'bg-neutral-800 text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Trading
          </button>
          <button
            onClick={() => setActiveTab('betting')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'betting' ? 'bg-rose-950/80 text-rose-400 font-bold border border-rose-500/30' : 'text-neutral-400'
            }`}
          >
            <Plane className="w-3 h-3 text-rose-500" />
            <span>Sports/Sprime</span>
          </button>
          <button
            onClick={() => setActiveTab('boosting')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'boosting' ? 'bg-neutral-800 text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Boost Hub
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'campaigns' ? 'bg-neutral-800 text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'wallet' ? 'bg-neutral-800 text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            Paybill &amp; Wallet
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'admin' ? 'bg-amber-950/80 text-amber-400 font-bold border border-amber-500/30' : 'text-neutral-400'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
