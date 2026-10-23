import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Info,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getDefaultSentiment } from '../../data/mockData';

export const MarketSentiment: React.FC = () => {
  const {
    selectedAsset,
    setSelectedAssetId,
    assets,
    voteSentiment,
  } = useApp();

  const [hasVoted, setHasVoted] = useState<Record<string, 'bull' | 'bear'>>({});
  const [showInfo, setShowInfo] = useState(false);

  // Retrieve sentiment for active selected asset, or fallback
  const sentiment =
    selectedAsset.sentiment || getDefaultSentiment(selectedAsset.symbol);

  const bullPct = sentiment.bullPercent;
  const bearPct = sentiment.bearPercent;

  // Stance color mapping
  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'Strong Bullish':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Bullish':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Strong Bearish':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Bearish':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  const handleVote = (stance: 'bull' | 'bear') => {
    voteSentiment(selectedAsset.symbol, stance);
    setHasVoted((prev) => ({ ...prev, [selectedAsset.symbol]: stance }));
  };

  const userVote = hasVoted[selectedAsset.symbol];

  // Quick switch popular pairs
  const quickPairs = ['eurusd', 'usdkes', 'xauusd', 'gbpusd', 'usdjpy', 'btcusd'];

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3.5 space-y-3 text-xs">
      {/* Top Header & Pair Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <BarChart3 className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs tracking-tight">
                Market Sentiment &amp; Bull/Bear Flow
              </span>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-neutral-500 hover:text-neutral-300"
                title="About Sentiment Indicators"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="text-[10px] text-neutral-400">
              Live aggregate retail &amp; institutional open positions ratio
            </div>
          </div>
        </div>

        {/* Quick pair switcher pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px]">
          {quickPairs.map((pairId) => {
            const asset = assets.find((a) => a.id === pairId);
            if (!asset) return null;
            const isSelected = selectedAsset.id === asset.id;
            return (
              <button
                key={pairId}
                onClick={() => setSelectedAssetId(pairId)}
                className={`px-2 py-0.5 rounded font-mono font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-neutral-800 text-emerald-400 font-bold border border-neutral-700'
                    : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                }`}
              >
                {asset.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {showInfo && (
        <div className="p-2.5 bg-neutral-900/80 rounded border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed space-y-1">
          <div className="font-semibold text-white">How Sentiment Works:</div>
          <p className="text-neutral-400">
            Bull/Bear Ratio measures real-time open buyer vs. seller position volume on WurlFX and liquidity partner feeds. Ratios above 70% indicate extreme bullish sentiment where reversal risks increase; ratios below 30% indicate extreme bearish sentiment.
          </p>
        </div>
      )}

      {/* Main Bull / Bear Meter Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          {/* Bullish Side */}
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 tabular-nums">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-sm">{bullPct.toFixed(1)}%</span>
            <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Bulls (Long)
            </span>
          </div>

          {/* Stance Badge */}
          <div
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStanceColor(
              sentiment.stance
            )}`}
          >
            {sentiment.stance}
          </div>

          {/* Bearish Side */}
          <div className="flex items-center gap-1.5 font-bold text-red-400 tabular-nums">
            <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
              Bears (Short)
            </span>
            <span className="text-sm">{bearPct.toFixed(1)}%</span>
            <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-neutral-900 border border-neutral-800 flex relative">
          {/* Bull Bar */}
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 relative"
            style={{ width: `${bullPct}%` }}
          />
          {/* Bear Bar */}
          <div
            className="h-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-700 relative"
            style={{ width: `${bearPct}%` }}
          />
          {/* Center 50% Marker */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-950/80 -translate-x-1/2 z-10" />
        </div>
      </div>

      {/* Numerical Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
            Long Volume
          </span>
          <span className="font-bold text-emerald-400 tabular-nums">
            {sentiment.longVolumeLots.toLocaleString()} Lots
          </span>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
            Short Volume
          </span>
          <span className="font-bold text-red-400 tabular-nums">
            {sentiment.shortVolumeLots.toLocaleString()} Lots
          </span>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
            Active Positions
          </span>
          <span className="font-bold text-white tabular-nums">
            {sentiment.totalPositionsCount.toLocaleString()}
          </span>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">
            Net Daily Flow
          </span>
          <span
            className={`font-bold tabular-nums ${
              bullPct >= 50 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {bullPct >= 50 ? '+' : '-'}
            {Math.abs(bullPct - 50).toFixed(1)}% {bullPct >= 50 ? 'Inflow' : 'Outflow'}
          </span>
        </div>
      </div>

      {/* Community Sentiment Vote Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-neutral-500" />
          <span>
            Community Poll: {sentiment.communityVotes.bull} Bullish · {sentiment.communityVotes.bear} Bearish
          </span>
        </div>

        {/* 1-Click Sentiment Vote Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleVote('bull')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              userVote === 'bull'
                ? 'bg-emerald-500 text-neutral-950 font-extrabold'
                : 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>Bullish</span>
          </button>

          <button
            onClick={() => handleVote('bear')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1 ${
              userVote === 'bear'
                ? 'bg-red-500 text-white font-extrabold'
                : 'bg-neutral-900 hover:bg-neutral-800 text-red-400 border border-red-500/30'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
            <span>Bearish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
