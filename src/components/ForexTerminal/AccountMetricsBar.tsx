import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Briefcase,
  TrendingUp,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AccountMetricsBar: React.FC = () => {
  const {
    accountType,
    setAccountType,
    currentBalance,
    equity,
    floatingPnl,
    usedMargin,
    freeMargin,
    marginLevel,
    formatMoney,
    resetDemoBalance,
    setIsDepositModalOpen,
    positions,
    closedTrades,
  } = useApp();

  // Filter positions and trades strictly by active account mode
  const currentPositions = positions.filter((p) => p.accountType === accountType && p.status === 'OPEN');
  const currentClosedTrades = closedTrades.filter((t) => t.accountType === accountType);

  // Calculate Today's Realized Profit/Loss
  const todayRealizedPnl = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startTimestamp = startOfDay.getTime();

    return currentClosedTrades
      .filter((t) => (t.closedAt || t.timestamp) >= startTimestamp)
      .reduce((sum, t) => sum + t.pnl, 0);
  }, [currentClosedTrades]);

  // Total Trading History Stats
  const totalLifetimeRealizedPnl = useMemo(() => {
    return currentClosedTrades.reduce((sum, t) => sum + t.pnl, 0);
  }, [currentClosedTrades]);

  const winningTradesCount = currentClosedTrades.filter((t) => t.pnl > 0).length;
  const winRate =
    currentClosedTrades.length > 0
      ? ((winningTradesCount / currentClosedTrades.length) * 100).toFixed(1)
      : '0.0';

  const isOpenPnlPositive = floatingPnl >= 0;
  const isTodayPnlPositive = todayRealizedPnl >= 0;
  const isTotalPnlPositive = totalLifetimeRealizedPnl >= 0;

  return (
    <div className="space-y-2">
      {/* Top Dashboard Metrics Grid */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-lg text-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {/* 1. Selected Account Mode */}
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
              Account Mode
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                  accountType === 'demo'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {accountType === 'demo' ? (
                  <>
                    <FlaskConical className="w-3 h-3 text-amber-400" />
                    <span>Demo (Virtual)</span>
                  </>
                ) : (
                  <>
                    <Briefcase className="w-3 h-3 text-emerald-400" />
                    <span>Real (Live)</span>
                  </>
                )}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 block truncate">
              {accountType === 'demo' ? 'Risk-Free Virtual Capital' : 'Live Verified Capital'}
            </span>
          </div>

          {/* 2. Available Balance */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
              Available Balance
            </span>
            <div className="text-base font-extrabold text-white tabular-nums tracking-tight">
              {formatMoney(currentBalance)}
            </div>
            <span className="text-[10px] text-neutral-500 block">
              {accountType === 'demo' ? 'Virtual Reserves' : 'Settled Cash'}
            </span>
          </div>

          {/* 3. Equity */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
              Account Equity
            </span>
            <div className="text-base font-bold text-white tabular-nums tracking-tight">
              {formatMoney(equity)}
            </div>
            <span className="text-[10px] text-neutral-500 block">
              Margin Level: <span className="font-mono text-neutral-300">{marginLevel > 998 ? '∞' : `${marginLevel.toFixed(1)}%`}</span>
            </span>
          </div>

          {/* 4. Open-Position Profit or Loss */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
              Open Positions P&amp;L
            </span>
            <div
              className={`text-base font-bold tabular-nums flex items-center gap-1 ${
                isOpenPnlPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isOpenPnlPositive ? '+' : ''}
              {formatMoney(floatingPnl)}
            </div>
            <span className="text-[10px] text-neutral-400">
              {currentPositions.length} Active {currentPositions.length === 1 ? 'Trade' : 'Trades'}
            </span>
          </div>

          {/* 5. Today's Realized Profit or Loss */}
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
              Today's Realized P&amp;L
            </span>
            <div
              className={`text-base font-bold tabular-nums flex items-center gap-1 ${
                isTodayPnlPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isTodayPnlPositive ? '+' : ''}
              {formatMoney(todayRealizedPnl)}
            </div>
            <span className="text-[10px] text-neutral-500">
              Closed Today: {currentClosedTrades.filter((t) => (t.closedAt || t.timestamp) >= new Date().setHours(0,0,0,0)).length}
            </span>
          </div>

          {/* 6. Total Trading History Summary */}
          <div className="space-y-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold block">
                Total History P&amp;L
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1 rounded">
                Win {winRate}%
              </span>
            </div>
            <div
              className={`text-base font-bold tabular-nums flex items-center gap-1 ${
                isTotalPnlPositive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isTotalPnlPositive ? '+' : ''}
              {formatMoney(totalLifetimeRealizedPnl)}
            </div>
            <span className="text-[10px] text-neutral-400">
              {currentClosedTrades.length} Total Trades Logged
            </span>
          </div>
        </div>
      </div>

      {/* Real Account Risk & Fee Disclosure Banner */}
      {accountType === 'real' && (
        <div className="p-2.5 bg-neutral-950 border border-amber-500/30 rounded-lg flex items-start gap-2 text-[11px] text-neutral-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Real Account Execution Notice:</strong> Financial contract prices are sourced from verified liquidity feeds. Leveraged positions carry financial risk. Applicable spreads: 0.8–2.5 pips. Withdrawals subject to Kenyan regulatory KYC validation.
          </div>
        </div>
      )}
    </div>
  );
};
