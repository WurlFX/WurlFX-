import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  TrendingUp,
  Layers,
  BarChart3,
  Sliders,
  DollarSign,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  HelpCircle,
} from 'lucide-react';

interface TourStep {
  id: string;
  section: 'quick' | 'pro';
  sectionTitle: string;
  title: string;
  description: string;
  highlightText: string;
  icon: React.ReactNode;
  tips: string[];
}

const TOUR_STEPS: TourStep[] = [
  // --- PART 1: QUICK BINARY DASHBOARD ---
  {
    id: 'quick-overview',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Welcome to Quick Binary Trading',
    description:
      'WurlFX Quick Binary mode delivers lightning-fast, high-yield options contracts inspired by the Kenyan market. Place rapid predictions with payouts up to 92% in 30 seconds.',
    highlightText: 'Fast-paced, mobile-first binary interface with instant contract resolution.',
    icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Switch between Quick Binary and Pro Terminal anytime at the top bar.',
      'Practice risk-free using virtual practice reserves before risking real cash.',
    ],
  },
  {
    id: 'quick-pair-select',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Select Currency & Profit Rate',
    description:
      'Choose high-liquidity currency pairs like EUR/USD (92% payout), GBP/USD (88%), or USD/KES. The payout percentage shows your direct profit multiplier on winning contracts.',
    highlightText: 'Current Payout: 92% profit return (KSh 100 stake returns KSh 192).',
    icon: <DollarSign className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Major pairs during London/New York overlap offer the most dynamic price action.',
      'Kenyan Shilling (USD/KES) reflects local central bank and Forex market moves.',
    ],
  },
  {
    id: 'quick-chart-view',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Live Rapid-Tick Price Chart',
    description:
      'Watch every tick stream in real time with high-contrast candlesticks, moving averages, and real-time market sentiment bars showing how other Kenyan traders are betting.',
    highlightText: 'Zero-latency price feed with candle timers and live open-interest sentiment.',
    icon: <BarChart3 className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Green candles indicate upward bullish momentum; red candles indicate selling pressure.',
      'Look for consecutive trend patterns before picking expiration directions.',
    ],
  },
  {
    id: 'quick-timer-select',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Contract Expiration Duration',
    description:
      'Select how long your binary position stays active: 30 seconds (ultra-fast), 1 minute (balanced), 2 minutes, or 5 minutes (trend ride).',
    highlightText: 'Flexible contract durations ranging from 30 seconds to 5 minutes.',
    icon: <Compass className="w-5 h-5 text-emerald-400" />,
    tips: [
      '30-second timers are perfect for quick scalp moves on strong breakouts.',
      '5-minute timers give trends more breathing room to develop.',
    ],
  },
  {
    id: 'quick-stake-calc',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Stake Amount & Profit Calculator',
    description:
      'Enter your desired stake in KES (minimum KSh 50). The instant return calculator automatically calculates your net profit and total expected payout upon expiration.',
    highlightText: 'Transparent returns: Never hidden fees or misleading payout math.',
    icon: <Sliders className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Start with smaller stakes (e.g. KSh 50 - KSh 200) to refine your timing.',
      'Use the quick "+100", "+500", "+1,000" buttons for rapid bet configuration.',
    ],
  },
  {
    id: 'quick-call-put',
    section: 'quick',
    sectionTitle: 'Quick Binary Dashboard',
    title: 'Execute: Higher (Call) or Lower (Put)',
    description:
      'If you anticipate the price will be HIGHER than the current level when the timer expires, hit HIGHER (Call). If you anticipate it will be LOWER, hit LOWER (Put). Contracts settle automatically into your balance.',
    highlightText: 'One-tap execution with instant server-stamped position ID.',
    icon: <ArrowUpRight className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Green Button = HIGHER (Call) prediction.',
      'Red Button = LOWER (Put) prediction.',
      'Winning rounds credit immediately with sound notification and toast alert.',
    ],
  },

  // --- PART 2: PRO MULTI-CHART TERMINAL ---
  {
    id: 'pro-overview',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Switching to Pro Multi-Chart Terminal',
    description:
      'For institutional and technical forex traders, the Pro Terminal brings full MT4/MT5 style desktop power right into your browser. Features 3-column analysis, advanced technical indicators, and real-time order risk management.',
    highlightText: 'Professional FX workstation engineered for multi-timeframe analysis.',
    icon: <Monitor className="w-5 h-5 text-sky-400" />,
    tips: [
      'Tailored for both mobile landscape and desktop multi-monitor workflows.',
      'Enables true lot-sizing (0.01 to 5.0 lots) and custom leverage up to 1:500.',
    ],
  },
  {
    id: 'pro-watchlist',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Asset Watchlist & Screener',
    description:
      'Browse and search across 4 distinct asset classes: Forex Majors (EUR/USD, GBP/USD, USD/JPY), African Exotics (USD/KES), Commodities (Gold XAU/USD), and Crypto (BTC/USD). Monitor real-time bid/ask spreads and 24h highs/lows.',
    highlightText: 'Live bid-ask spread tracking with instant one-click instrument selection.',
    icon: <Layers className="w-5 h-5 text-sky-400" />,
    tips: [
      'Click any asset in the watchlist to instantly update the technical chart and order panel.',
      'USD/KES displays live local Kenyan currency pricing with narrow banking spreads.',
    ],
  },
  {
    id: 'pro-chart-tech',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Multi-Indicator Technical Chart',
    description:
      'Analyze historical price action with Candlesticks, Mountain Area, Heikin-Ashi, and OHLC Bars. Toggle EMA 9, EMA 21, Bollinger Bands (20,2), Volume bars, and the Relative Strength Index (RSI 14) sub-pane.',
    highlightText: 'Multi-chart display styles with live crosshair tooltips and sub-pane oscillator.',
    icon: <BarChart3 className="w-5 h-5 text-sky-400" />,
    tips: [
      'Use the top chart toolbar to switch timeframes (1m, 5m, 15m, 1h, 1d).',
      'Toggle Bollinger Bands to identify market volatility contractions and expansions.',
    ],
  },
  {
    id: 'pro-sentiment',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Market Sentiment & Community Stance',
    description:
      'Gauge live retail trader positioning with the WurlFX Sentiment Index. See the exact percentage of Kenyan and global traders holding Bullish vs Bearish positions, and cast your own community vote.',
    highlightText: 'Aggregated positioning data updated live with every opened position.',
    icon: <Sparkles className="w-5 h-5 text-amber-400" />,
    tips: [
      'Extreme sentiment readings (e.g. 80%+ Bullish) often act as contrarian signals.',
      'Click Bullish or Bearish to cast your sentiment vote for the active instrument.',
    ],
  },
  {
    id: 'pro-order-risk',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Institutional Order Entry Panel',
    description:
      'Configure exact trade sizes in standard micro-lots (0.01 lot = $1,000 notional) up to 5.0 lots. Choose flexible leverage (1:50 to 1:500) and set strict Stop-Loss (SL) and Take-Profit (TP) price protection before firing BUY or SELL orders.',
    highlightText: 'Server-enforced risk management with live margin required and pip value readouts.',
    icon: <Sliders className="w-5 h-5 text-sky-400" />,
    tips: [
      'Always enter a Stop-Loss to safeguard capital against volatile economic news spikes.',
      'The margin preview shows exactly how much equity is locked for the trade.',
    ],
  },
  {
    id: 'pro-metrics-bar',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Account Metrics & Margin Health',
    description:
      'Monitor your financial health across Balance, Floating Equity, Used Margin, Free Margin, and Margin Level %. The dynamic color-coded gauge warns you if margin level falls near liquidation thresholds.',
    highlightText: 'Real-time equity recalculation on every tick with health status badge.',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Keep Margin Level above 200% for safe risk exposure.',
      'Switch between Virtual Practice reserves and Live Real Funds anytime from the header.',
    ],
  },
  {
    id: 'pro-positions-history',
    section: 'pro',
    sectionTitle: 'Pro Multi-Chart Terminal',
    title: 'Positions Table & Trade History Log',
    description:
      'Track all open trades with live PnL, quick Stop-Loss/Take-Profit edit modals, and emergency "Close All" protection. Toggle to the "Trade History" tab to view closed trades, win rate stats, and export your official trade ledger to CSV.',
    highlightText: 'Comprehensive audit ledger with CSV export for tax and trading journal records.',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    tips: [
      'Click the "Trade History" tab to analyze your closed positions and net PnL.',
      'Use the "Export CSV" button to download your trading statements for review.',
    ],
  },
];

export const InteractiveGuidedTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen, terminalLayout, setTerminalLayout, setActiveTab } = useApp();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = TOUR_STEPS[currentStepIndex];

  // Sync terminal layout when the user steps into quick vs pro
  useEffect(() => {
    if (!isTourOpen) return;
    if (step.section !== terminalLayout) {
      setTerminalLayout(step.section);
    }
  }, [currentStepIndex, isTourOpen, step.section, terminalLayout, setTerminalLayout]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, currentStepIndex]);

  if (!isTourOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    setIsTourOpen(false);
  };

  const jumpToSection = (section: 'quick' | 'pro') => {
    const targetIdx = TOUR_STEPS.findIndex((s) => s.section === section);
    if (targetIdx !== -1) {
      setCurrentStepIndex(targetIdx);
      setTerminalLayout(section);
      setActiveTab('terminal');
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-lg w-full p-6 text-neutral-100 shadow-2xl relative space-y-4">
        {/* Top Header & Section Switchers */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  WurlFX Interactive Tour
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    step.section === 'quick'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {step.sectionTitle}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Step {currentStepIndex + 1} of {TOUR_STEPS.length} ({progressPercent}% complete)
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Exit Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Jump Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-medium">
          <button
            onClick={() => jumpToSection('quick')}
            className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              step.section === 'quick'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Quick Binary Tour (1-6)</span>
          </button>
          <button
            onClick={() => jumpToSection('pro')}
            className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              step.section === 'pro'
                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Pro Terminal Tour (7-13)</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden border border-neutral-800">
          <div
            className={`h-full transition-all duration-300 ${
              step.section === 'quick' ? 'bg-emerald-400' : 'bg-sky-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="space-y-3.5 py-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div>
              <h4 className="text-base font-bold text-white leading-tight">
                {step.title}
              </h4>
              <p className="text-[11px] text-neutral-400">
                {step.highlightText}
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
            {step.description}
          </p>

          {/* Pro Tips Box */}
          <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800 space-y-1.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Trader Tips &amp; Best Practices</span>
            </span>
            <ul className="space-y-1">
              {step.tips.map((tip, idx) => (
                <li key={idx} className="text-[11px] text-neutral-400 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step Navigation Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? s.section === 'quick'
                    ? 'w-6 bg-emerald-400'
                    : 'w-6 bg-sky-400'
                  : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
              }`}
              title={`Go to step ${idx + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1.5"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1 transition-colors ${
                currentStepIndex === 0
                  ? 'border-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                step.section === 'quick'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                  : 'bg-sky-500 hover:bg-sky-400 text-neutral-950'
              }`}
            >
              <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish & Trade' : 'Next Step'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
