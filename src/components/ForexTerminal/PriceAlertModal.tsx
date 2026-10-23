import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Volume2,
  Smartphone,
  Radio,
} from 'lucide-react';

export const PriceAlertModal: React.FC = () => {
  const {
    isAlertModalOpen,
    setIsAlertModalOpen,
    assets,
    selectedAsset,
    priceAlerts,
    addPriceAlert,
    deletePriceAlert,
    togglePriceAlert,
    pushPermission,
    requestPushPermission,
    markAlertsAsRead,
  } = useApp();

  const [targetSymbol, setTargetSymbol] = useState<string>(selectedAsset.symbol);
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [tab, setTab] = useState<'create' | 'list'>('create');

  useEffect(() => {
    if (isAlertModalOpen) {
      setTargetSymbol(selectedAsset.symbol);
      setTab('create');
    }
  }, [isAlertModalOpen, selectedAsset.symbol]);

  if (!isAlertModalOpen) return null;

  const currentAsset = assets.find((a) => a.symbol === targetSymbol) || selectedAsset;

  // Set quick offset relative to current price
  const handleSetOffsetPips = (pips: number) => {
    const offset = pips / currentAsset.pipMultiplier;
    const newTarget = +(currentAsset.bid + offset).toFixed(currentAsset.decimalPlaces);
    setTargetPrice(newTarget.toString());
    if (offset >= 0) {
      setCondition('ABOVE');
    } else {
      setCondition('BELOW');
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(targetPrice);
    if (!parsedPrice || parsedPrice <= 0) return;

    addPriceAlert(currentAsset.symbol, parsedPrice, condition, note.trim() || undefined);
    setTargetPrice('');
    setNote('');
    setTab('list');
  };

  const activeAlerts = priceAlerts.filter((a) => a.isActive);
  const triggeredAlerts = priceAlerts.filter((a) => !a.isActive);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-5 text-neutral-100 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Currency Price Threshold Alerts
              </h3>
              <p className="text-[11px] text-neutral-400">
                Audible &amp; native push notifications when market levels hit
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAlertModalOpen(false);
              markAlertsAsRead();
            }}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Browser Push Permission Banner */}
        <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-semibold text-white block">
                Native Push Notifications
              </span>
              <span className="text-[11px] text-neutral-400">
                {pushPermission === 'granted'
                  ? 'Active · System notifications enabled'
                  : pushPermission === 'denied'
                  ? 'Blocked in browser · In-app chime active'
                  : 'Receive push alerts even if tab is unfocused'}
              </span>
            </div>
          </div>

          {pushPermission !== 'granted' && pushPermission !== 'unsupported' && (
            <button
              onClick={requestPushPermission}
              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded transition-colors whitespace-nowrap"
            >
              Enable Push
            </button>
          )}

          {pushPermission === 'granted' && (
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Enabled</span>
            </span>
          )}
        </div>

        {/* Sub-tabs: Set New Alert vs Manage Alerts */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setTab('create')}
            className={`py-1.5 font-bold rounded transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'create'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Alert</span>
          </button>
          <button
            onClick={() => setTab('list')}
            className={`py-1.5 font-bold rounded transition-colors flex items-center justify-center gap-1.5 ${
              tab === 'list'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Active Alerts ({activeAlerts.length})</span>
          </button>
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreate} className="space-y-4 text-xs">
            {/* Currency Pair selector */}
            <div className="space-y-1">
              <label className="text-neutral-300 font-medium block">
                Currency Pair / Asset
              </label>
              <select
                value={targetSymbol}
                onChange={(e) => {
                  setTargetSymbol(e.target.value);
                  setTargetPrice('');
                }}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.symbol}>
                    {a.symbol} — {a.name} (Bid: {a.bid.toFixed(a.decimalPlaces)})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Price Banner */}
            <div className="bg-neutral-950/70 p-2.5 rounded border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Current Market Bid:</span>
              <div className="font-bold tabular-nums text-white text-sm">
                {currentAsset.bid.toFixed(currentAsset.decimalPlaces)}
              </div>
            </div>

            {/* Threshold Condition */}
            <div className="space-y-1">
              <label className="text-neutral-300 font-medium block">
                Trigger Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCondition('ABOVE')}
                  className={`p-2.5 rounded border text-left flex items-center gap-2 transition-colors ${
                    condition === 'ABOVE'
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs">Price &ge; Target</div>
                    <div className="text-[10px] text-neutral-400">Crosses Above</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCondition('BELOW')}
                  className={`p-2.5 rounded border text-left flex items-center gap-2 transition-colors ${
                    condition === 'BELOW'
                      ? 'bg-red-500/10 border-red-500 text-red-400 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="text-xs">Price &le; Target</div>
                    <div className="text-[10px] text-neutral-400">Crosses Below</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Target Price Input & Quick Pips Offsets */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-medium block">
                  Target Price Level
                </label>
                <span className="text-[11px] text-neutral-500">
                  Spread: {currentAsset.spread} pips
                </span>
              </div>

              <input
                type="number"
                step="any"
                required
                placeholder={`e.g. ${(currentAsset.bid * 1.002).toFixed(currentAsset.decimalPlaces)}`}
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-sm font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
              />

              {/* Quick Pip Offset chips */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-neutral-500">Presets:</span>
                {[+10, +25, +50, -10, -25, -50].map((pips) => (
                  <button
                    key={pips}
                    type="button"
                    onClick={() => handleSetOffsetPips(pips)}
                    className="px-2 py-0.5 text-[10px] rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition-colors tabular-nums"
                  >
                    {pips > 0 ? `+${pips}p` : `${pips}p`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Memo/Note */}
            <div className="space-y-1">
              <label className="text-neutral-300 font-medium block">
                Alert Note / Trading Plan (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Resistance test, look for short entry or close buy"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Arm Price Alert</span>
            </button>
          </form>
        ) : (
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
            {/* Active alerts */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                Armed Alerts ({activeAlerts.length})
              </div>

              {activeAlerts.map((alert) => {
                const asset = assets.find((a) => a.symbol === alert.symbol);
                const currentPrice = asset ? asset.bid : alert.initialPrice;
                const pipsAway = asset
                  ? ((alert.targetPrice - currentPrice) * asset.pipMultiplier).toFixed(1)
                  : '0';

                return (
                  <div
                    key={alert.id}
                    className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg flex items-center justify-between text-xs hover:border-neutral-700 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{alert.symbol}</span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                            alert.condition === 'ABOVE' ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {alert.condition === 'ABOVE' ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          <span>{alert.condition === 'ABOVE' ? '≥' : '≤'}</span>
                          <span className="tabular-nums">
                            {alert.targetPrice.toFixed(asset?.decimalPlaces || 4)}
                          </span>
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                        <span>Current: {currentPrice.toFixed(asset?.decimalPlaces || 4)}</span>
                        <span>·</span>
                        <span className="tabular-nums text-neutral-300">
                          {pipsAway} pips away
                        </span>
                      </div>

                      {alert.note && (
                        <div className="text-[10px] text-neutral-500 italic">
                          &ldquo;{alert.note}&rdquo;
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePriceAlert(alert.id)}
                        className="px-2 py-1 text-[11px] rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
                        title="Toggle alert on/off"
                      >
                        Active
                      </button>
                      <button
                        onClick={() => deletePriceAlert(alert.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-900"
                        title="Delete alert"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {activeAlerts.length === 0 && (
                <div className="py-6 text-center text-neutral-500 text-xs">
                  No active price alerts armed. Create one above to get notified!
                </div>
              )}
            </div>

            {/* Triggered History */}
            {triggeredAlerts.length > 0 && (
              <div className="space-y-2 pt-3 border-t border-neutral-800">
                <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Triggered History
                </div>

                {triggeredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 bg-neutral-950/50 border border-neutral-800/60 rounded text-xs flex items-center justify-between text-neutral-400 opacity-75"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-semibold text-neutral-200">{alert.symbol}</span>
                        <span>hit {alert.targetPrice}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleTimeString() : 'Earlier'}
                      </div>
                    </div>

                    <button
                      onClick={() => deletePriceAlert(alert.id)}
                      className="p-1 text-neutral-600 hover:text-neutral-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
