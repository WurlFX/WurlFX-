import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { BetSlipItem, SportsMatch } from '../../types';
import {
  Plane,
  Flame,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Trophy,
  History,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ShieldCheck,
  TrendingUp,
  X,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const BettingArena: React.FC = () => {
  const {
    accountType,
    currentBalance,
    formatMoney,
    currency,
    sportsMatches,
    betSlip,
    addToBetSlip,
    removeFromBetSlip,
    clearBetSlip,
    placeSportsBet,
    placeAviatorBet,
    cashoutAviatorBet,
    recordAviatorRoundCrash,
    aviatorHistory,
    settledBets,
    setIsDepositModalOpen,
    showNotification,
  } = useApp();

  // Mode switcher: Aviator Crash vs Sports Fixtures vs My Bets
  const [activeView, setActiveView] = useState<'aviator' | 'sports' | 'history'>('aviator');

  // --- AVIATOR GAME ENGINE STATE ---
  const [gameState, setGameState] = useState<'WAITING' | 'FLYING' | 'CRASHED'>('WAITING');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [countdown, setCountdown] = useState<number>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // User Bet 1 state
  const [stake1, setStake1] = useState<string>('200');
  const [autoCashoutActive1, setAutoCashoutActive1] = useState<boolean>(false);
  const [autoCashoutVal1, setAutoCashoutVal1] = useState<string>('2.00');
  const [myBet1, setMyBet1] = useState<{ id: string; stake: number; cashedOut: boolean; winAmount: number } | null>(null);

  // User Bet 2 state (Dual bet option)
  const [stake2, setStake2] = useState<string>('100');
  const [autoCashoutActive2, setAutoCashoutActive2] = useState<boolean>(false);
  const [autoCashoutVal2, setAutoCashoutVal2] = useState<string>('1.50');
  const [myBet2, setMyBet2] = useState<{ id: string; stake: number; cashedOut: boolean; winAmount: number } | null>(null);

  // Live Simulated Kenyan Community Players
  const [livePlayers, setLivePlayers] = useState<Array<{ name: string; stake: number; cashout?: number; won?: boolean }>>([
    { name: 'Otieno_K', stake: 500, cashout: 1.84, won: true },
    { name: 'Wanjiku_NBO', stake: 250, cashout: 2.15, won: true },
    { name: 'Mwangi_Trader', stake: 1000, cashout: undefined, won: false },
    { name: 'Sphilah_W', stake: 1500, cashout: 3.40, won: true },
    { name: 'Kamau_Win', stake: 100, cashout: undefined, won: false },
    { name: 'Achieng_254', stake: 300, cashout: 1.45, won: true },
    { name: 'Kipchoge_Runner', stake: 2000, cashout: undefined, won: false },
  ]);

  // Sports Betting Stake state
  const [sportsStakeInput, setSportsStakeInput] = useState<string>('500');
  const [selectedSportFilter, setSelectedSportFilter] = useState<'all' | 'live' | 'kpl' | 'epl' | 'ucl'>('all');

  // Audio Synthesizer for Aviator
  const playSoundEffect = useCallback((type: 'fly' | 'cashout' | 'crash' | 'tick') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'tick') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'cashout') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } else if (type === 'crash') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.46);
      }
    } catch (e) {
      // Audio context blocked
    }
  }, [soundEnabled]);

  // Round target crash generator
  const targetCrashMultiplierRef = useRef<number>(2.45);

  // Main Aviator Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'WAITING') {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Determine crash point using provably fair pseudo-random algorithm
            const r = Math.random();
            let crashVal = 1.05;
            if (r < 0.08) {
              crashVal = 1.05 + Math.random() * 0.15; // 1.05 - 1.20
            } else if (r < 0.6) {
              crashVal = 1.2 + Math.random() * 1.6; // 1.20 - 2.80
            } else if (r < 0.88) {
              crashVal = 2.8 + Math.random() * 4.2; // 2.80 - 7.00
            } else {
              crashVal = 7.0 + Math.random() * 18.0; // 7.00 - 25.00
            }
            targetCrashMultiplierRef.current = parseFloat(crashVal.toFixed(2));

            // Reset community players
            setLivePlayers([
              { name: 'Otieno_K', stake: Math.floor(Math.random() * 800 + 100), won: false },
              { name: 'Wanjiku_NBO', stake: Math.floor(Math.random() * 500 + 50), won: false },
              { name: 'Mwangi_Trader', stake: Math.floor(Math.random() * 1500 + 200), won: false },
              { name: 'Sphilah_W', stake: Math.floor(Math.random() * 2000 + 500), won: false },
              { name: 'Kamau_Win', stake: Math.floor(Math.random() * 300 + 100), won: false },
              { name: 'Achieng_254', stake: Math.floor(Math.random() * 600 + 150), won: false },
            ]);

            setGameState('FLYING');
            setMultiplier(1.0);
            return 5;
          }
          playSoundEffect('tick');
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'FLYING') {
      const startTime = Date.now();
      const crashAt = targetCrashMultiplierRef.current;

      interval = setInterval(() => {
        const elapsedSec = (Date.now() - startTime) / 1000;
        // Exponential growth curve: 1 + 0.06 * t^1.75
        const nextMult = parseFloat((1.0 + Math.pow(elapsedSec * 0.72, 1.6)).toFixed(2));

        if (nextMult >= crashAt) {
          setMultiplier(crashAt);
          setGameState('CRASHED');
          playSoundEffect('crash');
          recordAviatorRoundCrash(crashAt);

          // Mark remaining active user bets as lost
          if (myBet1 && !myBet1.cashedOut) {
            setMyBet1(null);
          }
          if (myBet2 && !myBet2.cashedOut) {
            setMyBet2(null);
          }

          // Restart cycle after 4 seconds
          setTimeout(() => {
            setMyBet1(null);
            setMyBet2(null);
            setGameState('WAITING');
            setCountdown(5);
          }, 3800);
        } else {
          setMultiplier(nextMult);

          // Check Auto-Cashout Bet 1
          if (myBet1 && !myBet1.cashedOut && autoCashoutActive1) {
            const autoTarget = parseFloat(autoCashoutVal1);
            if (autoTarget && nextMult >= autoTarget) {
              handleCashOut(1, nextMult);
            }
          }

          // Check Auto-Cashout Bet 2
          if (myBet2 && !myBet2.cashedOut && autoCashoutActive2) {
            const autoTarget = parseFloat(autoCashoutVal2);
            if (autoTarget && nextMult >= autoTarget) {
              handleCashOut(2, nextMult);
            }
          }

          // Randomly trigger community players cashouts
          setLivePlayers((prev) =>
            prev.map((p) => {
              if (!p.won && Math.random() < 0.08 && nextMult > 1.25) {
                return { ...p, cashout: nextMult, won: true };
              }
              return p;
            })
          );
        }
      }, 75);
    }

    return () => clearInterval(interval);
  }, [
    gameState,
    autoCashoutActive1,
    autoCashoutVal1,
    autoCashoutActive2,
    autoCashoutVal2,
    myBet1,
    myBet2,
    recordAviatorRoundCrash,
    playSoundEffect,
  ]);

  // Place Bet handler for Aviator
  const handlePlaceAviatorBet = (betNumber: 1 | 2) => {
    const stake = betNumber === 1 ? parseFloat(stake1) : parseFloat(stake2);
    if (!stake || stake < 10) {
      showNotification('Minimum stake is KSh 10.', 'error');
      return;
    }

    const autoCashout =
      betNumber === 1 && autoCashoutActive1
        ? parseFloat(autoCashoutVal1)
        : betNumber === 2 && autoCashoutActive2
        ? parseFloat(autoCashoutVal2)
        : undefined;

    const res = placeAviatorBet(stake, autoCashout);
    if (res.success && res.betId) {
      if (betNumber === 1) {
        setMyBet1({ id: res.betId, stake, cashedOut: false, winAmount: 0 });
      } else {
        setMyBet2({ id: res.betId, stake, cashedOut: false, winAmount: 0 });
      }
      showNotification(`Bet ${betNumber} placed: KSh ${stake.toLocaleString()}`, 'success');
    } else {
      showNotification(res.message, 'error');
    }
  };

  // Cashout Bet handler
  const handleCashOut = (betNumber: 1 | 2, currentMult: number) => {
    const targetBet = betNumber === 1 ? myBet1 : myBet2;
    if (!targetBet || targetBet.cashedOut) return;

    const res = cashoutAviatorBet(targetBet.id, currentMult);
    if (res.success && res.payoutKes) {
      playSoundEffect('cashout');
      if (betNumber === 1) {
        setMyBet1((prev) => (prev ? { ...prev, cashedOut: true, winAmount: res.payoutKes! } : null));
      } else {
        setMyBet2((prev) => (prev ? { ...prev, cashedOut: true, winAmount: res.payoutKes! } : null));
      }
    }
  };

  // Sports Betting Calculations
  const totalSlipOdds = useMemo(() => {
    if (betSlip.length === 0) return 1.0;
    return parseFloat(betSlip.reduce((acc, it) => acc * it.odds, 1).toFixed(2));
  }, [betSlip]);

  const sportsStakeNum = parseFloat(sportsStakeInput) || 0;
  const grossWinningsKes = Math.round(sportsStakeNum * totalSlipOdds);
  const withholdingTaxKes = Math.round(Math.max(0, grossWinningsKes - sportsStakeNum) * 0.2); // 20% tax on net win (Kenyan regulation)
  const netEstimatedPayoutKes = grossWinningsKes - withholdingTaxKes;

  const handlePlaceSportsBetSlip = () => {
    if (sportsStakeNum < 20) {
      showNotification('Minimum sports bet stake is KSh 20.', 'error');
      return;
    }
    const res = placeSportsBet(sportsStakeNum);
    if (!res.success) {
      showNotification(res.message, 'error');
    }
  };

  const filteredMatches = useMemo(() => {
    return sportsMatches.filter((m) => {
      if (selectedSportFilter === 'live') return m.isLive;
      if (selectedSportFilter === 'kpl') return m.league.includes('FKF');
      if (selectedSportFilter === 'epl') return m.league.includes('Premier League') && !m.league.includes('FKF');
      if (selectedSportFilter === 'ucl') return m.league.includes('Champions');
      return true;
    });
  }, [sportsMatches, selectedSportFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Arena Sub-Navigation */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                WurlFX Betting Arena
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                Licensed Odds · Sprime Crash · Instant Payouts
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Kenyan Sports &amp; Sprime Arena
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Stakes are deducted automatically from your active treasury balance, and winnings credit immediately to your account ledger.
            </p>
          </div>

          {/* Navigation Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveView('aviator')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'aviator'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Plane className="w-4 h-4 text-white" />
              <span>Sprime Crash</span>
            </button>

            <button
              onClick={() => setActiveView('sports')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'sports'
                  ? 'bg-emerald-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Sports Betting</span>
              {betSlip.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-neutral-950 text-emerald-400 text-[10px] font-extrabold flex items-center justify-center">
                  {betSlip.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'history'
                  ? 'bg-neutral-800 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>My Bet Tickets ({settledBets.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: AVIATOR CRASH GAME (High Fidelity Simulation)                      */}
      {/* ========================================================================= */}
      {activeView === 'aviator' && (
        <div className="space-y-4">
          {/* Recent Multipliers Bar */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2.5 flex items-center justify-between gap-3 overflow-x-auto text-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                History:
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-0.5">
              {aviatorHistory.map((mult, idx) => {
                const isHigh = mult >= 10.0;
                const isMid = mult >= 2.0;
                return (
                  <span
                    key={idx}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono shrink-0 transition-transform hover:scale-105 ${
                      isHigh
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-500/50'
                        : isMid
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                        : 'bg-neutral-800 text-blue-300 border border-neutral-700'
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </span>
                );
              })}
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 shrink-0"
              title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>
          </div>

          {/* Main Aviator Canvas & Arena Display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Center: Flight Radar Box */}
            <div className="lg:col-span-8 bg-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 shadow-2xl">
              {/* Starry Sky Grid Canvas Background */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Status Indicator & Live Flight Multiplier */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      gameState === 'FLYING'
                        ? 'bg-emerald-400 animate-ping'
                        : gameState === 'WAITING'
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-xs font-bold text-neutral-300 tracking-wider uppercase font-mono">
                    {gameState === 'FLYING'
                      ? 'ROUND IN FLIGHT'
                      : gameState === 'WAITING'
                      ? `NEXT ROUND IN ${countdown}s`
                      : 'FLEW AWAY (CRASHED)'}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-400 bg-neutral-900/80 px-2.5 py-1 rounded-md border border-neutral-800">
                  Provably Fair · SHA-256 Verified
                </div>
              </div>

              {/* Center Multiplier Stage & Animated Plane */}
              <div className="relative z-10 my-auto text-center py-10">
                {gameState === 'WAITING' ? (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mx-auto animate-pulse">
                      <Plane className="w-8 h-8" />
                    </div>
                    <div className="text-xs text-neutral-400 font-medium">WAITING FOR NEXT TAKEOFF</div>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-wider font-mono">
                      00:0{countdown}
                    </div>
                    {/* Countdown bar */}
                    <div className="w-48 h-1.5 bg-neutral-900 rounded-full mx-auto overflow-hidden">
                      <div
                        className="h-full bg-rose-500 transition-all duration-1000"
                        style={{ width: `${(countdown / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : gameState === 'FLYING' ? (
                  <div className="space-y-2">
                    <div className="text-6xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight font-mono drop-shadow-[0_10px_20px_rgba(225,29,72,0.3)]">
                      {multiplier.toFixed(2)}<span className="text-rose-500">x</span>
                    </div>

                    {/* Animated ascending plane graphic */}
                    <div className="relative w-full max-w-md mx-auto h-24 overflow-visible">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                        <defs>
                          <linearGradient id="curveGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#e11d48" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        {/* Red glow curve */}
                        <path
                          d="M 10 90 Q 150 85, 270 20"
                          fill="none"
                          stroke="url(#curveGradient)"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Moving Red Jet Plane */}
                      <div
                        className="absolute transition-all duration-100 flex items-center gap-1.5"
                        style={{
                          left: `${Math.min(85, 15 + Math.min(70, (multiplier - 1) * 22))}%`,
                          bottom: `${Math.min(75, 10 + Math.min(65, (multiplier - 1) * 18))}%`,
                        }}
                      >
                        <div className="relative">
                          <Plane className="w-9 h-9 text-rose-500 -rotate-12 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)] animate-pulse" />
                          <Flame className="w-5 h-5 text-amber-400 absolute -left-3 top-2 -rotate-90 animate-bounce" />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">FLEW AWAY!</div>
                    <div className="text-6xl sm:text-7xl font-black text-rose-500 font-mono">
                      {multiplier.toFixed(2)}x
                    </div>
                    <p className="text-xs text-neutral-400">
                      Next flight takes off shortly. Prepare your bets.
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Radar Axis */}
              <div className="relative z-10 border-t border-neutral-900 pt-3 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span>0.0s TAKEOFF</span>
                <span>ALTITUDE CLIMB</span>
                <span>MAX 100.00x</span>
              </div>
            </div>

            {/* Right: Live Community Bets Feed */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      All Bets ({livePlayers.length + (myBet1 ? 1 : 0) + (myBet2 ? 1 : 0)})
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Total KSh: 8,450</span>
                </div>

                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {/* Current user's bet if active */}
                  {myBet1 && (
                    <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-emerald-400 flex items-center gap-1">
                          <span>YOU (Bet 1)</span>
                          <span className="text-[10px] px-1 bg-emerald-500/20 rounded">Active</span>
                        </div>
                        <div className="text-neutral-400 text-[11px]">Stake: KSh {myBet1.stake.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        {myBet1.cashedOut ? (
                          <span className="text-emerald-400 font-bold font-mono">
                            +{formatMoney(myBet1.winAmount / 130)}
                          </span>
                        ) : gameState === 'FLYING' ? (
                          <span className="text-white font-mono font-bold animate-pulse">
                            KSh {Math.round(myBet1.stake * multiplier).toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Simulated Kenyan Players */}
                  {livePlayers.map((player, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-neutral-300">{player.name}</div>
                        <div className="text-[10px] text-neutral-500">Stake: KSh {player.stake}</div>
                      </div>
                      <div className="text-right">
                        {player.won && player.cashout ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                              {player.cashout.toFixed(2)}x
                            </span>
                            <span className="font-bold text-white font-mono text-[11px]">
                              KSh {Math.round(player.stake * player.cashout).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-500">In Flight...</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Auto-Refresh Feed</span>
                <span className="text-emerald-400">Live Kenyan Server</span>
              </div>
            </div>
          </div>

          {/* Dual Betting Controls: Bet 1 & Bet 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Panel 1: BET 1 */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-extrabold">
                    1
                  </span>
                  Bet Panel 1
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-neutral-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCashoutActive1}
                      onChange={(e) => setAutoCashoutActive1(e.target.checked)}
                      className="rounded bg-neutral-950 border-neutral-700 text-rose-500 focus:ring-0"
                    />
                    <span>Auto Cash Out @</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.1"
                    disabled={!autoCashoutActive1}
                    value={autoCashoutVal1}
                    onChange={(e) => setAutoCashoutVal1(e.target.value)}
                    className="w-16 px-2 py-0.5 bg-neutral-950 border border-neutral-700 rounded text-xs font-mono text-white text-center disabled:opacity-40"
                  />
                  <span className="text-xs text-neutral-400">x</span>
                </div>
              </div>

              {/* Stake input & quick chips */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-7 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Stake (KSh)</span>
                    <span>Bal: {formatMoney(currentBalance)}</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={stake1}
                    onChange={(e) => setStake1(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg font-mono font-bold text-sm text-white"
                  />
                  {/* Preset chips */}
                  <div className="flex items-center gap-1 pt-0.5">
                    {[50, 100, 200, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStake1(preset.toString())}
                        className={`flex-1 py-1 text-[10px] font-mono rounded ${
                          stake1 === preset.toString()
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Action Button (BET vs CASHOUT) */}
                <div className="sm:col-span-5">
                  {myBet1 && !myBet1.cashedOut && gameState === 'FLYING' ? (
                    <button
                      type="button"
                      onClick={() => handleCashOut(1, multiplier)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-center shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center"
                    >
                      <span className="text-[11px] uppercase tracking-wider">CASH OUT</span>
                      <span className="text-base sm:text-lg font-mono font-extrabold">
                        KSh {Math.round(myBet1.stake * multiplier).toLocaleString()}
                      </span>
                    </button>
                  ) : myBet1 && myBet1.cashedOut ? (
                    <div className="w-full py-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-center text-xs flex flex-col items-center justify-center">
                      <span>CASHED OUT!</span>
                      <span className="font-mono text-sm">+KSh {myBet1.winAmount.toLocaleString()}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePlaceAviatorBet(1)}
                      disabled={gameState === 'FLYING' && !myBet1}
                      className={`w-full py-4 font-black rounded-xl text-center shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center ${
                        gameState === 'FLYING'
                          ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider">
                        {gameState === 'FLYING' ? 'WAIT NEXT ROUND' : 'BET'}
                      </span>
                      <span className="text-base font-mono font-extrabold">
                        KSh {parseFloat(stake1 || '0').toLocaleString()}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Panel 2: BET 2 */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-extrabold">
                    2
                  </span>
                  Bet Panel 2 (Hedging)
                </span>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-neutral-400 flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCashoutActive2}
                      onChange={(e) => setAutoCashoutActive2(e.target.checked)}
                      className="rounded bg-neutral-950 border-neutral-700 text-blue-500 focus:ring-0"
                    />
                    <span>Auto Cash Out @</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.1"
                    disabled={!autoCashoutActive2}
                    value={autoCashoutVal2}
                    onChange={(e) => setAutoCashoutVal2(e.target.value)}
                    className="w-16 px-2 py-0.5 bg-neutral-950 border border-neutral-700 rounded text-xs font-mono text-white text-center disabled:opacity-40"
                  />
                  <span className="text-xs text-neutral-400">x</span>
                </div>
              </div>

              {/* Stake input & quick chips */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-7 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Stake (KSh)</span>
                    <span>Bal: {formatMoney(currentBalance)}</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={stake2}
                    onChange={(e) => setStake2(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg font-mono font-bold text-sm text-white"
                  />
                  {/* Preset chips */}
                  <div className="flex items-center gap-1 pt-0.5">
                    {[50, 100, 200, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setStake2(preset.toString())}
                        className={`flex-1 py-1 text-[10px] font-mono rounded ${
                          stake2 === preset.toString()
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 font-bold'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        +{preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Action Button (BET vs CASHOUT) */}
                <div className="sm:col-span-5">
                  {myBet2 && !myBet2.cashedOut && gameState === 'FLYING' ? (
                    <button
                      type="button"
                      onClick={() => handleCashOut(2, multiplier)}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-center shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center"
                    >
                      <span className="text-[11px] uppercase tracking-wider">CASH OUT</span>
                      <span className="text-base sm:text-lg font-mono font-extrabold">
                        KSh {Math.round(myBet2.stake * multiplier).toLocaleString()}
                      </span>
                    </button>
                  ) : myBet2 && myBet2.cashedOut ? (
                    <div className="w-full py-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold rounded-xl text-center text-xs flex flex-col items-center justify-center">
                      <span>CASHED OUT!</span>
                      <span className="font-mono text-sm">+KSh {myBet2.winAmount.toLocaleString()}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePlaceAviatorBet(2)}
                      disabled={gameState === 'FLYING' && !myBet2}
                      className={`w-full py-4 font-black rounded-xl text-center shadow-lg transition-transform active:scale-95 flex flex-col items-center justify-center ${
                        gameState === 'FLYING'
                          ? 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <span className="text-xs uppercase tracking-wider">
                        {gameState === 'FLYING' ? 'WAIT NEXT ROUND' : 'BET'}
                      </span>
                      <span className="text-base font-mono font-extrabold">
                        KSh {parseFloat(stake2 || '0').toLocaleString()}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SPORTS FIXTURES & BET SLIP                                        */}
      {/* ========================================================================= */}
      {activeView === 'sports' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Matches Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Filter bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All Leagues' },
                { id: 'live', label: '🔴 Live Now' },
                { id: 'kpl', label: '🇰🇪 FKF Premier' },
                { id: 'epl', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
                { id: 'ucl', label: '⭐ UEFA Champions' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedSportFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    selectedSportFilter === f.id
                      ? 'bg-emerald-500 text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Matches list */}
            <div className="space-y-3">
              {filteredMatches.map((match) => {
                const matchTitle = `${match.homeTeam} vs ${match.awayTeam}`;
                const isHomeSelected = betSlip.some((b) => b.matchId === match.id && b.market === '1');
                const isDrawSelected = betSlip.some((b) => b.matchId === match.id && b.market === 'X');
                const isAwaySelected = betSlip.some((b) => b.matchId === match.id && b.market === '2');

                return (
                  <div
                    key={match.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 space-y-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-400 font-medium">{match.league}</span>
                        {match.isLive && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                            LIVE {match.score}
                          </span>
                        )}
                      </div>
                      <span className="text-neutral-500">{match.time}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Teams */}
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-white">{match.homeTeam}</div>
                        <div className="text-sm font-bold text-white">{match.awayTeam}</div>
                      </div>

                      {/* 1X2 Market Odds */}
                      <div className="grid grid-cols-3 gap-2 sm:w-72">
                        {/* 1: Home Win */}
                        <button
                          type="button"
                          onClick={() =>
                            addToBetSlip({
                              matchId: match.id,
                              matchTitle,
                              market: '1',
                              odds: match.odds.home,
                            })
                          }
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isHomeSelected
                              ? 'bg-emerald-500 text-neutral-950 font-extrabold border-emerald-400'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-emerald-500/50'
                          }`}
                        >
                          <span className="text-[10px] block opacity-70">1 (Home)</span>
                          <span className="text-xs font-mono font-bold">{match.odds.home.toFixed(2)}</span>
                        </button>

                        {/* X: Draw */}
                        <button
                          type="button"
                          onClick={() =>
                            addToBetSlip({
                              matchId: match.id,
                              matchTitle,
                              market: 'X',
                              odds: match.odds.draw,
                            })
                          }
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isDrawSelected
                              ? 'bg-emerald-500 text-neutral-950 font-extrabold border-emerald-400'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-emerald-500/50'
                          }`}
                        >
                          <span className="text-[10px] block opacity-70">X (Draw)</span>
                          <span className="text-xs font-mono font-bold">{match.odds.draw.toFixed(2)}</span>
                        </button>

                        {/* 2: Away Win */}
                        <button
                          type="button"
                          onClick={() =>
                            addToBetSlip({
                              matchId: match.id,
                              matchTitle,
                              market: '2',
                              odds: match.odds.away,
                            })
                          }
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isAwaySelected
                              ? 'bg-emerald-500 text-neutral-950 font-extrabold border-emerald-400'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-emerald-500/50'
                          }`}
                        >
                          <span className="text-[10px] block opacity-70">2 (Away)</span>
                          <span className="text-xs font-mono font-bold">{match.odds.away.toFixed(2)}</span>
                        </button>
                      </div>
                    </div>

                    {/* Secondary Markets: GG / Over 2.5 quick badges */}
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            addToBetSlip({
                              matchId: match.id,
                              matchTitle,
                              market: 'Over 2.5',
                              odds: match.odds.over25,
                            })
                          }
                          className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800"
                        >
                          Over 2.5: <span className="text-emerald-400 font-bold">{match.odds.over25}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            addToBetSlip({
                              matchId: match.id,
                              matchTitle,
                              market: 'GG',
                              odds: match.odds.gg,
                            })
                          }
                          className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800"
                        >
                          GG (Both Score): <span className="text-emerald-400 font-bold">{match.odds.gg}</span>
                        </button>
                      </div>

                      <span className="text-neutral-500">+48 Markets</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bet Slip Column (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 sticky top-20 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Bet Slip</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400">
                  {betSlip.length} Picks
                </span>
              </div>
              {betSlip.length > 0 && (
                <button
                  type="button"
                  onClick={clearBetSlip}
                  className="text-[11px] text-rose-400 hover:text-rose-300"
                >
                  Clear All
                </button>
              )}
            </div>

            {betSlip.length === 0 ? (
              <div className="py-12 text-center space-y-2 text-neutral-500">
                <Layers className="w-8 h-8 mx-auto opacity-50" />
                <p className="text-xs">Your bet slip is currently empty.</p>
                <p className="text-[11px] text-neutral-600">
                  Select match odds from the left to construct your accumulator.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* List of picks */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {betSlip.map((item) => (
                    <div
                      key={item.matchId}
                      className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs flex items-center justify-between"
                    >
                      <div className="space-y-0.5 max-w-[200px]">
                        <div className="font-bold text-white truncate">{item.matchTitle}</div>
                        <div className="text-emerald-400 font-medium">Market: {item.market}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{item.odds.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => removeFromBetSlip(item.matchId)}
                          className="text-neutral-500 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Slip Summary */}
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Total Combined Odds:</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {totalSlipOdds.toFixed(2)}x
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-300">
                      <span>Stake (KSh)</span>
                      <span className="text-[10px] text-neutral-400">Min KSh 20</span>
                    </div>
                    <input
                      type="number"
                      min="20"
                      step="50"
                      value={sportsStakeInput}
                      onChange={(e) => setSportsStakeInput(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm font-mono font-bold text-white"
                    />

                    {/* Presets */}
                    <div className="flex items-center gap-1 pt-1">
                      {[50, 100, 200, 500, 1000].map((pr) => (
                        <button
                          key={pr}
                          type="button"
                          onClick={() => setSportsStakeInput(pr.toString())}
                          className="flex-1 py-1 text-[10px] font-mono rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800"
                        >
                          {pr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Gross Payout:</span>
                      <span className="font-mono text-white">KSh {grossWinningsKes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-500">
                      <span>Withholding Tax (20% net):</span>
                      <span className="font-mono text-neutral-400">-KSh {withholdingTaxKes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-bold pt-1 border-t border-neutral-900">
                      <span>Net Est. Return:</span>
                      <span className="font-mono text-sm">KSh {netEstimatedPayoutKes.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Place Bet Button */}
                <button
                  type="button"
                  onClick={handlePlaceSportsBetSlip}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
                >
                  Place Bet (KSh {sportsStakeNum.toLocaleString()})
                </button>

                <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
                  Stakes deduct from your active treasury balance. Real-money betting is restricted to verified users 18+ under BCLB compliance.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: SETTLED & MY BETS HISTORY                                        */}
      {/* ========================================================================= */}
      {activeView === 'history' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">My Betting Tickets &amp; Audit Trail</h3>
              <p className="text-xs text-neutral-400">
                Immutable ledger of all Sprime crash cashouts and sports bet settlements.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {settledBets.length} Tickets Recorded
            </span>
          </div>

          <div className="space-y-3">
            {settledBets.map((bet) => (
              <div
                key={bet.id}
                className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        bet.type === 'aviator'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {bet.type === 'aviator' ? 'SPRIME' : bet.type.toUpperCase()}
                    </span>
                    <span className="font-mono text-neutral-500">{bet.id}</span>
                    <span className="text-neutral-500">· {new Date(bet.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="font-semibold text-white">{bet.description}</div>
                  <div className="text-neutral-400 text-[11px]">
                    Stake: <span className="text-white font-mono font-medium">KSh {bet.stakeKes.toLocaleString()}</span> · Odds: <span className="text-emerald-400 font-mono">{bet.oddsOrMultiplier}x</span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs font-bold font-mono">
                    {bet.status === 'WON' ? (
                      <span className="text-emerald-400">+KSh {bet.actualPayoutKes.toLocaleString()}</span>
                    ) : bet.status === 'OPEN' ? (
                      <span className="text-amber-400">Potential: KSh {bet.potentialPayoutKes.toLocaleString()}</span>
                    ) : (
                      <span className="text-rose-500">Lost (KSh 0)</span>
                    )}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    <span
                      className={
                        bet.status === 'WON'
                          ? 'text-emerald-400'
                          : bet.status === 'OPEN'
                          ? 'text-amber-400'
                          : 'text-rose-500'
                      }
                    >
                      ● {bet.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
