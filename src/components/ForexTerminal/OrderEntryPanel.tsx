import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

export const OrderEntryPanel: React.FC = () => {
  const {
    selectedAsset,
    openPosition,
    accountType,
    formatMoney,
    freeMargin,
    currency,
  } = useApp();

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [lots, setLots] = useState<number>(0.1);
  const [leverage, setLeverage] = useState<number>(100);
  const [enableSl, setEnableSl] = useState(false);
  const [enableTp, setEnableTp] = useState(false);
  const [slPrice, setSlPrice] = useState<string>('');
  const [tpPrice, setTpPrice] = useState<string>('');

  const currentBid = selectedAsset.bid;
  const currentAsk = selectedAsset.ask;

  // Initialize sensible SL/TP if toggled
  const handleToggleSl = (checked: boolean) => {
    setEnableSl(checked);
    if (checked && !slPrice) {
      const offset = (selectedAsset.spread * 15) / selectedAsset.pipMultiplier;
      const defaultSl = orderType === 'BUY' ? currentBid - offset : currentAsk + offset;
      setSlPrice(defaultSl.toFixed(selectedAsset.decimalPlaces));
    }
  };

  const handleToggleTp = (checked: boolean) => {
    setEnableTp(checked);
    if (checked && !tpPrice) {
      const offset = (selectedAsset.spread * 25) / selectedAsset.pipMultiplier;
      const defaultTp = orderType === 'BUY' ? currentAsk + offset : currentBid - offset;
      setTpPrice(defaultTp.toFixed(selectedAsset.decimalPlaces));
    }
  };

  // Margin calculation
  const notionalValueUsd = lots * 100000;
  const requiredMarginUsd = notionalValueUsd / leverage;
  const hasSufficientMargin = requiredMarginUsd <= freeMargin;

  const handleExecute = () => {
    const parsedSl = enableSl && slPrice ? parseFloat(slPrice) : undefined;
    const parsedTp = enableTp && tpPrice ? parseFloat(tpPrice) : undefined;

    openPosition(orderType, lots, leverage, parsedSl, parsedTp);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
        <div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Order Execution
          </span>
          <div className="text-[11px] text-neutral-400">
            {selectedAsset.symbol} · Instant Execution
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-neutral-500 uppercase">Available Margin</span>
          <div className="text-xs font-semibold tabular-nums text-emerald-400">
            {formatMoney(freeMargin)}
          </div>
        </div>
      </div>

      {/* Buy / Sell Tabs */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setOrderType('SELL')}
          className={`p-3 rounded-lg border text-left transition-all ${
            orderType === 'SELL'
              ? 'bg-red-500/15 border-red-500/60 text-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase flex items-center gap-1 text-red-400">
              <ArrowDownRight className="w-3.5 h-3.5" /> SELL (Short)
            </span>
          </div>
          <div className="text-sm font-bold tabular-nums text-white mt-1">
            {currentBid.toFixed(selectedAsset.decimalPlaces)}
          </div>
        </button>

        <button
          onClick={() => setOrderType('BUY')}
          className={`p-3 rounded-lg border text-left transition-all ${
            orderType === 'BUY'
              ? 'bg-emerald-500/15 border-emerald-500/60 text-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase flex items-center gap-1 text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" /> BUY (Long)
            </span>
          </div>
          <div className="text-sm font-bold tabular-nums text-white mt-1">
            {currentAsk.toFixed(selectedAsset.decimalPlaces)}
          </div>
        </button>
      </div>

      {/* Lot Size Stepper */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Volume (Lots)</span>
          <span className="text-[11px] text-neutral-500">
            Notional: ${(lots * 100000).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLots((prev) => Math.max(0.01, +(prev - 0.05).toFixed(2)))}
            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-300 font-bold text-xs"
          >
            -
          </button>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="20"
            value={lots}
            onChange={(e) => setLots(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
            className="flex-1 text-center py-1.5 bg-neutral-900 border border-neutral-800 rounded text-sm font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={() => setLots((prev) => +(prev + 0.05).toFixed(2))}
            className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-neutral-300 font-bold text-xs"
          >
            +
          </button>
        </div>

        {/* Quick lot chips */}
        <div className="flex items-center gap-1 pt-1">
          {[0.01, 0.05, 0.1, 0.5, 1.0].map((preset) => (
            <button
              key={preset}
              onClick={() => setLots(preset)}
              className={`flex-1 py-1 text-[10px] rounded transition-colors ${
                lots === preset
                  ? 'bg-neutral-800 text-emerald-400 font-semibold'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Leverage Selector */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Leverage</span>
          <span className="text-[11px] text-neutral-500">Margin: 1:{leverage}</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[50, 100, 200, 500].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`py-1 text-xs rounded border transition-colors ${
                leverage === lev
                  ? 'bg-neutral-800 text-white border-neutral-700 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              1:{lev}
            </button>
          ))}
        </div>
      </div>

      {/* Stop Loss & Take Profit Toggles */}
      <div className="space-y-2 pt-1 border-t border-neutral-800/80">
        {/* SL */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white">
              <input
                type="checkbox"
                checked={enableSl}
                onChange={(e) => handleToggleSl(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-red-500 focus:ring-0"
              />
              <span>Stop Loss (SL)</span>
            </label>
            {enableSl && <span className="text-[11px] text-red-400">Risk Barrier</span>}
          </div>
          {enableSl && (
            <input
              type="number"
              step="any"
              placeholder={`e.g. ${(currentBid * 0.995).toFixed(selectedAsset.decimalPlaces)}`}
              value={slPrice}
              onChange={(e) => setSlPrice(e.target.value)}
              className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs tabular-nums text-white focus:outline-none focus:border-red-500/50"
            />
          )}
        </div>

        {/* TP */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-400 hover:text-white">
              <input
                type="checkbox"
                checked={enableTp}
                onChange={(e) => handleToggleTp(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-0"
              />
              <span>Take Profit (TP)</span>
            </label>
            {enableTp && <span className="text-[11px] text-emerald-400">Target Profit</span>}
          </div>
          {enableTp && (
            <input
              type="number"
              step="any"
              placeholder={`e.g. ${(currentAsk * 1.005).toFixed(selectedAsset.decimalPlaces)}`}
              value={tpPrice}
              onChange={(e) => setTpPrice(e.target.value)}
              className="w-full px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-xs tabular-nums text-white focus:outline-none focus:border-emerald-500/50"
            />
          )}
        </div>
      </div>

      {/* Margin Requirement Summary */}
      <div className="bg-neutral-900/60 p-2.5 rounded border border-neutral-800/80 text-[11px] space-y-1">
        <div className="flex justify-between text-neutral-400">
          <span>Required Margin:</span>
          <span className="font-semibold text-white tabular-nums">
            {formatMoney(requiredMarginUsd)}
          </span>
        </div>
        <div className="flex justify-between text-neutral-400">
          <span>Spread Cost:</span>
          <span className="tabular-nums text-neutral-300">
            {selectedAsset.spread} pips (~{formatMoney((selectedAsset.spread / selectedAsset.pipMultiplier) * lots * 100000)})
          </span>
        </div>
      </div>

      {/* Execution Button */}
      <button
        onClick={handleExecute}
        disabled={!hasSufficientMargin}
        className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
          !hasSufficientMargin
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            : orderType === 'BUY'
            ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold'
            : 'bg-red-500 hover:bg-red-400 text-white font-extrabold'
        }`}
      >
        {!hasSufficientMargin ? (
          'Insufficient Free Margin'
        ) : (
          <span>
            {orderType} {lots} Lots {selectedAsset.symbol}
          </span>
        )}
      </button>

      {/* Legal & Account Notice */}
      <div className="text-[10px] text-neutral-500 text-center">
        {accountType === 'demo' ? (
          <span className="text-amber-400/90">
            Simulated Practice Order · No real liability
          </span>
        ) : (
          <span className="text-neutral-400">
            Real order backed by WurlFX Liquid Engine
          </span>
        )}
      </div>
    </div>
  );
};
