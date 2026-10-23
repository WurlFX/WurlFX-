import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Candle } from '../../types';
import { Activity, BarChart2, Maximize2, Zap, Info, Bell, GraduationCap } from 'lucide-react';

export const TradingViewChart: React.FC = () => {
  const {
    selectedAsset,
    candles,
    timeframe,
    setTimeframe,
    indicators,
    toggleIndicator,
    priceAlerts,
    setIsAlertModalOpen,
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Compute 20-period Simple Moving Average
  const smaValues = useMemo(() => {
    const period = 20;
    const smas: (number | null)[] = [];
    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        smas.push(null);
      } else {
        const slice = candles.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, c) => acc + c.close, 0);
        smas.push(sum / period);
      }
    }
    return smas;
  }, [candles]);

  // Compute 14-period RSI
  const rsiValues = useMemo(() => {
    const period = 14;
    const rsis: (number | null)[] = [];
    if (candles.length <= period) return candles.map(() => null);

    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;

    rsis.push(...new Array(period).fill(null));
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsis.push(100 - 100 / (1 + rs));

    for (let i = period + 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      const currentGain = diff >= 0 ? diff : 0;
      const currentLoss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + currentGain) / period;
      avgLoss = (avgLoss * (period - 1) + currentLoss) / period;

      const currentRs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      rsis.push(100 - 100 / (1 + currentRs));
    }
    return rsis;
  }, [candles]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = Math.max(380, rect.height || 420);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Layout configuration
    const paddingRight = 65; // Price scale area
    const paddingBottom = indicators.rsi ? 90 : 30; // Time & RSI area
    const chartWidth = width - paddingRight;
    const mainChartHeight = height - paddingBottom;

    // Determine min/max price for scale
    const prices = candles.flatMap((c) => [c.high, c.low]);
    let minPrice = Math.min(...prices);
    let maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 0.001;
    minPrice -= priceRange * 0.05;
    maxPrice += priceRange * 0.05;

    // Price to Y conversion
    const getY = (price: number) => {
      return mainChartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (mainChartHeight - 20) - 10;
    };

    // Draw Grid Lines
    ctx.strokeStyle = '#18181b'; // neutral-900
    ctx.lineWidth = 1;
    const gridRows = 6;
    for (let i = 0; i <= gridRows; i++) {
      const y = (mainChartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Price labels on right axis
      const priceVal = maxPrice - (i / gridRows) * (maxPrice - minPrice);
      ctx.fillStyle = '#71717a';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(selectedAsset.decimalPlaces), chartWidth + 6, y + 3);
    }

    // Candle widths and spacing
    const candleCount = candles.length;
    const candleSlotWidth = chartWidth / candleCount;
    const candleBodyWidth = Math.max(2, candleSlotWidth * 0.65);

    // Max volume for volume bars
    const maxVol = Math.max(...candles.map((c) => c.volume), 1);
    const volHeightMax = mainChartHeight * 0.22;

    // Draw Candlesticks & Volume
    candles.forEach((c, i) => {
      const x = i * candleSlotWidth + candleSlotWidth / 2;
      const isBullish = c.close >= c.open;
      const bullColor = '#10b981'; // emerald-500
      const bearColor = '#ef4444'; // red-500

      // Volume Bar (if toggled)
      if (indicators.volume) {
        const vHeight = (c.volume / maxVol) * volHeightMax;
        ctx.fillStyle = isBullish ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
        ctx.fillRect(x - candleBodyWidth / 2, mainChartHeight - vHeight, candleBodyWidth, vHeight);
      }

      // Candle Wick (High-Low)
      ctx.strokeStyle = isBullish ? bullColor : bearColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, getY(c.high));
      ctx.lineTo(x, getY(c.low));
      ctx.stroke();

      // Candle Body (Open-Close)
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(2, Math.abs(openY - closeY));

      ctx.fillStyle = isBullish ? bullColor : bearColor;
      ctx.fillRect(x - candleBodyWidth / 2, bodyTop, candleBodyWidth, bodyHeight);
    });

    // Draw SMA line (Moving Average 20)
    if (indicators.sma) {
      ctx.strokeStyle = '#f59e0b'; // amber-500
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started = false;
      smaValues.forEach((val, i) => {
        if (val !== null) {
          const x = i * candleSlotWidth + candleSlotWidth / 2;
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Live Bid Price Horizontal Line
    const currentPriceY = getY(selectedAsset.bid);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, currentPriceY);
    ctx.lineTo(chartWidth, currentPriceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Live price tag on axis
    ctx.fillStyle = '#10b981';
    ctx.fillRect(chartWidth + 2, currentPriceY - 9, paddingRight - 4, 18);
    ctx.fillStyle = '#09090b';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(selectedAsset.bid.toFixed(selectedAsset.decimalPlaces), chartWidth + 5, currentPriceY + 3);

    // Draw active price alerts for this symbol
    const activeSymbolAlerts = priceAlerts.filter(
      (a) => a.isActive && a.symbol === selectedAsset.symbol
    );
    activeSymbolAlerts.forEach((alt) => {
      const altY = getY(alt.targetPrice);
      if (altY >= 0 && altY <= mainChartHeight) {
        ctx.strokeStyle = '#f59e0b'; // amber-500
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(0, altY);
        ctx.lineTo(chartWidth, altY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Alert Tag
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(chartWidth + 2, altY - 8, paddingRight - 4, 16);
        ctx.fillStyle = '#09090b';
        ctx.font = 'bold 9px JetBrains Mono, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`ALT ${alt.targetPrice.toFixed(selectedAsset.decimalPlaces)}`, chartWidth + 4, altY + 4);
      }
    });

    // Draw RSI panel if active
    if (indicators.rsi) {
      const rsiTop = mainChartHeight + 10;
      const rsiHeight = height - rsiTop - 15;

      // RSI background & bounds
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, rsiTop, chartWidth, rsiHeight);

      // 70 and 30 reference lines
      const y70 = rsiTop + rsiHeight * 0.3;
      const y30 = rsiTop + rsiHeight * 0.7;

      ctx.strokeStyle = '#27272a';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(chartWidth, y70);
      ctx.moveTo(0, y30);
      ctx.lineTo(chartWidth, y30);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#71717a';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText('70', chartWidth + 6, y70 + 3);
      ctx.fillText('30', chartWidth + 6, y30 + 3);
      ctx.fillText('RSI (14)', 8, rsiTop + 12);

      // Plot RSI curve
      ctx.strokeStyle = '#38bdf8'; // sky-400
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      let rsiStarted = false;
      rsiValues.forEach((val, i) => {
        if (val !== null) {
          const x = i * candleSlotWidth + candleSlotWidth / 2;
          const y = rsiTop + (1 - val / 100) * rsiHeight;
          if (!rsiStarted) {
            ctx.moveTo(x, y);
            rsiStarted = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    }

    // Crosshair & Hover highlight
    if (mousePos && mousePos.x >= 0 && mousePos.x <= chartWidth) {
      const hoveredIndex = Math.min(
        candles.length - 1,
        Math.max(0, Math.floor(mousePos.x / candleSlotWidth))
      );
      const candle = candles[hoveredIndex];
      setHoveredCandle(candle);

      const crossX = hoveredIndex * candleSlotWidth + candleSlotWidth / 2;
      ctx.strokeStyle = '#52525b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crossX, 0);
      ctx.lineTo(crossX, height);
      ctx.stroke();

      // Horizontal line
      if (mousePos.y <= mainChartHeight) {
        ctx.beginPath();
        ctx.moveTo(0, mousePos.y);
        ctx.lineTo(chartWidth, mousePos.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    } else {
      setHoveredCandle(null);
    }
  }, [candles, selectedAsset, indicators, smaValues, rsiValues, mousePos]);

  // Handle Mouse Events for Crosshair
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col h-full overflow-hidden">
      {/* Chart Top Toolbar */}
      <div className="px-4 py-2.5 bg-neutral-900/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Symbol Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-white">{selectedAsset.symbol}</span>
            <span className="text-neutral-400 text-xs">{selectedAsset.name}</span>
          </div>

          <div className="flex items-center gap-2 text-xs tabular-nums">
            <span className="text-white font-semibold">
              {selectedAsset.bid.toFixed(selectedAsset.decimalPlaces)}
            </span>
            <span
              className={`font-medium ${
                selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {selectedAsset.change24h >= 0 ? '+' : ''}
              {selectedAsset.change24h}%
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-neutral-400">
              Spread: {selectedAsset.spread} pips
            </span>
          </div>
        </div>

        {/* Timeframe Selectors & Indicator Toggles */}
        <div className="flex items-center gap-2">
          {/* Timeframes */}
          <div className="inline-flex p-0.5 bg-neutral-950 border border-neutral-800 rounded">
            {(['1m', '5m', '15m', '1h', '1D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-medium rounded uppercase transition-colors ${
                  timeframe === tf
                    ? 'bg-neutral-800 text-emerald-400 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleIndicator('sma')}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                indicators.sma
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="20-Period Simple Moving Average"
            >
              SMA 20
            </button>
            <button
              onClick={() => toggleIndicator('rsi')}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                indicators.rsi
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="Relative Strength Index"
            >
              RSI
            </button>
            <button
              onClick={() => toggleIndicator('volume')}
              className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                indicators.volume
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
              title="Trade Volume"
            >
              VOL
            </button>
          </div>

          {/* Quick Alert Trigger */}
          <button
            onClick={() => setIsAlertModalOpen(true)}
            className="px-2 py-0.5 text-xs rounded border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1 font-medium"
            title="Set Price Alert for this pair"
          >
            <Bell className="w-3 h-3 text-emerald-400" />
            <span>Alert</span>
          </button>

          {/* Jump to Trading Education Tutorials */}
          <button
            onClick={() => {
              const el = document.getElementById('trading-academy');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-2 py-0.5 text-xs rounded border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1 font-medium"
            title="Forex Strategies & Risk Management Tutorials"
          >
            <GraduationCap className="w-3 h-3 text-emerald-400" />
            <span>Tutorials</span>
          </button>
        </div>
      </div>

      {/* OHLC Sub-bar (shows hovered or current candle data) */}
      <div className="px-4 py-1.5 bg-neutral-950/90 border-b border-neutral-800/60 flex items-center gap-4 text-[11px] text-neutral-400 tabular-nums overflow-x-auto">
        {(() => {
          const activeCandle = hoveredCandle || candles[candles.length - 1];
          if (!activeCandle) return null;
          return (
            <>
              <div>
                O: <span className="text-white">{activeCandle.open.toFixed(selectedAsset.decimalPlaces)}</span>
              </div>
              <div>
                H: <span className="text-white">{activeCandle.high.toFixed(selectedAsset.decimalPlaces)}</span>
              </div>
              <div>
                L: <span className="text-white">{activeCandle.low.toFixed(selectedAsset.decimalPlaces)}</span>
              </div>
              <div>
                C:{' '}
                <span
                  className={
                    activeCandle.close >= activeCandle.open
                      ? 'text-emerald-400 font-medium'
                      : 'text-red-400 font-medium'
                  }
                >
                  {activeCandle.close.toFixed(selectedAsset.decimalPlaces)}
                </span>
              </div>
              <div>
                Vol: <span className="text-neutral-300">{activeCandle.volume}</span>
              </div>
              <div className="text-neutral-500 text-[10px]">
                {new Date(activeCandle.time).toLocaleTimeString()}
              </div>
            </>
          );
        })()}
      </div>

      {/* Main Canvas Viewport */}
      <div ref={containerRef} className="relative flex-1 w-full min-h-[360px] bg-neutral-950">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="absolute inset-0 cursor-crosshair"
        />
      </div>
    </div>
  );
};
