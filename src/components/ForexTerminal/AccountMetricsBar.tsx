import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const AccountMetricsBar: React.FC = () => {
  const {
    accountType,
    currentBalance,
    equity,
    floatingPnl,
    usedMargin,
    freeMargin,
    marginLevel,
    formatMoney,
    resetDemoBalance,
    setIsDepositModalOpen,
  } = useApp();

  const isPnlPositive = floatingPnl >= 0;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
        {/* Balance */}
        <div className="space-y-0.5">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Balance
          </div>
          <div className="text-sm font-bold text-white tabular-nums">
            {formatMoney(currentBalance)}
          </div>
        </div>

        {/* Equity */}
        <div className="space-y-0.5">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Equity
          </div>
          <div className="text-sm font-bold text-white tabular-nums">
            {formatMoney(equity)}
          </div>
        </div>

        {/* Floating P&L */}
        <div className="space-y-0.5">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Floating P&amp;L
          </div>
          <div
            className={`text-sm font-bold tabular-nums flex items-center gap-1 ${
              isPnlPositive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isPnlPositive ? '+' : ''}
            {formatMoney(floatingPnl)}
          </div>
        </div>

        {/* Used Margin */}
        <div className="space-y-0.5">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Used Margin
          </div>
          <div className="text-sm font-semibold text-neutral-300 tabular-nums">
            {formatMoney(usedMargin)}
          </div>
        </div>

        {/* Free Margin */}
        <div className="space-y-0.5">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
            Free Margin
          </div>
          <div className="text-sm font-semibold text-neutral-200 tabular-nums">
            {formatMoney(freeMargin)}
          </div>
        </div>

        {/* Margin Level % & Account Action */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="space-y-0.5">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">
              Margin Level
            </div>
            <div
              className={`text-sm font-bold tabular-nums ${
                marginLevel > 300
                  ? 'text-emerald-400'
                  : marginLevel > 100
                  ? 'text-amber-400'
                  : 'text-red-400'
              }`}
            >
              {marginLevel > 998 ? '∞' : `${marginLevel.toFixed(1)}%`}
            </div>
          </div>

          <div className="ml-auto">
            {accountType === 'demo' ? (
              <button
                onClick={resetDemoBalance}
                className="px-2.5 py-1 text-[11px] font-medium bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 rounded flex items-center gap-1 transition-colors"
                title="Reset to $10,000 virtual capital"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset $10K</span>
              </button>
            ) : (
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="px-2.5 py-1 text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded transition-colors"
              >
                + Top Up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
