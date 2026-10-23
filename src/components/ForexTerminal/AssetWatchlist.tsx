import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, TrendingUp, TrendingDown, Bell, BellRing, Sparkles, CheckCircle2 } from 'lucide-react';
import { ForexAsset } from '../../types';

export const AssetWatchlist: React.FC = () => {
  const { assets, selectedAsset, setSelectedAssetId, setIsAlertModalOpen, priceAlerts } = useApp();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  // Default to 'alert' so clicking any asset row triggers the PriceAlertModal directly
  const [rowAction, setRowAction] = useState<'alert' | 'chart'>('alert');

  const categories = ['All', 'Forex Majors', 'Exotics', 'Commodities', 'Crypto'];

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
      asset.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || asset.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRowClick = (asset: ForexAsset) => {
    setSelectedAssetId(asset.id);
    if (rowAction === 'alert') {
      setIsAlertModalOpen(true);
    }
  };

  const handleOpenAlertDirect = (e: React.MouseEvent, asset: ForexAsset) => {
    e.stopPropagation();
    setSelectedAssetId(asset.id);
    setIsAlertModalOpen(true);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col h-full overflow-hidden">
      {/* Search Header */}
      <div className="p-3 border-b border-neutral-800 bg-neutral-900/40 space-y-2.5">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search forex or commodities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row Action Mode & Notification Indicator */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[10px]">
          <div className="flex items-center gap-1 text-neutral-400">
            <Bell className="w-3 h-3 text-emerald-400" />
            <span>Row click:</span>
          </div>

          <div className="flex items-center bg-neutral-900 rounded p-0.5 border border-neutral-800">
            <button
              onClick={() => setRowAction('alert')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                rowAction === 'alert'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Clicking any asset row triggers the Price Alert modal"
            >
              Set Price Alert 🔔
            </button>
            <button
              onClick={() => setRowAction('chart')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                rowAction === 'chart'
                  ? 'bg-neutral-800 text-white border border-neutral-700 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Clicking an asset row switches the active chart view"
            >
              Chart Only
            </button>
          </div>
        </div>
      </div>

      {/* Asset Quotes Table */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
        <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] uppercase font-semibold text-neutral-500 bg-neutral-950 sticky top-0 z-10 border-b border-neutral-800/80">
          <div className="col-span-5">Symbol</div>
          <div className="col-span-3 text-right">Bid / Ask</div>
          <div className="col-span-2 text-right">24h</div>
          <div className="col-span-2 text-right">Alert</div>
        </div>

        {filteredAssets.map((asset) => {
          const isSelected = selectedAsset.id === asset.id;
          const isPositive = asset.change24h >= 0;
          const activeAlertsForAsset = priceAlerts.filter(
            (a) => a.symbol === asset.symbol && a.isActive
          );

          return (
            <div
              key={asset.id}
              onClick={() => handleRowClick(asset)}
              className={`w-full text-left px-3 py-2 grid grid-cols-12 items-center text-xs transition-colors cursor-pointer group ${
                isSelected
                  ? 'bg-neutral-800/80 border-l-2 border-emerald-400'
                  : 'hover:bg-neutral-900/70'
              }`}
              title={
                rowAction === 'alert'
                  ? `Click to set custom price alert for ${asset.symbol}`
                  : `Click to view ${asset.symbol} chart`
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleRowClick(asset);
                }
              }}
            >
              {/* Symbol & Spread */}
              <div className="col-span-5 pr-1">
                <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
                  <span>{asset.symbol}</span>
                  {activeAlertsForAsset.length > 0 && (
                    <span
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      title={`${activeAlertsForAsset.length} active price alert${
                        activeAlertsForAsset.length > 1 ? 's' : ''
                      }`}
                    >
                      <Bell className="w-2.5 h-2.5" />
                      {activeAlertsForAsset.length}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                  <span>Spr: {asset.spread}</span>
                  {asset.symbol === 'USD/KES' && (
                    <span className="text-emerald-400 font-medium">· Local KES</span>
                  )}
                </div>
              </div>

              {/* Bid & Ask Prices */}
              <div className="col-span-3 text-right tabular-nums pr-1">
                <div className="text-neutral-200 font-medium">
                  {asset.bid.toFixed(asset.decimalPlaces)}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {asset.ask.toFixed(asset.decimalPlaces)}
                </div>
              </div>

              {/* 24h Change */}
              <div className="col-span-2 text-right tabular-nums">
                <span
                  className={`inline-flex items-center text-[11px] font-medium ${
                    isPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {asset.change24h}%
                </span>
              </div>

              {/* Dedicated Set Alert Action Button */}
              <div className="col-span-2 text-right pl-1">
                <button
                  type="button"
                  onClick={(e) => handleOpenAlertDirect(e, asset)}
                  className={`p-1.5 rounded transition-all inline-flex items-center justify-center ${
                    activeAlertsForAsset.length > 0
                      ? 'text-amber-300 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30'
                      : 'text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800 group-hover:text-emerald-400'
                  }`}
                  title={`Set custom price alert for ${asset.symbol}`}
                >
                  {activeAlertsForAsset.length > 0 ? (
                    <BellRing className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                  ) : (
                    <Bell className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filteredAssets.length === 0 && (
          <div className="p-6 text-center text-xs text-neutral-500">
            No market symbols matching &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {/* Footer Helper Note */}
      <div className="px-3 py-2 bg-neutral-900/60 border-t border-neutral-800 text-[10px] text-neutral-400 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span>Click row to arm custom price alert</span>
        </span>
        <button
          onClick={() => setIsAlertModalOpen(true)}
          className="text-emerald-400 hover:underline font-medium"
        >
          View All Alerts ({priceAlerts.filter((a) => a.isActive).length})
        </button>
      </div>
    </div>
  );
};
