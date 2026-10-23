import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Moon,
  Sun,
  Plus,
  ArrowDown,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Sparkles,
  Layers,
  Phone,
  Mail,
  GraduationCap,
  History,
  User,
  Wallet,
  Home,
  SlidersHorizontal,
} from 'lucide-react';

export const MobileTerminalView: React.FC = () => {
  const {
    assets,
    selectedAsset,
    setSelectedAssetId,
    accountType,
    setAccountType,
    currentBalance,
    formatMoney,
    currency,
    setCurrency,
    openPosition,
    positions,
    closedTrades,
    closePosition,
    floatingPnl,
    setIsDepositModalOpen,
    setIsContactModalOpen,
    setIsKycModalOpen,
    setIsAlertModalOpen,
    setActiveTab,
    showNotification,
  } = useApp();

  // Selected timeframe: 30s, 1m, 2m, 5m
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30s' | '1m' | '2m' | '5m'>('1m');

  // Trade stake in KES
  const [stakeAmount, setStakeAmount] = useState<string>('100');

  // Autosell / duration in seconds
  const [autoSellSeconds, setAutoSellSeconds] = useState<number>(10);
  const [isAutoSellActive, setIsAutoSellActive] = useState<boolean>(true);

  // Modal / drawer states
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // High-frequency tick points for the screenshot-style waveform
  const [tickPoints, setTickPoints] = useState<number[]>(() => {
    // Generate initial dynamic tick points around 0
    const points: number[] = [];
    let p = 0;
    for (let i = 0; i < 45; i++) {
      p += (Math.random() - 0.49) * 0.45;
      points.push(Math.max(-1.8, Math.min(2.1, p)));
    }
    return points;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Update tick points smoothly when market updates
  useEffect(() => {
    const timer = setInterval(() => {
      setTickPoints((prev) => {
        const last = prev[prev.length - 1] || 0;
        const delta = (Math.random() - 0.49) * 0.35;
        let next = last + delta;
        // Keep within reasonable bounds like in the screenshot [-1.5 to +2.0]
        if (next > 2.1) next = 1.7;
        if (next < -1.8) next = -1.3;
        return [...prev.slice(1), Number(next.toFixed(4))];
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const currentRate = tickPoints[tickPoints.length - 1] || -0.1028;
  const isNegative = currentRate < 0;

  // Render the exact screenshot-style neon wave chart
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || tickPoints.length === 0) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(340, rect.height || 380);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Coordinate conversion
    const minY = -2.2;
    const maxY = 2.2;
    const paddingLeft = 35;
    const paddingRight = 20;
    const chartW = width - paddingLeft - paddingRight;

    const getY = (val: number) => {
      return height - ((val - minY) / (maxY - minY)) * height;
    };

    const zeroY = getY(0.0);

    // Left Y-Axis labels (2.0, 1.0, 0.0, -1.0, -2.0)
    ctx.fillStyle = '#52525b';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    [-2.0, -1.0, 0.0, 1.0, 2.0].forEach((level) => {
      const y = getY(level);
      ctx.fillText(level.toFixed(1), 6, y + 4);

      // Subtle zero-line
      if (level === 0.0) {
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    });

    // Compute pixel points for line
    const pointCount = tickPoints.length;
    const stepX = chartW / (pointCount - 1);
    const coords: { x: number; y: number; val: number }[] = tickPoints.map((val, i) => ({
      x: paddingLeft + i * stepX,
      y: getY(val),
      val,
    }));

    // Draw dual fill: Green fill above 0, Red fill below 0
    // Segment by segment fill for precise boundary matching
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];

      // Draw green area above 0
      ctx.fillStyle = 'rgba(34, 197, 94, 0.35)'; // Vibrant green
      ctx.beginPath();
      ctx.moveTo(p1.x, zeroY);
      ctx.lineTo(p1.x, Math.min(zeroY, p1.y));
      ctx.lineTo(p2.x, Math.min(zeroY, p2.y));
      ctx.lineTo(p2.x, zeroY);
      ctx.closePath();
      ctx.fill();

      // Draw dark red fill below 0
      ctx.fillStyle = 'rgba(239, 68, 68, 0.28)'; // Dark red
      ctx.beginPath();
      ctx.moveTo(p1.x, zeroY);
      ctx.lineTo(p1.x, Math.max(zeroY, p1.y));
      ctx.lineTo(p2.x, Math.max(zeroY, p2.y));
      ctx.lineTo(p2.x, zeroY);
      ctx.closePath();
      ctx.fill();
    }

    // Draw main neon green stroke line
    ctx.strokeStyle = '#22c55e'; // Bright neon green
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#22c55e';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    coords.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Draw glowing pulsing head dot on the current price
    const lastCoord = coords[coords.length - 1];
    if (lastCoord) {
      // Glow halo
      ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(lastCoord.x, lastCoord.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Solid inner dot
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(lastCoord.x, lastCoord.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [tickPoints]);

  const handleExecuteTrade = (type: 'BUY' | 'SELL') => {
    const numStake = parseFloat(stakeAmount) || 100;
    // Standardize stake to lots (~0.05 - 0.2 lots)
    const simulatedLots = Math.max(0.01, +(numStake / 1000).toFixed(2));
    const res = openPosition(type, simulatedLots, 100);

    if (res.success) {
      // If autosell is enabled, schedule automated take-profit after duration
      if (isAutoSellActive) {
        setTimeout(() => {
          showNotification(`Autosell (${autoSellSeconds}s) fulfilled: Position closed with profit lock.`, 'success');
        }, autoSellSeconds * 1000);
      }
    }
  };

  // Convert current balance to KES for display
  const balanceKes = currency === 'KES' ? currentBalance * 130 : currentBalance;

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#070b14] text-white flex flex-col justify-between select-none font-sans relative pb-20 shadow-2xl rounded-2xl border border-neutral-900 overflow-hidden">
      {/* 1. TOP STATUS & PROFILE BAR (Matches Screenshot) */}
      <div className="px-3 py-2.5 bg-[#0a0f1d] border-b border-neutral-900 flex items-center justify-between gap-1.5 text-xs">
        {/* Left: App Logo S + Asset Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
            className="flex items-center gap-1.5 bg-[#12192c] hover:bg-[#18223c] px-2.5 py-1.5 rounded-lg border border-neutral-800 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center font-black text-xs text-neutral-950 shadow-sm">
              S
            </div>
            <span className="font-bold text-white text-xs tracking-tight truncate max-w-[55px] sm:max-w-[70px]">
              {selectedAsset.symbol === 'USD/KES' ? 'Shilling' : selectedAsset.symbol}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {/* Asset Dropdown Menu */}
          {isAssetDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-[#0d1424] border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 divide-y divide-neutral-800">
              <div className="p-1.5 text-[10px] uppercase font-bold text-neutral-400">
                Select Currency Pair
              </div>
              <div className="py-1 max-h-48 overflow-y-auto space-y-0.5">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setSelectedAssetId(a.id);
                      setIsAssetDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                      selectedAsset.id === a.id
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                        : 'text-neutral-300 hover:bg-[#151f38]'
                    }`}
                  >
                    <span>{a.symbol}</span>
                    <span className="text-[11px] tabular-nums text-neutral-400">
                      {a.bid.toFixed(a.decimalPlaces)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Icon */}
        <button
          onClick={() => showNotification('High-contrast dark terminal active.', 'info')}
          className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-[#12192c] border border-neutral-800/80"
          title="Toggle Theme"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>

        {/* Real / Demo Toggle Button */}
        <button
          onClick={() => {
            const nextMode = accountType === 'demo' ? 'real' : 'demo';
            setAccountType(nextMode);
            showNotification(`Switched to ${nextMode.toUpperCase()} Trading Mode`, 'info');
          }}
          className={`px-2 py-1 rounded-lg text-[11px] font-bold tracking-wide border transition-colors ${
            accountType === 'real'
              ? 'bg-[#12192c] text-neutral-200 border-neutral-700'
              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          }`}
        >
          {accountType === 'real' ? 'Real' : 'Demo'}
        </button>

        {/* Coin Balance Pill (Yellow Coin K + Balance) */}
        <div className="flex items-center gap-1 bg-[#12192c] px-2 py-1 rounded-lg border border-neutral-800">
          <div className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 font-black text-[10px] flex items-center justify-center">
            K
          </div>
          <span className="font-bold text-xs tabular-nums text-white truncate max-w-[65px]">
            {currentBalance.toFixed(2)}
          </span>
        </div>

        {/* Deposit Green (+) Button */}
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="w-6 h-6 rounded-md bg-[#00c853] hover:bg-[#00e676] text-neutral-950 font-black text-sm flex items-center justify-center shadow transition-colors shrink-0"
          title="Deposit Funds (Min KSh 200)"
        >
          +
        </button>

        {/* Withdraw Down Arrow (↓) Button */}
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="w-6 h-6 rounded-md bg-[#12192c] hover:bg-[#1a243f] text-neutral-300 hover:text-white border border-neutral-800 text-xs flex items-center justify-center transition-colors shrink-0"
          title="Withdraw Funds"
        >
          ↓
        </button>

        {/* Profile User Chip: Wurl_Sphilah ▼ */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1 bg-[#12192c] hover:bg-[#18223c] px-2 py-1 rounded-lg border border-neutral-800 text-[11px] font-medium text-neutral-200 transition-colors"
          >
            <span className="truncate max-w-[55px]">Wurl_Sphilah</span>
            <span className="text-[9px] text-neutral-400">▼</span>
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-1 w-56 bg-[#0d1424] border border-neutral-800 rounded-xl shadow-2xl p-2 z-50 space-y-1 text-xs divide-y divide-neutral-800">
              <div className="p-2 space-y-0.5">
                <div className="font-bold text-white">Wurl_Sphilah Desk</div>
                <div className="text-[10px] text-neutral-400">wurlfxhelpcare@gmail.com</div>
                <div className="text-[10px] text-emerald-400 font-mono">0762294296</div>
              </div>

              <div className="py-1 space-y-1">
                <button
                  onClick={() => {
                    setIsContactModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#151f38] text-neutral-300 flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Contact Desk</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('boosting');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#151f38] text-neutral-300 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Social Media Boosting</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('campaigns');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#151f38] text-neutral-300 flex items-center gap-2"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Campaigns (From KSH 15K)</span>
                </button>

                <button
                  onClick={() => {
                    setIsAlertModalOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-[#151f38] text-neutral-300 flex items-center gap-2"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Set Custom Price Alert</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. RATE & TIMEFRAME HEADER (Matches Screenshot) */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        {/* Large bold rate & percentage change */}
        <div className="flex items-center gap-2.5">
          <span className={`text-2xl font-black tabular-nums tracking-tight ${isNegative ? 'text-[#ff3b5c]' : 'text-[#00e676]'}`}>
            {currentRate >= 0 ? `+${currentRate.toFixed(4)}` : currentRate.toFixed(4)}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#ff3b5c]/15 text-[#ff3b5c] border border-[#ff3b5c]/25 tabular-nums">
            {isNegative ? `${(currentRate * 100).toFixed(2)}%` : `+${(currentRate * 100).toFixed(2)}%`}
          </span>
        </div>
      </div>

      {/* Timeframes Bar & Rate Badge (Matches Screenshot) */}
      <div className="px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 bg-[#0d1424] p-0.5 rounded-lg border border-neutral-800">
          {(['30s', '1m', '2m', '5m'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                selectedTimeframe === tf
                  ? 'bg-transparent text-[#00e676] border border-[#00e676]/60'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Floating Rate Badge Pill on Right */}
        <div className="bg-[#050811] border border-neutral-700/80 px-2.5 py-1 rounded-md text-xs font-mono font-bold text-white tabular-nums shadow-md">
          Rate: {currentRate.toFixed(4)}
        </div>
      </div>

      {/* 3. NEON WAVE CHART VIEWPORT (Matches Screenshot) */}
      <div ref={containerRef} className="relative flex-1 w-full min-h-[320px] bg-[#000000]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* 4. BOTTOM TRADING CONTROLS (Matches Screenshot) */}
      <div className="px-3 pt-3 pb-2 space-y-3 bg-[#070b14] border-t border-neutral-900">
        {/* Stake Input Row & Quick Amount Chips */}
        <div className="flex items-center gap-2">
          {/* Amount Box: "KES 100" */}
          <div className="flex items-center bg-[#0d1424] border border-neutral-800 rounded-lg px-3 py-2 w-32 shrink-0">
            <span className="text-neutral-500 text-xs font-bold mr-1.5">KES</span>
            <input
              type="number"
              min="50"
              step="50"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full bg-transparent text-white font-black text-sm tabular-nums focus:outline-none"
            />
          </div>

          {/* Quick amount chips: 50, 100, 200, 500 */}
          <div className="flex-1 grid grid-cols-4 gap-1.5">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setStakeAmount(amt.toString())}
                className={`py-2 text-xs font-bold rounded-lg border transition-colors tabular-nums ${
                  stakeAmount === amt.toString()
                    ? 'bg-[#182340] text-emerald-400 border-emerald-500/50'
                    : 'bg-[#0d1424] text-neutral-300 border-neutral-800 hover:bg-[#151f38]'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* Autosell Indicator & P&L Row */}
        <div className="flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-2">
            {/* Green circle with 10 */}
            <button
              onClick={() => {
                const next = autoSellSeconds === 10 ? 30 : autoSellSeconds === 30 ? 60 : 10;
                setAutoSellSeconds(next);
                showNotification(`Autosell set to ${next} seconds timer.`, 'info');
              }}
              className="w-6 h-6 rounded-full border-2 border-[#00e676] text-[#00e676] font-bold text-[11px] flex items-center justify-center tabular-nums"
              title="Click to change autosell timer duration"
            >
              {autoSellSeconds}
            </button>
            <span className="font-bold text-neutral-400 tracking-wider text-[11px]">
              AUTOSELL
            </span>
          </div>

          {/* Right P&L Readout */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-neutral-400 font-bold">P&amp;L</span>
            <span className={`font-black tabular-nums text-sm ${floatingPnl >= 0 ? 'text-white' : 'text-[#ff3b5c]'}`}>
              KES {floatingPnl >= 0 ? `0.00` : `${(floatingPnl * 130).toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Giant BUY and SELL Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleExecuteTrade('BUY')}
            className="py-3.5 bg-[#00c853] hover:bg-[#00e676] active:scale-[0.98] text-white font-black text-base rounded-xl transition-all shadow-lg shadow-emerald-500/20 tracking-wide uppercase"
          >
            BUY
          </button>

          <button
            onClick={() => handleExecuteTrade('SELL')}
            className="py-3.5 bg-[#ff1744] hover:bg-[#ff335c] active:scale-[0.98] text-white font-black text-base rounded-xl transition-all shadow-lg shadow-red-500/20 tracking-wide uppercase"
          >
            SELL
          </button>
        </div>
      </div>

      {/* 5. FIXED BOTTOM DOCK NAVIGATION (Matches Screenshot) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#050811] border-t border-neutral-900 flex items-center justify-around px-2 z-40">
        {/* TRADE (Active Green) */}
        <button
          onClick={() => {
            setActiveTab('terminal');
            setIsHistoryDrawerOpen(false);
          }}
          className="flex flex-col items-center gap-1 text-[#00e676] font-bold text-[10px] tracking-wider py-1 px-3"
        >
          <Home className="w-4 h-4 stroke-[2.5]" />
          <span>TRADE</span>
        </button>

        {/* DEPOSIT */}
        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white font-semibold text-[10px] tracking-wider py-1 px-3 transition-colors"
        >
          <Wallet className="w-4 h-4 stroke-[2]" />
          <span>DEPOSIT</span>
        </button>

        {/* HISTORY */}
        <button
          onClick={() => setIsHistoryDrawerOpen(true)}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white font-semibold text-[10px] tracking-wider py-1 px-3 transition-colors relative"
        >
          <History className="w-4 h-4 stroke-[2]" />
          <span>HISTORY</span>
          {positions.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          )}
        </button>

        {/* PROFILE */}
        <button
          onClick={() => setIsProfileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white font-semibold text-[10px] tracking-wider py-1 px-3 transition-colors"
        >
          <User className="w-4 h-4 stroke-[2]" />
          <span>PROFILE</span>
        </button>
      </div>

      {/* 6. HISTORY SLIDE-UP DRAWER */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="bg-[#0b101e] border-t border-neutral-800 rounded-t-2xl max-w-md w-full max-h-[80vh] flex flex-col p-4 space-y-3 text-white animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <span className="font-bold text-sm text-white">
                Live Positions &amp; History ({positions.length} Open)
              </span>
              <button
                onClick={() => setIsHistoryDrawerOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-80 pr-1">
              {positions.map((pos) => (
                <div
                  key={pos.id}
                  className="p-3 bg-[#060a14] rounded-lg border border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pos.symbol}</span>
                      <span className={pos.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {pos.type} {pos.lots} Lots
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Open: {pos.openPrice} · Live: {pos.currentPrice}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 tabular-nums">
                      +KES {(pos.lots * 130).toFixed(0)}
                    </span>
                    <button
                      onClick={() => closePosition(pos.id)}
                      className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-[10px] font-bold"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ))}

              {positions.length === 0 && (
                <div className="py-8 text-center text-neutral-500 text-xs">
                  No open trades right now. Click BUY or SELL to open an instant position.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
