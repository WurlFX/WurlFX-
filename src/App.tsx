import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { RiskBanner } from './components/RiskBanner';
import { TradingViewChart } from './components/ForexTerminal/TradingViewChart';
import { AssetWatchlist } from './components/ForexTerminal/AssetWatchlist';
import { OrderEntryPanel } from './components/ForexTerminal/OrderEntryPanel';
import { AccountMetricsBar } from './components/ForexTerminal/AccountMetricsBar';
import { PositionsTable } from './components/ForexTerminal/PositionsTable';
import { TradingEducationSection } from './components/ForexTerminal/TradingEducationSection';
import { MarketSentiment } from './components/ForexTerminal/MarketSentiment';
import { MobileTerminalView } from './components/ForexTerminal/MobileTerminalView';
import { BoostingCatalog } from './components/SocialBoosting/BoostingCatalog';
import { CampaignBundles } from './components/SocialBoosting/CampaignBundles';
import { OrderTracker } from './components/SocialBoosting/OrderTracker';
import { WalletLedger } from './components/Wallet/WalletLedger';
import { DepositModal } from './components/Wallet/DepositModal';
import { ContactModal } from './components/Support/ContactModal';
import { KYCModal } from './components/KYCModal';
import { PriceAlertModal } from './components/ForexTerminal/PriceAlertModal';
import { BettingArena } from './components/Betting/BettingArena';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AuthModal } from './components/Auth/AuthModal';
import { Footer } from './components/Footer';
import { CheckCircle2, AlertCircle, Info, Sparkles, TrendingUp, Share2, Smartphone, Monitor } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, notification, selectedAsset } = useApp();
  const [terminalLayout, setTerminalLayout] = React.useState<'quick' | 'pro'>('quick');

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100">
      {/* Toast Notification Container */}
      {notification && (
        <div className="fixed top-16 right-4 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2.5 text-xs font-medium ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-emerald-500/40 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-red-950 border-red-500/40 text-red-200'
                : 'bg-neutral-900 border-neutral-700 text-neutral-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <Header />

      {/* Regulatory & Risk Banner */}
      <RiskBanner />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            {/* View Mode Switcher: Screenshot Quick Binary vs Pro Desktop */}
            <div className="flex items-center justify-between pb-1 text-xs">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-900/80 rounded-lg border border-neutral-800">
                <button
                  onClick={() => setTerminalLayout('quick')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                    terminalLayout === 'quick'
                      ? 'bg-[#00c853] text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Quick Binary Dashboard</span>
                </button>
                <button
                  onClick={() => setTerminalLayout('pro')}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                    terminalLayout === 'pro'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Pro Multi-Chart Terminal</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[11px]">
                <span>Active Instrument:</span>
                <span className="font-bold text-white">{selectedAsset.symbol}</span>
              </div>
            </div>

            {terminalLayout === 'quick' ? (
              <div className="space-y-8">
                {/* Reference Screenshot Dashboard View */}
                <div className="flex justify-center">
                  <MobileTerminalView />
                </div>

                {/* Trading Education & Strategy Tutorials */}
                <div className="pt-6 border-t border-neutral-900">
                  <TradingEducationSection />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Account Metrics Bar */}
                <AccountMetricsBar />

                {/* 3-Column Trading Terminal Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  {/* Left Column: Watchlist & Quotes (3 cols) */}
                  <div className="lg:col-span-3 min-h-[520px] lg:h-[680px]">
                    <AssetWatchlist />
                  </div>

                  {/* Center Column: Interactive Chart & Real-Time Market Sentiment (6 cols) */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="h-[440px]">
                      <TradingViewChart />
                    </div>
                    <MarketSentiment />
                  </div>

                  {/* Right Column: Order Entry & Risk Management (3 cols) */}
                  <div className="lg:col-span-3 min-h-[520px]">
                    <OrderEntryPanel />
                  </div>
                </div>

                {/* Bottom Row: Positions & Trade History */}
                <PositionsTable />

                {/* Trading Education Section */}
                <TradingEducationSection />
              </div>
            )}
          </div>
        )}

        {activeTab === 'betting' && <BettingArena />}

        {activeTab === 'boosting' && <BoostingCatalog />}

        {activeTab === 'campaigns' && <CampaignBundles />}

        {activeTab === 'orders' && <OrderTracker />}

        {activeTab === 'wallet' && <WalletLedger />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <DepositModal />
      <ContactModal />
      <KYCModal />
      <PriceAlertModal />
      <AuthModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
