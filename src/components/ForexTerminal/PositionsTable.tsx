import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Edit2,
  CheckCircle2,
  TrendingUp,
  History,
  Download,
  Printer,
  Copy,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  FileSpreadsheet,
  Check,
  ShieldCheck,
  Clock,
  Zap,
} from 'lucide-react';
import { TradingPosition } from '../../types';

export const PositionsTable: React.FC = () => {
  const {
    accountType,
    positions,
    closedTrades,
    closePosition,
    modifyPosition,
    formatMoney,
    currency,
    assets,
    currentUser,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [editingPosition, setEditingPosition] = useState<TradingPosition | null>(null);
  const [editSl, setEditSl] = useState('');
  const [editTp, setEditTp] = useState('');

  // Close All Modal state
  const [showCloseAllConfirm, setShowCloseAllConfirm] = useState(false);

  // Statement Modal state
  const [showStatementModal, setShowStatementModal] = useState(false);

  // History filtering & search
  const [historySearch, setHistorySearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [symbolFilter, setSymbolFilter] = useState<string>('ALL');

  // Filter positions for active account (demo vs real)
  const currentOpenPositions = positions.filter(
    (p) => p.accountType === accountType && p.status === 'OPEN'
  );
  const currentClosedTrades = closedTrades.filter(
    (p) => p.accountType === accountType
  );

  // Calculate live open PnL
  const totalOpenPnl = useMemo(() => {
    return currentOpenPositions.reduce((acc, pos) => {
      const asset = assets.find((a) => a.symbol === pos.symbol);
      const currentPrice =
        pos.type === 'BUY' ? (asset?.bid ?? pos.openPrice) : (asset?.ask ?? pos.openPrice);
      const diff = pos.type === 'BUY' ? currentPrice - pos.openPrice : pos.openPrice - currentPrice;
      const units = pos.lots * 100000;
      let calculatedPnl = diff * units;
      if (pos.symbol === 'USD/JPY' || pos.symbol === 'USD/KES') {
        calculatedPnl = (diff * units) / currentPrice;
      }
      return acc + calculatedPnl;
    }, 0);
  }, [currentOpenPositions, assets]);

  // Closed trade statistics
  const totalClosedPnl = currentClosedTrades.reduce((acc, t) => acc + t.pnl, 0);
  const winningTrades = currentClosedTrades.filter((t) => t.pnl > 0);
  const losingTrades = currentClosedTrades.filter((t) => t.pnl < 0);
  const totalVolumeLots = currentClosedTrades.reduce((acc, t) => acc + t.lots, 0);
  const winRate =
    currentClosedTrades.length > 0
      ? ((winningTrades.length / currentClosedTrades.length) * 100).toFixed(1)
      : '0.0';

  const bestTrade = currentClosedTrades.length > 0
    ? Math.max(...currentClosedTrades.map((t) => t.pnl))
    : 0;

  // Filtered trade history
  const filteredClosedTrades = useMemo(() => {
    return currentClosedTrades.filter((t) => {
      const matchesSearch =
        t.symbol.toLowerCase().includes(historySearch.toLowerCase()) ||
        t.id.toLowerCase().includes(historySearch.toLowerCase());

      const matchesOutcome =
        outcomeFilter === 'ALL'
          ? true
          : outcomeFilter === 'WIN'
          ? t.pnl > 0
          : t.pnl < 0;

      const matchesSymbol = symbolFilter === 'ALL' || t.symbol === symbolFilter;

      return matchesSearch && matchesOutcome && matchesSymbol;
    });
  }, [currentClosedTrades, historySearch, outcomeFilter, symbolFilter]);

  // Unique symbols from history for dropdown
  const uniqueSymbols = useMemo(() => {
    const symbols = new Set(currentClosedTrades.map((t) => t.symbol));
    return Array.from(symbols);
  }, [currentClosedTrades]);

  // Handlers for modifying open position SL/TP
  const handleStartEdit = (pos: TradingPosition) => {
    setEditingPosition(pos);
    setEditSl(pos.sl ? pos.sl.toString() : '');
    setEditTp(pos.tp ? pos.tp.toString() : '');
  };

  const handleSaveEdit = () => {
    if (!editingPosition) return;
    modifyPosition(
      editingPosition.id,
      editSl ? parseFloat(editSl) : undefined,
      editTp ? parseFloat(editTp) : undefined
    );
    setEditingPosition(null);
  };

  // Close All open positions
  const handleCloseAllPositions = () => {
    currentOpenPositions.forEach((pos) => {
      closePosition(pos.id);
    });
    setShowCloseAllConfirm(false);
    showNotification(`Liquidated ${currentOpenPositions.length} active positions at market quotes.`, 'info');
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (currentClosedTrades.length === 0) {
      showNotification('No trade history available to export.', 'error');
      return;
    }

    const headers = [
      'Ticket_ID',
      'Account_Type',
      'Symbol',
      'Direction',
      'Lots',
      'Leverage',
      'Open_Price',
      'Close_Price',
      'Stop_Loss',
      'Take_Profit',
      'Realized_PnL_USD',
      'Realized_PnL_KES',
      'Opened_At',
      'Closed_At',
      'Status',
    ];

    const rows = currentClosedTrades.map((t) => {
      const pnlKes = (t.pnl * 130).toFixed(2);
      const openedStr = new Date(t.timestamp).toISOString();
      const closedStr = t.closedAt ? new Date(t.closedAt).toISOString() : '';
      return [
        t.id,
        t.accountType.toUpperCase(),
        t.symbol,
        t.type,
        t.lots.toFixed(2),
        `1:${t.leverage || 100}`,
        t.openPrice.toFixed(4),
        t.closePrice ? t.closePrice.toFixed(4) : '',
        t.sl ? t.sl.toFixed(4) : '',
        t.tp ? t.tp.toFixed(4) : '',
        t.pnl.toFixed(2),
        pnlKes,
        openedStr,
        closedStr,
        t.status,
      ].map((val) => `"${val}"`).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `wurlfx-trading-history-${accountType}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Trade history exported to CSV successfully.', 'success');
  };

  // Copy trade performance summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `WurlFX FX Pro Trading Summary (${accountType.toUpperCase()})
Customer: ${currentUser.fullName} (ID: ${currentUser.id})
Total Closed Trades: ${currentClosedTrades.length}
Win Rate: ${winRate}% (${winningTrades.length} Won / ${losingTrades.length} Lost)
Total Volume: ${totalVolumeLots.toFixed(2)} Lots
Net Realized PnL: ${formatMoney(totalClosedPnl)}
Best Trade: +${formatMoney(bestTrade)}
Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;

    navigator.clipboard.writeText(summaryText);
    showNotification('Trading performance summary copied to clipboard!', 'success');
  };

  // Helper to calculate pip movement
  const calculatePips = (t: TradingPosition) => {
    if (!t.closePrice) return '0.0';
    const asset = assets.find((a) => a.symbol === t.symbol);
    const mult = asset?.pipMultiplier || 10000;
    const pipDiff = t.type === 'BUY'
      ? (t.closePrice - t.openPrice) * mult
      : (t.openPrice - t.closePrice) * mult;
    return `${pipDiff >= 0 ? '+' : ''}${pipDiff.toFixed(1)} pips`;
  };

  return (
    <div id="positions-history-section" className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col text-xs shadow-xl">
      {/* Tab Switcher Header */}
      <div className="px-4 py-3 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950/80 border border-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveTab('open')}
            className={`px-3 py-1.5 font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'open'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Positions</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentOpenPositions.length > 0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {currentOpenPositions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>Trade History</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-neutral-800 text-neutral-300">
              {currentClosedTrades.length}
            </span>
          </button>
        </div>

        {/* Tab-Specific Action Area */}
        {activeTab === 'open' ? (
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-neutral-400 flex items-center gap-2">
              <span>Open P&amp;L:</span>
              <span
                className={`font-mono font-bold tabular-nums text-xs ${
                  totalOpenPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalOpenPnl >= 0 ? '+' : ''}
                {formatMoney(totalOpenPnl)}
              </span>
            </div>

            {currentOpenPositions.length > 0 && (
              <button
                type="button"
                onClick={() => setShowCloseAllConfirm(true)}
                className="px-2.5 py-1 text-[11px] rounded bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>Close All ({currentOpenPositions.length})</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {/* Export & Statement Buttons */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-2.5 py-1 text-[11px] font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
              title="Export all closed trades to a CSV file"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStatementModal(true)}
              className="px-2.5 py-1 text-[11px] font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center gap-1.5"
              title="View full trading account statement"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>Statement</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="px-2.5 py-1 text-[11px] font-bold rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors flex items-center gap-1"
              title="Copy summary statistics"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Trade History Performance Strip (Shown only in History Tab) */}
      {activeTab === 'history' && (
        <div className="bg-neutral-900/40 border-b border-neutral-800/80 px-4 py-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Net Realized P&amp;L
              </span>
              <div
                className={`font-mono font-bold text-sm tabular-nums ${
                  totalClosedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalClosedPnl >= 0 ? '+' : ''}
                {formatMoney(totalClosedPnl)}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Win Rate
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-white text-sm">
                  {winRate}%
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  ({winningTrades.length}W / {losingTrades.length}L)
                </span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Volume Traded
              </span>
              <div className="font-mono font-bold text-white text-sm">
                {totalVolumeLots.toFixed(2)} Lots
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Best Trade
              </span>
              <div className="font-mono font-bold text-emerald-400 text-sm tabular-nums">
                +{formatMoney(bestTrade)}
              </div>
            </div>

            <div className="hidden lg:block space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500">
                Total Closed
              </span>
              <div className="font-mono font-bold text-neutral-300 text-sm">
                {currentClosedTrades.length} Trades
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-3 pt-3 border-t border-neutral-800/60 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search by Symbol or ID */}
              <div className="relative min-w-[160px] max-w-xs flex-1">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pair or ticket ID..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
                />
              </div>

              {/* Outcome Filter */}
              <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setOutcomeFilter('ALL')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    outcomeFilter === 'ALL'
                      ? 'bg-neutral-800 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  All ({currentClosedTrades.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOutcomeFilter('WIN')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    outcomeFilter === 'WIN'
                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                      : 'text-neutral-400 hover:text-emerald-400'
                  }`}
                >
                  Wins ({winningTrades.length})
                </button>
                <button
                  type="button"
                  onClick={() => setOutcomeFilter('LOSS')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    outcomeFilter === 'LOSS'
                      ? 'bg-rose-500/20 text-rose-400 font-bold'
                      : 'text-neutral-400 hover:text-rose-400'
                  }`}
                >
                  Losses ({losingTrades.length})
                </button>
              </div>

              {/* Symbol Filter Dropdown */}
              {uniqueSymbols.length > 1 && (
                <select
                  value={symbolFilter}
                  onChange={(e) => setSymbolFilter(e.target.value)}
                  className="px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:border-neutral-700"
                >
                  <option value="ALL">All Pairs ({uniqueSymbols.length})</option>
                  {uniqueSymbols.map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {(historySearch || outcomeFilter !== 'ALL' || symbolFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setHistorySearch('');
                  setOutcomeFilter('ALL');
                  setSymbolFilter('ALL');
                }}
                className="text-[11px] text-neutral-400 hover:text-white underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[160px]">
        {activeTab === 'open' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/30 text-[10px] uppercase font-bold text-neutral-400">
                <th className="px-3.5 py-2.5">Symbol</th>
                <th className="px-3.5 py-2.5">Type</th>
                <th className="px-3.5 py-2.5">Volume</th>
                <th className="px-3.5 py-2.5">Open Price</th>
                <th className="px-3.5 py-2.5">Market Price</th>
                <th className="px-3.5 py-2.5">S / L</th>
                <th className="px-3.5 py-2.5">T / P</th>
                <th className="px-3.5 py-2.5 text-right">Profit / Loss</th>
                <th className="px-3.5 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {currentOpenPositions.map((pos) => {
                const asset = assets.find((a) => a.symbol === pos.symbol);
                const currentPrice =
                  pos.type === 'BUY' ? (asset?.bid ?? pos.openPrice) : (asset?.ask ?? pos.openPrice);
                const diff = pos.type === 'BUY' ? currentPrice - pos.openPrice : pos.openPrice - currentPrice;
                const units = pos.lots * 100000;
                let calculatedPnl = diff * units;
                if (pos.symbol === 'USD/JPY' || pos.symbol === 'USD/KES') {
                  calculatedPnl = (diff * units) / currentPrice;
                }
                const isPositive = calculatedPnl >= 0;

                return (
                  <tr key={pos.id} className="hover:bg-neutral-900/40 transition-colors tabular-nums">
                    <td className="px-3.5 py-2.5 font-bold text-white flex items-center gap-2">
                      <span className="text-xs">{pos.symbol}</span>
                      <span className="text-[10px] text-neutral-500 font-mono font-normal">#{pos.id}</span>
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold text-[11px] ${
                          pos.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pos.type === 'BUY' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {pos.type}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-300 font-medium">
                      {pos.lots.toFixed(2)} Lots
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-300">
                      {pos.openPrice.toFixed(asset?.decimalPlaces || 4)}
                    </td>
                    <td className="px-3.5 py-2.5 text-white font-medium">
                      {currentPrice.toFixed(asset?.decimalPlaces || 4)}
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-400 font-mono">
                      {pos.sl ? pos.sl.toFixed(asset?.decimalPlaces || 4) : '—'}
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-400 font-mono">
                      {pos.tp ? pos.tp.toFixed(asset?.decimalPlaces || 4) : '—'}
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-bold">
                      <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                        {isPositive ? '+' : ''}
                        {formatMoney(calculatedPnl)}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleStartEdit(pos)}
                        className="px-2.5 py-1 text-[11px] rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors"
                        title="Modify SL/TP"
                      >
                        SL/TP
                      </button>
                      <button
                        onClick={() => closePosition(pos.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold transition-colors"
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                );
              })}

              {currentOpenPositions.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-white">No active open positions</p>
                      <p className="text-[11px] text-neutral-500">
                        Use the Order Entry Panel to execute high-speed BUY or SELL orders with customized lots and leverage.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-900/30 text-[10px] uppercase font-bold text-neutral-400">
                <th className="px-3.5 py-2.5">Ticket #</th>
                <th className="px-3.5 py-2.5">Pair / Symbol</th>
                <th className="px-3.5 py-2.5">Type</th>
                <th className="px-3.5 py-2.5">Volume</th>
                <th className="px-3.5 py-2.5">Entry Price</th>
                <th className="px-3.5 py-2.5">Close Price</th>
                <th className="px-3.5 py-2.5">Pips</th>
                <th className="px-3.5 py-2.5">Execution &amp; Close Time</th>
                <th className="px-3.5 py-2.5 text-right">Realized P&amp;L</th>
                <th className="px-3.5 py-2.5 text-right">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredClosedTrades.map((trade) => {
                const isPositive = trade.pnl >= 0;
                const pipsText = calculatePips(trade);
                const asset = assets.find((a) => a.symbol === trade.symbol);
                const decimalPlaces = asset?.decimalPlaces || 4;

                return (
                  <tr key={trade.id} className="hover:bg-neutral-900/30 transition-colors tabular-nums">
                    <td className="px-3.5 py-2.5 font-mono text-[11px] text-neutral-400 font-semibold">
                      #{trade.id}
                    </td>
                    <td className="px-3.5 py-2.5 font-bold text-white">
                      {trade.symbol}
                    </td>
                    <td className="px-3.5 py-2.5">
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold text-[11px] ${
                          trade.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {trade.type === 'BUY' ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {trade.type}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-300">
                      <div>{trade.lots.toFixed(2)} Lots</div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        1:{trade.leverage || 100}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-300 font-mono">
                      {trade.openPrice.toFixed(decimalPlaces)}
                    </td>
                    <td className="px-3.5 py-2.5 text-white font-medium font-mono">
                      {trade.closePrice ? trade.closePrice.toFixed(decimalPlaces) : '—'}
                    </td>
                    <td className="px-3.5 py-2.5 font-mono">
                      <span
                        className={`text-[11px] font-semibold ${
                          pipsText.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {pipsText}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-neutral-400 text-[11px]">
                      <div>
                        {trade.closedAt
                          ? new Date(trade.closedAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            }) +
                            ' ' +
                            new Date(trade.closedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Settled'}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Opened: {new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-right font-bold">
                      <div className={isPositive ? 'text-emerald-400 text-xs' : 'text-rose-400 text-xs'}>
                        {isPositive ? '+' : ''}
                        {formatMoney(trade.pnl)}
                      </div>
                      {currency === 'KES' && (
                        <div className="text-[10px] text-neutral-500 font-normal">
                          {isPositive ? '+' : ''}${trade.pnl.toFixed(2)} USD
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {isPositive ? 'PROFIT' : 'LOSS'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredClosedTrades.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                        <History className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-white">No trade records match filters</p>
                      <p className="text-[11px] text-neutral-500">
                        {currentClosedTrades.length === 0
                          ? 'No trades have been closed yet in this account. Once a position is closed, its full execution timeline and realized PnL will be archived here.'
                          : 'Try modifying your search query or outcome filter to see past trades.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modify SL/TP Inline Dialog */}
      {editingPosition && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="font-bold text-white text-sm">
                  Modify Limits: {editingPosition.symbol}
                </span>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Ticket #{editingPosition.id} · {editingPosition.type} {editingPosition.lots} Lots
                </p>
              </div>
              <button
                onClick={() => setEditingPosition(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Stop Loss Price (Protection)</span>
                  <span className="text-neutral-500">Current: {editingPosition.sl || 'None'}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={editSl}
                  onChange={(e) => setEditSl(e.target.value)}
                  placeholder="e.g. 1.0820"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Take Profit Price (Target)</span>
                  <span className="text-neutral-500">Current: {editingPosition.tp || 'None'}</span>
                </div>
                <input
                  type="number"
                  step="any"
                  value={editTp}
                  onChange={(e) => setEditTp(e.target.value)}
                  placeholder="e.g. 1.0920"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-white text-xs tabular-nums focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => setEditingPosition(null)}
                className="px-3.5 py-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-md"
              >
                Update Limits
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close All Positions Confirmation Modal */}
      {showCloseAllConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Emergency Liquidate All Positions?</h3>
              </div>
              <button
                onClick={() => setShowCloseAllConfirm(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              You are about to close <strong className="text-white">{currentOpenPositions.length} active positions</strong> immediately at prevailing market prices.
            </p>

            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Estimated Realized P&amp;L:</span>
                <span
                  className={`font-mono font-bold ${
                    totalOpenPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {totalOpenPnl >= 0 ? '+' : ''}
                  {formatMoney(totalOpenPnl)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Target Account:</span>
                <span className="font-semibold text-white uppercase">{accountType} Balance</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setShowCloseAllConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseAllPositions}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Confirm Liquidation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official WurlFX Trade Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-2xl w-full space-y-5 text-neutral-100 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-white">
                    WurlFX Trade History &amp; Settlement Statement
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Official financial log for verification and individual record-keeping
                </p>
              </div>
              <button
                onClick={() => setShowStatementModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Account Holder</span>
                <span className="font-semibold text-white">{currentUser.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">WurlFX ID</span>
                <span className="font-mono text-emerald-400">{currentUser.id}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Account Mode</span>
                <span className="font-semibold text-white uppercase">{accountType} TRADING</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Generated Date</span>
                <span className="text-neutral-300">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Performance Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Total Closed Trades</div>
                <div className="text-xl font-bold text-white mt-0.5">{currentClosedTrades.length}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">{winRate}% Win Rate</div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Net Realized PnL</div>
                <div
                  className={`text-xl font-bold mt-0.5 tabular-nums ${
                    totalClosedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {totalClosedPnl >= 0 ? '+' : ''}
                  {formatMoney(totalClosedPnl)}
                </div>
                <div className="text-[10px] text-neutral-500 mt-0.5">
                  Gross: +${winningTrades.reduce((acc, t) => acc + t.pnl, 0).toFixed(2)} / -${Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0)).toFixed(2)}
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <div className="text-[10px] text-neutral-400 uppercase font-bold">Total Lots Traded</div>
                <div className="text-xl font-bold text-white mt-0.5">{totalVolumeLots.toFixed(2)}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Standard Volume</div>
              </div>
            </div>

            {/* Mini Scrollable Table */}
            <div className="max-h-60 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 bg-neutral-900 border-b border-neutral-800 text-[10px] uppercase text-neutral-400 font-bold">
                  <tr>
                    <th className="p-2.5">Ticket</th>
                    <th className="p-2.5">Symbol</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Lots</th>
                    <th className="p-2.5">Open &rarr; Close</th>
                    <th className="p-2.5 text-right">Realized PnL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                  {currentClosedTrades.map((t) => (
                    <tr key={t.id} className="hover:bg-neutral-900/40">
                      <td className="p-2.5 font-mono text-neutral-400 text-[11px]">#{t.id}</td>
                      <td className="p-2.5 font-bold text-white">{t.symbol}</td>
                      <td className="p-2.5">
                        <span className={t.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-2.5 text-neutral-300">{t.lots.toFixed(2)}</td>
                      <td className="p-2.5 font-mono text-[11px] text-neutral-400">
                        {t.openPrice.toFixed(4)} &rarr; {t.closePrice?.toFixed(4) || '—'}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        <span className={t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                          {t.pnl >= 0 ? '+' : ''}{formatMoney(t.pnl)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
              <span className="text-[11px] text-neutral-500">
                WurlFX Trading Engine · Nairobi Desk
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Statement</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
