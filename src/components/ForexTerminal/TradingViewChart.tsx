import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Candle } from '../../types';
import {
  Activity,
  BarChart2,
  TrendingUp,
  Maximize2,
  Zap,
  Info,
  Bell,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Eye,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

type ChartStyle = 'candle' | 'area' | 'heikin' | 'bars';

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
    positions,
    closedTrades,
    openPosition,
    accountType,
    formatMoney,
  } = useApp();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [chartStyle, setChartStyle] = useState<ChartStyle>('candle');
  const [showIndicatorsMenu, setShowIndicatorsMenu] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [quickLots, setQuickLots] = useState<number>(0.1);

  // Timeframes list
  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1D'];

  // Calculate Heikin-Ashi candles
  const heikinAshiCandles = useMemo(() => {
    if (candles.length === 0) return [];
    const ha: Candle[] = [];
    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const close = (c.open + c.high + c.low + c.close) / 4;
      const open = i === 0 ? (c.open + c.close) / 2 : (ha[i - 1].open + ha[i - 1].close) / 2;
      const high = Math.max(c.high, open, close);
      const low = Math.min(c.low, open, close);
      ha.push({
        time: c.time,
        open,
        high,
        low,
        close,
        volume: c.volume,
      });
    }
    return ha;
  }, [candles]);

  // Compute Fast EMA (9)
  const ema9Values = useMemo(() => {
    const period = 9;
    const values: (number | null)[] = [];
    if (candles.length < period) return candles.map(() => null);

    const k = 2 / (period + 1);
    let ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;

    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        values.push(null);
      } else if (i === period - 1) {
        values.push(ema);
      } else {
        ema = candles[i].close * k + ema * (1 - k);
        values.push(ema);
      }
    }
    return values;
  }, [candles]);

  // Compute Slow EMA (21)
  const ema21Values = useMemo(() => {
    const period = 21;
    const values: (number | null)[] = [];
    if (candles.length < period) return candles.map(() => null);

    const k = 2 / (period + 1);
    let ema = candles.slice(0, period).reduce((acc, c) => acc + c.close, 0) / period;

    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        values.push(null);
      } else if (i === period - 1) {
        values.push(ema);
      } else {
        ema = candles[i].close * k + ema * (1 - k);
        values.push(ema);
      }
    }
    return values;
  }, [candles]);

  // Compute Bollinger Bands (20, 2)
  const bollingerBands = useMemo(() => {
    const period = 20;
    const upper: (number | null)[] = [];
    const middle: (number | null)[] = [];
    const lower: (number | null)[] = [];

    for (let i = 0; i < candles.length; i++) {
      if (i < period - 1) {
        upper.push(null);
        middle.push(null);
        lower.push(null);
      } else {
        const slice = candles.slice(i - period + 1, i + 1);
        const mean = slice.reduce((sum, c) => sum + c.close, 0) / period;
        const variance =
          slice.reduce((sum, c) => sum + Math.pow(c.close - mean, 2), 0) / period;
        const stdDev = Math.sqrt(variance);

        middle.push(mean);
        upper.push(mean + 2 * stdDev);
        lower.push(mean - 2 * stdDev);
      }
    }
    return { upper, middle, lower };
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

  // Active display candles based on chart style
  const displayCandles = chartStyle === 'heikin' ? heikinAshiCandles : candles;

  // Active hovered candle or latest candle for HUD
  const activeHudCandle = hoveredCandle || candles[candles.length - 1];
  const activeHudRsi =
    hoveredIndex !== null && rsiValues[hoveredIndex] !== null
      ? rsiValues[hoveredIndex]
      : rsiValues[rsiValues.length - 1];

  // Draw chart onto HTML5 Canvas
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

    // Padding parameters
    const paddingRight = 72; // Price axis
    const paddingBottom = indicators.rsi ? 90 : 26; // Time & sub-pane axis
    const chartWidth = width - paddingRight;
    const mainChartHeight = height - paddingBottom;

    // Price range calculation
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    displayCandles.forEach((c) => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
    });

    // Factor in Bollinger Bands if enabled
    if (indicators.bollinger) {
      bollingerBands.upper.forEach((u) => {
        if (u !== null && u > maxPrice) maxPrice = u;
      });
      bollingerBands.lower.forEach((l) => {
        if (l !== null && l < minPrice) minPrice = l;
      });
    }

    // Add 8% head and tail room
    const priceRange = maxPrice - minPrice || 0.001;
    const paddedMin = minPrice - priceRange * 0.06;
    const paddedMax = maxPrice + priceRange * 0.06;
    const finalRange = paddedMax - paddedMin;

    const getY = (price: number) => {
      return mainChartHeight - ((price - paddedMin) / finalRange) * mainChartHeight;
    };

    const count = displayCandles.length;
    const candleWidth = chartWidth / count;
    const bodyWidth = Math.max(2, candleWidth * 0.72);

    // 1. Background Grid Lines (Horizontal Price Grid)
    const gridRows = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (let i = 0; i <= gridRows; i++) {
      const y = (mainChartHeight / gridRows) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(chartWidth, y);
      ctx.stroke();

      // Right axis price label
      const priceVal = paddedMax - (finalRange / gridRows) * i;
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(priceVal.toFixed(selectedAsset.decimalPlaces || 4), chartWidth + 8, y + 3);
    }

    // 2. Vertical Time Grid Lines
    const gridCols = Math.min(8, Math.floor(chartWidth / 80));
    for (let i = 1; i < gridCols; i++) {
      const x = (chartWidth / gridCols) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, mainChartHeight);
      ctx.stroke();
    }

    // 3. Asset Watermark in Background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedAsset.symbol, chartWidth / 2, mainChartHeight / 2);
    ctx.restore();

    // 4. Volume Histogram Bars (Rendered along bottom of main pane)
    if (indicators.volume) {
      let maxVol = 0;
      displayCandles.forEach((c) => {
        if (c.volume > maxVol) maxVol = c.volume;
      });
      const volMaxHeight = mainChartHeight * 0.22;

      displayCandles.forEach((c, i) => {
        const x = i * candleWidth + (candleWidth - bodyWidth) / 2;
        const volHeight = maxVol > 0 ? (c.volume / maxVol) * volMaxHeight : 10;
        const y = mainChartHeight - volHeight;
        const isBull = c.close >= c.open;

        ctx.fillStyle = isBull ? 'rgba(0, 230, 118, 0.18)' : 'rgba(255, 23, 68, 0.18)';
        ctx.fillRect(x, y, bodyWidth, volHeight);
      });
    }

    // 5. Bollinger Bands Overlay
    if (indicators.bollinger) {
      // Shaded channel between upper and lower bands
      ctx.beginPath();
      let startedUpper = false;
      for (let i = 0; i < count; i++) {
        const u = bollingerBands.upper[i];
        if (u !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(u);
          if (!startedUpper) {
            ctx.moveTo(x, y);
            startedUpper = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      for (let i = count - 1; i >= 0; i--) {
        const l = bollingerBands.lower[i];
        if (l !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(l);
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fillStyle = 'rgba(179, 136, 255, 0.06)';
      ctx.fill();

      // Draw Upper Band (Purple-300)
      ctx.strokeStyle = 'rgba(179, 136, 255, 0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      let firstU = true;
      for (let i = 0; i < count; i++) {
        const u = bollingerBands.upper[i];
        if (u !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(u);
          if (firstU) {
            ctx.moveTo(x, y);
            firstU = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      // Draw Lower Band
      ctx.strokeStyle = 'rgba(179, 136, 255, 0.55)';
      ctx.beginPath();
      let firstL = true;
      for (let i = 0; i < count; i++) {
        const l = bollingerBands.lower[i];
        if (l !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(l);
          if (firstL) {
            ctx.moveTo(x, y);
            firstL = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    // 6. Fast EMA 9 (Cyan) & Slow EMA 21 (Gold)
    if (indicators.sma) {
      // EMA 9 (Cyan)
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started9 = false;
      for (let i = 0; i < count; i++) {
        const val = ema9Values[i];
        if (val !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(val);
          if (!started9) {
            ctx.moveTo(x, y);
            started9 = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();

      // EMA 21 (Gold)
      ctx.strokeStyle = '#ffd600';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      let started21 = false;
      for (let i = 0; i < count; i++) {
        const val = ema21Values[i];
        if (val !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = getY(val);
          if (!started21) {
            ctx.moveTo(x, y);
            started21 = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }

    // 7. Render Selected Chart Style
    if (chartStyle === 'area') {
      // Mountain Area Gradient Chart
      const gradient = ctx.createLinearGradient(0, 0, 0, mainChartHeight);
      gradient.addColorStop(0, 'rgba(0, 230, 118, 0.35)');
      gradient.addColorStop(0.6, 'rgba(0, 230, 118, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 230, 118, 0)');

      ctx.beginPath();
      ctx.moveTo(0, mainChartHeight);
      displayCandles.forEach((c, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const y = getY(c.close);
        ctx.lineTo(x, y);
      });
      ctx.lineTo((count - 1) * candleWidth + candleWidth / 2, mainChartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Top Line
      ctx.strokeStyle = '#00e676';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      displayCandles.forEach((c, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const y = getY(c.close);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else if (chartStyle === 'bars') {
      // Western OHLC Tick Bars
      displayCandles.forEach((c, i) => {
        const x = i * candleWidth + candleWidth / 2;
        const isBull = c.close >= c.open;
        const color = isBull ? '#00e676' : '#ff1744';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;

        // Vertical High-Low spine
        ctx.beginPath();
        ctx.moveTo(x, getY(c.high));
        ctx.lineTo(x, getY(c.low));
        ctx.stroke();

        // Left Open Tick
        ctx.beginPath();
        ctx.moveTo(x - bodyWidth / 2, getY(c.open));
        ctx.lineTo(x, getY(c.open));
        ctx.stroke();

        // Right Close Tick
        ctx.beginPath();
        ctx.moveTo(x, getY(c.close));
        ctx.lineTo(x + bodyWidth / 2, getY(c.close));
        ctx.stroke();
      });
    } else {
      // Candlesticks (Classic or Heikin-Ashi)
      displayCandles.forEach((c, i) => {
        const x = i * candleWidth + (candleWidth - bodyWidth) / 2;
        const centerX = x + bodyWidth / 2;
        const isBull = c.close >= c.open;
        const color = isBull ? '#00e676' : '#ff1744';

        // Upper & Lower Wicks
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(centerX, getY(c.high));
        ctx.lineTo(centerX, getY(Math.max(c.open, c.close)));
        ctx.moveTo(centerX, getY(Math.min(c.open, c.close)));
        ctx.lineTo(centerX, getY(c.low));
        ctx.stroke();

        // Candle Body
        const top = getY(Math.max(c.open, c.close));
        const bottom = getY(Math.min(c.open, c.close));
        const bodyHeight = Math.max(1.5, bottom - top);

        ctx.fillStyle = color;
        ctx.fillRect(x, top, bodyWidth, bodyHeight);

        // Subtle glow border
        ctx.strokeStyle = isBull ? '#69f0ae' : '#ff5252';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, top, bodyWidth, bodyHeight);
      });
    }

    // 8. Latest Active Price Line with Live Pulsing Badge
    const latestCandle = displayCandles[count - 1];
    const liveY = getY(latestCandle.close);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#00e676';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, liveY);
    ctx.lineTo(chartWidth, liveY);
    ctx.stroke();
    ctx.restore();

    // Right Axis Price Badge
    ctx.fillStyle = '#00e676';
    ctx.beginPath();
    ctx.roundRect(chartWidth + 3, liveY - 10, paddingRight - 8, 20, 4);
    ctx.fill();

    ctx.fillStyle = '#0a0a0a';
    ctx.font = 'bold 10px ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(latestCandle.close.toFixed(selectedAsset.decimalPlaces || 4), chartWidth + 35, liveY + 3.5);

    // 8.1. Entry Markers for Open Positions on Active Asset
    const activePositions = positions.filter(
      (p) => p.accountType === accountType && p.status === 'OPEN' && p.symbol === selectedAsset.symbol
    );

    activePositions.forEach((pos) => {
      const entryY = getY(pos.openPrice);
      if (entryY >= 0 && entryY <= mainChartHeight) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = pos.type === 'BUY' ? '#00e676' : '#ff1744';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(0, entryY);
        ctx.lineTo(chartWidth, entryY);
        ctx.stroke();

        // Entry Marker Pill Tag on Chart
        const entryTag = `${pos.type} ${pos.lots}L @ ${pos.openPrice.toFixed(selectedAsset.decimalPlaces || 4)}`;
        ctx.fillStyle = pos.type === 'BUY' ? '#064e3b' : '#7f1d1d';
        ctx.strokeStyle = pos.type === 'BUY' ? '#00e676' : '#ff1744';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(8, entryY - 9, 135, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px ui-monospace, monospace';
        ctx.textAlign = 'left';
        ctx.fillText(entryTag, 14, entryY + 3.5);
        ctx.restore();
      }
    });

    // 8.2. Exit Markers for Closed Trades on Active Asset
    const recentClosed = closedTrades
      .filter((t) => t.accountType === accountType && t.symbol === selectedAsset.symbol && t.closePrice)
      .slice(0, 4);

    recentClosed.forEach((t) => {
      if (!t.closePrice) return;
      const exitY = getY(t.closePrice);
      if (exitY >= 0 && exitY <= mainChartHeight) {
        ctx.save();
        ctx.fillStyle = t.pnl >= 0 ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.arc(chartWidth - 25, exitY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px ui-monospace, monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`EXIT ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(1)}`, chartWidth - 32, exitY + 3);
        ctx.restore();
      }
    });

    // 9. Interactive Crosshair & Inspection Point
    if (mousePos && mousePos.x <= chartWidth && mousePos.y <= mainChartHeight) {
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, mainChartHeight);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(chartWidth, mousePos.y);
      ctx.stroke();
      ctx.restore();

      // Crosshair Price Box on Right Scale
      const hoveredPrice = paddedMax - (mousePos.y / mainChartHeight) * finalRange;
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(chartWidth + 3, mousePos.y - 10, paddingRight - 8, 20, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(hoveredPrice.toFixed(selectedAsset.decimalPlaces || 4), chartWidth + 35, mousePos.y + 3.5);
    }

    // 10. RSI Sub-Chart (When Enabled)
    if (indicators.rsi) {
      const rsiTop = mainChartHeight + 10;
      const rsiHeight = 70;

      // Pane divider
      ctx.strokeStyle = '#262626';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, rsiTop - 5);
      ctx.lineTo(width, rsiTop - 5);
      ctx.stroke();

      // RSI Label
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('RSI (14)', 8, rsiTop + 12);

      // Overbought 70 Line
      const y70 = rsiTop + rsiHeight * 0.3;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(0, y70);
      ctx.lineTo(chartWidth, y70);
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.font = '9px monospace';
      ctx.fillText('70', chartWidth + 8, y70 + 3);

      // Oversold 30 Line
      const y30 = rsiTop + rsiHeight * 0.7;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
      ctx.beginPath();
      ctx.moveTo(0, y30);
      ctx.lineTo(chartWidth, y30);
      ctx.stroke();

      ctx.fillStyle = '#22c55e';
      ctx.fillText('30', chartWidth + 8, y30 + 3);

      // Midline 50
      const y50 = rsiTop + rsiHeight * 0.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(0, y50);
      ctx.lineTo(chartWidth, y50);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw RSI Curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      let startedRsi = false;
      for (let i = 0; i < count; i++) {
        const val = rsiValues[i];
        if (val !== null) {
          const x = i * candleWidth + candleWidth / 2;
          const y = rsiTop + rsiHeight * (1 - val / 100);
          if (!startedRsi) {
            ctx.moveTo(x, y);
            startedRsi = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
      ctx.stroke();
    }
  }, [
    displayCandles,
    chartStyle,
    indicators,
    selectedAsset,
    mousePos,
    ema9Values,
    ema21Values,
    bollingerBands,
    rsiValues,
  ]);

  // Handle canvas mouse tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || displayCandles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const chartWidth = rect.width - 72;
    if (x >= 0 && x <= chartWidth) {
      const candleWidth = chartWidth / displayCandles.length;
      const index = Math.floor(x / candleWidth);
      if (index >= 0 && index < displayCandles.length) {
        setHoveredCandle(displayCandles[index]);
        setHoveredIndex(index);
      }
    } else {
      setHoveredCandle(null);
      setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setHoveredCandle(null);
    setHoveredIndex(null);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
      {/* 1. Chart Control & HUD Toolbar */}
      <div className="px-4 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Asset Identity & Timeframe Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm tracking-tight">
              {selectedAsset.symbol}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                selectedAsset.change24h >= 0
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {selectedAsset.change24h >= 0 ? '+' : ''}
              {selectedAsset.change24h}%
            </span>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-neutral-800 text-emerald-400 font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Chart Style Selector & Indicators Suite */}
        <div className="flex items-center gap-2">
          {/* Chart Style Switcher */}
          <div className="flex items-center gap-0.5 bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-[11px]">
            <button
              type="button"
              onClick={() => setChartStyle('candle')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartStyle === 'candle'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Japanese Candlesticks"
            >
              Candles
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('area')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartStyle === 'area'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Smooth Mountain Area Chart"
            >
              Area
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('heikin')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartStyle === 'heikin'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Heikin-Ashi Trend Smoothed"
            >
              Trend
            </button>
            <button
              type="button"
              onClick={() => setChartStyle('bars')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                chartStyle === 'bars'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Western OHLC Bars"
            >
              Bars
            </button>
          </div>

          {/* Indicator Quick Badges */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleIndicator('sma')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                indicators.sma
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
              title="Toggle Fast EMA (9) & Slow EMA (21)"
            >
              <span>EMA 9/21</span>
            </button>

            <button
              type="button"
              onClick={() => toggleIndicator('bollinger')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                indicators.bollinger
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/40'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
              title="Toggle Bollinger Bands (20, 2)"
            >
              <span>Bands</span>
            </button>

            <button
              type="button"
              onClick={() => toggleIndicator('volume')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                indicators.volume
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
              title="Toggle Volume Histogram"
            >
              <span>Vol</span>
            </button>

            <button
              type="button"
              onClick={() => toggleIndicator('rsi')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                indicators.rsi
                  ? 'bg-sky-500/10 text-sky-400 border-sky-500/40'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800'
              }`}
              title="Toggle Relative Strength Index (RSI 14)"
            >
              <span>RSI 14</span>
            </button>
          </div>

          {/* Price Alert Shortcut */}
          <button
            type="button"
            onClick={() => setIsAlertModalOpen(true)}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-400 border border-neutral-800 transition-colors"
            title="Set Price Alert on this pair"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 2. Live OHLC Readout HUD */}
      {activeHudCandle && (
        <div className="px-4 py-1.5 bg-neutral-950/95 border-b border-neutral-900 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 font-mono">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <span className="text-neutral-500 mr-1">O:</span>
              <span className="text-white font-semibold">
                {activeHudCandle.open.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1">H:</span>
              <span className="text-emerald-400 font-semibold">
                {activeHudCandle.high.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1">L:</span>
              <span className="text-rose-400 font-semibold">
                {activeHudCandle.low.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1">C:</span>
              <span className="text-white font-semibold">
                {activeHudCandle.close.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 mr-1">Vol:</span>
              <span className="text-neutral-300">
                {activeHudCandle.volume.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {indicators.sma && (
              <span className="text-[10px] text-cyan-400">
                EMA 9: {ema9Values[ema9Values.length - 1]?.toFixed(selectedAsset.decimalPlaces || 4) || '—'}
              </span>
            )}
            {indicators.rsi && activeHudRsi !== null && (
              <span
                className={`text-[10px] font-bold ${
                  activeHudRsi >= 70
                    ? 'text-rose-400'
                    : activeHudRsi <= 30
                    ? 'text-emerald-400'
                    : 'text-sky-400'
                }`}
              >
                RSI: {activeHudRsi.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* 3. Interactive Chart Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[400px] relative bg-neutral-950 cursor-crosshair select-none"
      >
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="w-full h-full block"
        />
      </div>

      {/* 4. Integrated Quick Buy/Sell Controls & Estimated P&L Calculator */}
      <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Position Size / Lots Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-400">Position Size:</span>
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
              <button
                type="button"
                onClick={() => setQuickLots((prev) => Math.max(0.01, parseFloat((prev - 0.05).toFixed(2))))}
                className="w-6 h-6 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold"
                title="Decrease 0.05 lots"
              >
                -
              </button>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="10.0"
                value={quickLots}
                onChange={(e) => setQuickLots(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
                className="w-16 px-1.5 py-0.5 bg-transparent text-center font-bold font-mono text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 font-mono pr-1">LOTS</span>
              <button
                type="button"
                onClick={() => setQuickLots((prev) => parseFloat((prev + 0.05).toFixed(2)))}
                className="w-6 h-6 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 flex items-center justify-center font-bold"
                title="Increase 0.05 lots"
              >
                +
              </button>
            </div>

            {/* Quick Lot Chips */}
            <div className="hidden sm:flex items-center gap-1">
              {[0.01, 0.05, 0.10, 0.50, 1.00].map((lot) => (
                <button
                  key={lot}
                  type="button"
                  onClick={() => setQuickLots(lot)}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                    quickLots === lot
                      ? 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/30'
                      : 'bg-neutral-950 text-neutral-500 hover:text-white border border-neutral-850'
                  }`}
                >
                  {lot}L
                </button>
              ))}
            </div>
          </div>

          {/* Estimated P&L and Margin Preview */}
          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <div>
              <span>Est. P&amp;L (10 pips): </span>
              <strong className="text-emerald-400 font-mono font-semibold">
                ±${(quickLots * 10).toFixed(2)} (KSh {Math.round(quickLots * 10 * 130).toLocaleString()})
              </strong>
            </div>
            <div className="hidden md:block">
              <span>Margin Req: </span>
              <span className="text-neutral-300 font-mono">
                {formatMoney((quickLots * 100000) / 100)}
              </span>
            </div>
            <div>
              <span>Spread: </span>
              <span className="text-amber-400 font-mono font-bold">
                {selectedAsset.spread} pips
              </span>
            </div>
          </div>
        </div>

        {/* Instant Buy and Sell Execution Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* SELL (SHORT) */}
          <button
            type="button"
            onClick={() => openPosition('SELL', quickLots, 100)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold transition-all shadow-md flex items-center justify-between group"
          >
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-red-200 block">
                SELL (Short)
              </span>
              <span className="text-sm font-mono font-extrabold text-white">
                {selectedAsset.bid.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-red-200 uppercase block">Bid Market</span>
              <span className="text-[10px] font-mono bg-red-950/60 px-1.5 py-0.5 rounded text-white font-bold">
                {quickLots} Lots
              </span>
            </div>
          </button>

          {/* BUY (LONG) */}
          <button
            type="button"
            onClick={() => openPosition('BUY', quickLots, 100)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-neutral-950 font-bold transition-all shadow-md flex items-center justify-between group"
          >
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-emerald-950 block">
                BUY (Long)
              </span>
              <span className="text-sm font-mono font-extrabold text-neutral-950">
                {selectedAsset.ask.toFixed(selectedAsset.decimalPlaces || 4)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-emerald-950 uppercase block">Ask Market</span>
              <span className="text-[10px] font-mono bg-emerald-950/30 px-1.5 py-0.5 rounded text-neutral-950 font-bold">
                {quickLots} Lots
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
