import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  AccountType,
  CurrencyType,
  ForexAsset,
  Candle,
  TradingPosition,
  SocialService,
  SocialOrder,
  CampaignPackage,
  Transaction,
  PriceAlert,
  UserProfile,
  UserRole,
  AviatorBet,
  SportsMatch,
  BetSlipItem,
  SettledBet,
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_SERVICES,
  CAMPAIGN_PACKAGES,
  generateInitialCandles,
  INITIAL_SPORTS_MATCHES,
  DEMO_USERS,
  INITIAL_SETTLED_BETS,
} from '../data/mockData';

const KES_USD_RATE = 130.0; // 1 USD = 130 KES
export const MIN_DEPOSIT_KES = 200; // Minimum deposit allowed: KSh 200

interface AppContextType {
  // Account & Wallet
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  formatMoney: (amountUsd: number, overrideCurrency?: CurrencyType) => string;
  usdToCurrentCurrency: (amountUsd: number) => number;
  currentCurrencyToUsd: (amount: number) => number;
  demoBalance: number;
  realBalance: number;
  currentBalance: number;
  equity: number;
  usedMargin: number;
  freeMargin: number;
  marginLevel: number;
  floatingPnl: number;
  kycVerified: boolean;
  verifyKyc: (fullName: string, idNumber: string) => void;
  resetDemoBalance: () => void;
  depositFunds: (amount: number, curr: CurrencyType, method: string, ref: string) => Promise<boolean>;
  withdrawFunds: (amount: number, curr: CurrencyType, method: string, recipient: string) => Promise<boolean>;

  // Forex Market
  assets: ForexAsset[];
  selectedAsset: ForexAsset;
  setSelectedAssetId: (id: string) => void;
  candles: Candle[];
  timeframe: string;
  setTimeframe: (tf: string) => void;
  indicators: { sma: boolean; rsi: boolean; volume: boolean; bollinger: boolean };
  toggleIndicator: (key: 'sma' | 'rsi' | 'volume' | 'bollinger') => void;

  // Trading Execution
  positions: TradingPosition[];
  closedTrades: TradingPosition[];
  openPosition: (
    type: 'BUY' | 'SELL',
    lots: number,
    leverage: number,
    sl?: number,
    tp?: number
  ) => { success: boolean; message: string };
  closePosition: (positionId: string) => void;
  modifyPosition: (positionId: string, sl?: number, tp?: number) => void;

  // Price Alerts & Push Notifications
  priceAlerts: PriceAlert[];
  addPriceAlert: (
    symbol: string,
    targetPrice: number,
    condition: 'ABOVE' | 'BELOW',
    note?: string
  ) => { success: boolean; message: string; alertId?: string };
  deletePriceAlert: (id: string) => void;
  togglePriceAlert: (id: string) => void;
  unreadAlertsCount: number;
  markAlertsAsRead: () => void;
  pushPermission: NotificationPermission | 'unsupported';
  requestPushPermission: () => Promise<void>;
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (open: boolean) => void;
  voteSentiment: (symbol: string, stance: 'bull' | 'bear') => void;

  // Social Boosting Hub
  services: SocialService[];
  campaigns: CampaignPackage[];
  socialOrders: SocialOrder[];
  placeSocialOrder: (
    serviceId: string,
    targetLink: string,
    quantity: number,
    paymentMethod: 'wallet' | 'mpesa'
  ) => { success: boolean; message: string; orderId?: string };
  placeCampaignOrder: (
    campaignId: string,
    targetLink: string,
    paymentMethod: 'wallet' | 'mpesa'
  ) => { success: boolean; message: string; orderId?: string };
  requestRefill: (orderId: string) => void;

  // Transactions & History
  transactions: Transaction[];

  // Auth & User Profile
  currentUser: UserProfile;
  allUsers: UserProfile[];
  login: (emailOrPhone: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Referral Program (KSh 50 per referral, max KSh 1,000 withdrawal)
  claimReferralBonus: (amountKes: number) => { success: boolean; message: string };
  addMockReferral: () => void;

  // Sports Betting & Aviator
  sportsMatches: SportsMatch[];
  betSlip: BetSlipItem[];
  addToBetSlip: (item: BetSlipItem) => void;
  removeFromBetSlip: (matchId: string) => void;
  clearBetSlip: () => void;
  placeSportsBet: (stakeKes: number) => { success: boolean; message: string };
  aviatorBets: AviatorBet[];
  aviatorHistory: number[];
  placeAviatorBet: (stakeKes: number, autoCashout?: number) => { success: boolean; message: string; betId?: string };
  cashoutAviatorBet: (betId: string, currentMultiplier: number) => { success: boolean; message: string; payoutKes?: number };
  recordAviatorRoundCrash: (multiplier: number) => void;
  settledBets: SettledBet[];

  // Admin Management
  updateUserKycStatus: (userId: string, status: 'verified' | 'rejected') => void;
  approveWithdrawalTransaction: (transactionId: string) => void;
  rejectWithdrawalTransaction: (transactionId: string, reason: string) => void;

  // Navigation & Modals
  activeTab: 'terminal' | 'betting' | 'boosting' | 'campaigns' | 'orders' | 'wallet' | 'admin';
  setActiveTab: (tab: 'terminal' | 'betting' | 'boosting' | 'campaigns' | 'orders' | 'wallet' | 'admin') => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
  isKycModalOpen: boolean;
  setIsKycModalOpen: (open: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts
  const [accountType, setAccountType] = useState<AccountType>('demo');
  const [currency, setCurrency] = useState<CurrencyType>('KES');
  const [demoBalance, setDemoBalance] = useState<number>(10000.0);
  const [realBalance, setRealBalance] = useState<number>(150.0);
  const [kycVerified, setKycVerified] = useState<boolean>(false);

  // Market Assets
  const [assets, setAssets] = useState<ForexAsset[]>(INITIAL_ASSETS);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('eurusd');
  const [timeframe, setTimeframe] = useState<string>('5m');
  const [indicators, setIndicators] = useState({
    sma: true,
    rsi: false,
    volume: true,
    bollinger: false,
  });

  // Price Alerts State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    {
      id: 'alt-101',
      symbol: 'EUR/USD',
      targetPrice: 1.0880,
      condition: 'ABOVE',
      note: 'Resistance breakout watch',
      createdAt: Date.now() - 3600000 * 2,
      isActive: true,
      initialPrice: 1.0864,
    },
    {
      id: 'alt-102',
      symbol: 'USD/KES',
      targetPrice: 131.00,
      condition: 'BELOW',
      note: 'Local currency strengthening target',
      createdAt: Date.now() - 3600000 * 4,
      isActive: true,
      initialPrice: 131.25,
    },
  ]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  // Request browser push permission
  const requestPushPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          showNotification('System Push Notifications enabled! You will receive native alerts when prices trigger.', 'success');
          try {
            new Notification('WurlFX Push Notifications Active', {
              body: 'You will receive immediate alert notifications when target price thresholds hit.',
            });
          } catch (e) {
            // ignore
          }
        } else if (perm === 'denied') {
          showNotification('Push notifications permission was blocked. You will still receive in-app audible alerts.', 'info');
        }
      } catch (err) {
        console.error('Push notification request error:', err);
      }
    }
  }, []);

  // Web Audio Synthesizer for high-fidelity price alert chimes
  const playAlertChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const playTone = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      };
      playTone(659.25, ctx.currentTime, 0.16); // E5
      playTone(880.00, ctx.currentTime + 0.11, 0.28); // A5
    } catch (e) {
      // Audio context blocked
    }
  }, []);

  // Selected Asset & Candles
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0];
  }, [assets, selectedAssetId]);

  const [candles, setCandles] = useState<Candle[]>(() =>
    generateInitialCandles(INITIAL_ASSETS[0].basePrice, 50, 5)
  );

  // Regenerate candle history when asset changes
  useEffect(() => {
    setCandles(generateInitialCandles(selectedAsset.basePrice, 50, 5));
  }, [selectedAssetId]);

  // Positions
  const [positions, setPositions] = useState<TradingPosition[]>([
    {
      id: 'pos-101',
      accountType: 'demo',
      symbol: 'EUR/USD',
      type: 'BUY',
      lots: 0.5,
      openPrice: 1.0858,
      currentPrice: 1.0864,
      sl: 1.0820,
      tp: 1.0920,
      pnl: 30.0,
      timestamp: Date.now() - 3600000 * 2,
      margin: 108.64,
      leverage: 100,
      status: 'OPEN',
    },
    {
      id: 'pos-102',
      accountType: 'demo',
      symbol: 'USD/KES',
      type: 'SELL',
      lots: 0.2,
      openPrice: 131.50,
      currentPrice: 131.25,
      sl: 132.20,
      tp: 130.50,
      pnl: 38.46,
      timestamp: Date.now() - 3600000 * 5,
      margin: 52.5,
      leverage: 100,
      status: 'OPEN',
    },
  ]);

  const [closedTrades, setClosedTrades] = useState<TradingPosition[]>([
    {
      id: 'pos-099',
      accountType: 'demo',
      symbol: 'XAU/USD',
      type: 'BUY',
      lots: 0.2,
      openPrice: 2728.5,
      currentPrice: 2736.4,
      closePrice: 2736.4,
      sl: 2715.0,
      tp: 2740.0,
      pnl: 158.0,
      timestamp: Date.now() - 86400000,
      closedAt: Date.now() - 43200000,
      margin: 109.4,
      leverage: 100,
      status: 'CLOSED',
    },
    {
      id: 'pos-098',
      accountType: 'demo',
      symbol: 'USD/KES',
      type: 'SELL',
      lots: 0.5,
      openPrice: 131.8,
      currentPrice: 131.25,
      closePrice: 131.25,
      sl: 132.5,
      tp: 130.8,
      pnl: 209.52,
      timestamp: Date.now() - 86400000 * 2,
      closedAt: Date.now() - 86400000 * 1.5,
      margin: 65.6,
      leverage: 100,
      status: 'CLOSED',
    },
    {
      id: 'pos-097',
      accountType: 'demo',
      symbol: 'EUR/USD',
      type: 'BUY',
      lots: 0.3,
      openPrice: 1.082,
      currentPrice: 1.0855,
      closePrice: 1.0855,
      sl: 1.078,
      tp: 1.086,
      pnl: 105.0,
      timestamp: Date.now() - 86400000 * 3,
      closedAt: Date.now() - 86400000 * 2.8,
      margin: 32.5,
      leverage: 100,
      status: 'CLOSED',
    },
    {
      id: 'pos-096',
      accountType: 'demo',
      symbol: 'GBP/USD',
      type: 'SELL',
      lots: 0.25,
      openPrice: 1.299,
      currentPrice: 1.3015,
      closePrice: 1.3015,
      sl: 1.302,
      tp: 1.294,
      pnl: -62.5,
      timestamp: Date.now() - 86400000 * 4,
      closedAt: Date.now() - 86400000 * 3.5,
      margin: 32.5,
      leverage: 100,
      status: 'CLOSED',
    },
    {
      id: 'pos-095',
      accountType: 'demo',
      symbol: 'BTC/USD',
      type: 'BUY',
      lots: 0.1,
      openPrice: 67200.0,
      currentPrice: 68450.0,
      closePrice: 68450.0,
      sl: 66000.0,
      tp: 69000.0,
      pnl: 125.0,
      timestamp: Date.now() - 86400000 * 5,
      closedAt: Date.now() - 86400000 * 4.2,
      margin: 67.2,
      leverage: 100,
      status: 'CLOSED',
    },
  ]);

  // Social Boosting Orders
  const [services] = useState<SocialService[]>(INITIAL_SERVICES);
  const [campaigns] = useState<CampaignPackage[]>(CAMPAIGN_PACKAGES);
  const [socialOrders, setSocialOrders] = useState<SocialOrder[]>([
    {
      id: 'WFX-74921',
      serviceId: 'tt_followers_vip',
      serviceName: 'TikTok High-Retention Followers',
      platform: 'tiktok',
      targetLink: 'https://tiktok.com/@wurl_sphilah',
      quantity: 5000,
      totalKes: 4750,
      totalUsd: 36.54,
      status: 'IN_PROGRESS',
      progressPercent: 78,
      deliveredCount: 3900,
      createdAt: Date.now() - 3600000 * 14,
      estimatedDelivery: 'Completes in ~4 hours',
    },
    {
      id: 'WFX-74812',
      serviceId: 'starter_growth',
      serviceName: 'Starter Creator Breakthrough (Campaign)',
      platform: 'tiktok',
      targetLink: 'https://tiktok.com/@wurl_creators',
      quantity: 1,
      totalKes: 15000,
      totalUsd: 115.38,
      status: 'IN_PROGRESS',
      progressPercent: 45,
      deliveredCount: 4500,
      createdAt: Date.now() - 3600000 * 36,
      estimatedDelivery: 'Completes in ~2 days',
    },
    {
      id: 'WFX-74630',
      serviceId: 'yt_subscribers',
      serviceName: 'YouTube Permanent Subscribers',
      platform: 'youtube',
      targetLink: 'https://youtube.com/@WurlFX_Official',
      quantity: 1000,
      totalKes: 2400,
      totalUsd: 18.46,
      status: 'COMPLETED',
      progressPercent: 100,
      deliveredCount: 1000,
      createdAt: Date.now() - 86400000 * 4,
      estimatedDelivery: 'Fulfilled & Active Refill Guarantee',
    },
  ]);

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-9842',
      type: 'DEPOSIT',
      amountKes: 15000,
      amountUsd: 115.38,
      method: 'M-Pesa STK (400200)',
      status: 'COMPLETED',
      timestamp: Date.now() - 86400000 * 2,
      notes: 'Initial real trading & boost credit via Safaricom M-Pesa 0762294296 (Paybill 400200 / 25470215481001)',
    },
    {
      id: 'TXN-9811',
      type: 'BOOST_ORDER',
      amountKes: 4750,
      amountUsd: 36.54,
      method: 'WurlFX Wallet',
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000 * 14,
      notes: 'Order #WFX-74921: TikTok High-Retention Followers',
    },
  ]);

  // User Profiles & Auth State
  const [allUsers, setAllUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sports Betting & Aviator State
  const [sportsMatches, setSportsMatches] = useState<SportsMatch[]>(INITIAL_SPORTS_MATCHES);
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [settledBets, setSettledBets] = useState<SettledBet[]>(INITIAL_SETTLED_BETS);
  const [aviatorBets, setAviatorBets] = useState<AviatorBet[]>([]);
  const [aviatorHistory, setAviatorHistory] = useState<number[]>([1.32, 2.15, 1.10, 8.42, 1.95, 3.20, 1.48, 14.80, 2.05, 1.25, 4.50]);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<'terminal' | 'betting' | 'boosting' | 'campaigns' | 'orders' | 'wallet' | 'admin'>('terminal');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4500);
  }, []);

  // Conversion helpers
  const usdToCurrentCurrency = useCallback((amountUsd: number) => {
    return currency === 'KES' ? amountUsd * KES_USD_RATE : amountUsd;
  }, [currency]);

  const currentCurrencyToUsd = useCallback((amount: number) => {
    return currency === 'KES' ? amount / KES_USD_RATE : amount;
  }, [currency]);

  const formatMoney = useCallback((amountUsd: number, overrideCurrency?: CurrencyType) => {
    const targetCurr = overrideCurrency || currency;
    if (targetCurr === 'KES') {
      const kes = amountUsd * KES_USD_RATE;
      return `KSh ${kes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$${amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currency]);

  // Active balance based on Demo / Real
  const currentBalance = accountType === 'demo' ? demoBalance : realBalance;

  // Real-time market tick generator + Price Alert Threshold Evaluator
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Market Quotes
      setAssets((prevAssets) => {
        const nextAssets = prevAssets.map((asset) => {
          const deltaFactor = (Math.random() - 0.495) * 0.0006;
          const newBid = Math.max(0.00001, asset.bid * (1 + deltaFactor));
          const spreadOffset = (asset.spread / asset.pipMultiplier);
          const newAsk = newBid + spreadOffset;
          const newHigh = Math.max(asset.high24h, newAsk);
          const newLow = Math.min(asset.low24h, newBid);
          const change = ((newBid - asset.basePrice) / asset.basePrice) * 100;
          const updatedSpark = [...asset.sparkline.slice(1), newBid];

          let updatedSentiment = asset.sentiment;
          if (asset.sentiment) {
            const nudge = deltaFactor > 0 ? 0.05 : -0.05;
            const newBull = Math.min(88, Math.max(12, +(asset.sentiment.bullPercent + nudge).toFixed(1)));
            const newBear = +(100 - newBull).toFixed(1);
            updatedSentiment = {
              ...asset.sentiment,
              bullPercent: newBull,
              bearPercent: newBear,
              stance:
                newBull >= 65
                  ? 'Strong Bullish'
                  : newBull >= 54
                  ? 'Bullish'
                  : newBull <= 35
                  ? 'Strong Bearish'
                  : newBull <= 46
                  ? 'Bearish'
                  : 'Neutral',
            };
          }

          return {
            ...asset,
            bid: newBid,
            ask: newAsk,
            high24h: newHigh,
            low24h: newLow,
            change24h: Number(change.toFixed(2)),
            sparkline: updatedSpark,
            sentiment: updatedSentiment,
          };
        });

        // 2. Check active price alerts against new asset prices
        setPriceAlerts((prevAlerts) => {
          let anyTriggered = false;
          const updatedAlerts = prevAlerts.map((alert) => {
            if (!alert.isActive) return alert;
            const asset = nextAssets.find((a) => a.symbol === alert.symbol);
            if (!asset) return alert;

            const isAboveTrigger = alert.condition === 'ABOVE' && asset.bid >= alert.targetPrice;
            const isBelowTrigger = alert.condition === 'BELOW' && asset.bid <= alert.targetPrice;

            if (isAboveTrigger || isBelowTrigger) {
              anyTriggered = true;
              // Play audible alert chime
              playAlertChime();

              // Trigger Native Push Notification if permission granted
              if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                try {
                  new Notification(`WurlFX Price Alert: ${alert.symbol}`, {
                    body: `${alert.symbol} hit target ${alert.targetPrice.toFixed(asset.decimalPlaces)} (Current: ${asset.bid.toFixed(asset.decimalPlaces)})! ${alert.note ? `Note: ${alert.note}` : ''}`,
                    tag: `alert-${alert.id}`,
                  });
                } catch (e) {
                  console.warn('Native notification failed:', e);
                }
              }

              // In-app alert notification
              showNotification(
                `🔔 PRICE ALERT HIT: ${alert.symbol} reached ${asset.bid.toFixed(asset.decimalPlaces)} (Target: ${alert.condition === 'ABOVE' ? '≥' : '≤'} ${alert.targetPrice.toFixed(asset.decimalPlaces)})! ${alert.note ? `[${alert.note}]` : ''}`,
                'success'
              );

              return {
                ...alert,
                isActive: false,
                triggeredAt: Date.now(),
              };
            }
            return alert;
          });

          if (anyTriggered) {
            setUnreadAlertsCount((prev) => prev + 1);
          }
          return updatedAlerts;
        });

        return nextAssets;
      });

      // Increment progress for in-progress social orders naturally
      setSocialOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (ord.status === 'IN_PROGRESS' && ord.progressPercent < 100) {
            const addPercent = Math.random() > 0.6 ? 1 : 0;
            const newPercent = Math.min(100, ord.progressPercent + addPercent);
            const newDelivered = Math.floor((newPercent / 100) * ord.quantity);
            return {
              ...ord,
              progressPercent: newPercent,
              deliveredCount: newDelivered,
              status: newPercent === 100 ? 'COMPLETED' : 'IN_PROGRESS',
            };
          }
          return ord;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [playAlertChime, showNotification]);

  // Update candle of selected asset in real-time
  useEffect(() => {
    const currentPrice = selectedAsset.bid;
    setCandles((prevCandles) => {
      if (prevCandles.length === 0) return prevCandles;
      const lastIndex = prevCandles.length - 1;
      const last = prevCandles[lastIndex];

      const updatedLast: Candle = {
        ...last,
        high: Math.max(last.high, currentPrice),
        low: Math.min(last.low, currentPrice),
        close: currentPrice,
        volume: last.volume + 1,
      };

      return [...prevCandles.slice(0, lastIndex), updatedLast];
    });
  }, [selectedAsset.bid]);

  // Calculate live floating P&L on open positions
  const currentPositions = useMemo(() => {
    return positions.filter((p) => p.accountType === accountType && p.status === 'OPEN');
  }, [positions, accountType]);

  const floatingPnl = useMemo(() => {
    let total = 0;
    currentPositions.forEach((pos) => {
      const asset = assets.find((a) => a.symbol === pos.symbol);
      if (!asset) return;
      const priceNow = pos.type === 'BUY' ? asset.bid : asset.ask;
      const diff = pos.type === 'BUY' ? (priceNow - pos.openPrice) : (pos.openPrice - priceNow);
      const units = pos.lots * 100000;
      let profitUsd = diff * units;
      if (pos.symbol === 'USD/JPY' || pos.symbol === 'USD/KES') {
        profitUsd = (diff * units) / priceNow;
      }
      total += profitUsd;
    });
    return total;
  }, [currentPositions, assets]);

  const usedMargin = useMemo(() => {
    return currentPositions.reduce((acc, p) => acc + p.margin, 0);
  }, [currentPositions]);

  const equity = currentBalance + floatingPnl;
  const freeMargin = Math.max(0, equity - usedMargin);
  const marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 999.0;

  // Toggle chart indicator
  const toggleIndicator = useCallback((key: 'sma' | 'rsi' | 'volume' | 'bollinger') => {
    setIndicators((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Price Alert Actions
  const addPriceAlert = useCallback(
    (
      symbol: string,
      targetPrice: number,
      condition: 'ABOVE' | 'BELOW',
      note?: string
    ) => {
      const asset = assets.find((a) => a.symbol === symbol) || selectedAsset;
      const alertId = `alt-${Date.now().toString().slice(-6)}`;
      const newAlert: PriceAlert = {
        id: alertId,
        symbol: asset.symbol,
        targetPrice,
        condition,
        note,
        createdAt: Date.now(),
        isActive: true,
        initialPrice: asset.bid,
      };

      setPriceAlerts((prev) => [newAlert, ...prev]);

      // If user hasn't granted push yet, proactively request
      if (pushPermission === 'default') {
        requestPushPermission();
      }

      showNotification(
        `Custom Price Alert Created: ${asset.symbol} ${condition === 'ABOVE' ? '≥' : '≤'} ${targetPrice.toFixed(asset.decimalPlaces)}`,
        'success'
      );

      return { success: true, message: 'Price threshold alert configured', alertId };
    },
    [assets, selectedAsset, pushPermission, requestPushPermission, showNotification]
  );

  const deletePriceAlert = useCallback((id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    showNotification('Price alert removed', 'info');
  }, [showNotification]);

  const togglePriceAlert = useCallback((id: string) => {
    setPriceAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  }, []);

  const markAlertsAsRead = useCallback(() => {
    setUnreadAlertsCount(0);
  }, []);

  const voteSentiment = useCallback(
    (symbol: string, stance: 'bull' | 'bear') => {
      setAssets((prev) =>
        prev.map((a) => {
          if (a.symbol !== symbol || !a.sentiment) return a;
          const currentVotes = a.sentiment.communityVotes;
          const nextBullVotes = stance === 'bull' ? currentVotes.bull + 1 : currentVotes.bull;
          const nextBearVotes = stance === 'bear' ? currentVotes.bear + 1 : currentVotes.bear;
          const total = nextBullVotes + nextBearVotes;
          const bullPct = Math.round((nextBullVotes / total) * 100);
          const bearPct = 100 - bullPct;

          let stanceLabel: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish' = 'Neutral';
          if (bullPct >= 65) stanceLabel = 'Strong Bullish';
          else if (bullPct >= 54) stanceLabel = 'Bullish';
          else if (bullPct <= 35) stanceLabel = 'Strong Bearish';
          else if (bullPct <= 46) stanceLabel = 'Bearish';

          return {
            ...a,
            sentiment: {
              ...a.sentiment,
              bullPercent: bullPct,
              bearPercent: bearPct,
              stance: stanceLabel,
              communityVotes: { bull: nextBullVotes, bear: nextBearVotes },
            },
          };
        })
      );
      showNotification(`Your ${stance === 'bull' ? 'Bullish' : 'Bearish'} sentiment vote was recorded for ${symbol}!`, 'success');
    },
    [showNotification]
  );

  // Open position handler
  const openPosition = useCallback(
    (
      type: 'BUY' | 'SELL',
      lots: number,
      leverage: number,
      sl?: number,
      tp?: number
    ) => {
      if (accountType === 'real' && !kycVerified) {
        setIsKycModalOpen(true);
        return {
          success: false,
          message: 'Legal regulatory compliance requires KYC identity verification before real-money trading.',
        };
      }

      const asset = selectedAsset;
      const executionPrice = type === 'BUY' ? asset.ask : asset.bid;
      const notionalValueUsd = lots * 100000;
      const requiredMargin = notionalValueUsd / leverage;

      if (requiredMargin > freeMargin) {
        return {
          success: false,
          message: `Insufficient Free Margin (${formatMoney(freeMargin)}). Needed: ${formatMoney(requiredMargin)}.`,
        };
      }

      const newPos: TradingPosition = {
        id: `pos-${Date.now().toString().slice(-6)}`,
        accountType,
        symbol: asset.symbol,
        type,
        lots,
        openPrice: executionPrice,
        currentPrice: executionPrice,
        sl,
        tp,
        pnl: -(asset.spread / asset.pipMultiplier) * lots * 100000,
        timestamp: Date.now(),
        margin: requiredMargin,
        leverage,
        status: 'OPEN',
      };

      setPositions((prev) => [newPos, ...prev]);
      showNotification(`Order Executed: ${type} ${lots} Lots ${asset.symbol} @ ${executionPrice.toFixed(asset.decimalPlaces)}`, 'success');
      return { success: true, message: 'Position executed on live engine' };
    },
    [accountType, kycVerified, selectedAsset, freeMargin, formatMoney, showNotification]
  );

  // Close position handler
  const closePosition = useCallback((positionId: string) => {
    const target = positions.find((p) => p.id === positionId);
    if (!target) return;

    const asset = assets.find((a) => a.symbol === target.symbol) || selectedAsset;
    const closePrice = target.type === 'BUY' ? asset.bid : asset.ask;
    const diff = target.type === 'BUY' ? (closePrice - target.openPrice) : (target.openPrice - closePrice);
    const units = target.lots * 100000;
    let finalPnl = diff * units;
    if (target.symbol === 'USD/JPY' || target.symbol === 'USD/KES') {
      finalPnl = (diff * units) / closePrice;
    }

    if (target.accountType === 'demo') {
      setDemoBalance((prev) => prev + finalPnl);
    } else {
      setRealBalance((prev) => prev + finalPnl);
    }

    const closed: TradingPosition = {
      ...target,
      status: 'CLOSED',
      closePrice,
      closedAt: Date.now(),
      pnl: finalPnl,
    };

    setPositions((prev) => prev.filter((p) => p.id !== positionId));
    setClosedTrades((prev) => [closed, ...prev]);

    const txn: Transaction = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      type: finalPnl >= 0 ? 'TRADE_PROFIT' : 'TRADE_LOSS',
      amountKes: Math.abs(finalPnl * KES_USD_RATE),
      amountUsd: Math.abs(finalPnl),
      method: 'WurlFX Wallet',
      status: 'COMPLETED',
      timestamp: Date.now(),
      notes: `Closed ${target.type} ${target.lots} ${target.symbol} with ${finalPnl >= 0 ? '+' : ''}${formatMoney(finalPnl, 'USD')}`,
    };
    setTransactions((prev) => [txn, ...prev]);

    showNotification(
      `Closed ${target.symbol} | Result: ${finalPnl >= 0 ? '+' : ''}${formatMoney(finalPnl)}`,
      finalPnl >= 0 ? 'success' : 'info'
    );
  }, [positions, assets, selectedAsset, formatMoney, showNotification]);

  // Modify position SL/TP
  const modifyPosition = useCallback((positionId: string, sl?: number, tp?: number) => {
    setPositions((prev) =>
      prev.map((p) => (p.id === positionId ? { ...p, sl, tp } : p))
    );
    showNotification('Risk limits updated (Stop Loss / Take Profit saved)', 'success');
  }, [showNotification]);

  // Reset Demo Balance
  const resetDemoBalance = useCallback(() => {
    setDemoBalance(10000.0);
    setPositions((prev) => prev.filter((p) => p.accountType !== 'demo'));
    showNotification('Demo account balance reset to $10,000.00 virtual funds', 'info');
  }, [showNotification]);

  // KYC Verification
  const verifyKyc = useCallback((fullName: string, idNumber: string) => {
    setKycVerified(true);
    setIsKycModalOpen(false);
    showNotification(`Identity Verified for ${fullName} (ID: ${idNumber}). Real trading unlocked!`, 'success');
  }, [showNotification]);

  // Deposit funds (Enforcing minimum KSh 200)
  const depositFunds = useCallback(
    async (amount: number, curr: CurrencyType, method: string, ref: string) => {
      const amountKes = curr === 'KES' ? amount : amount * KES_USD_RATE;
      const amountUsd = curr === 'KES' ? amount / KES_USD_RATE : amount;

      if (amountKes < MIN_DEPOSIT_KES) {
        showNotification(`Deposit rejected: Minimum deposit allowed is KSh ${MIN_DEPOSIT_KES}.`, 'error');
        return false;
      }

      if (accountType === 'demo') {
        setDemoBalance((prev) => prev + amountUsd);
      } else {
        setRealBalance((prev) => prev + amountUsd);
      }

      const txn: Transaction = {
        id: `DEP-${Date.now().toString().slice(-5)}`,
        type: 'DEPOSIT',
        amountKes,
        amountUsd,
        method: method as any,
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Deposit via ${method} (${ref})`,
      };
      setTransactions((prev) => [txn, ...prev]);
      showNotification(`Deposit credited: ${formatMoney(amountUsd)} via ${method}`, 'success');
      return true;
    },
    [accountType, formatMoney, showNotification]
  );

  // Withdraw funds
  const withdrawFunds = useCallback(
    async (amount: number, curr: CurrencyType, method: string, recipient: string) => {
      const amountUsd = curr === 'KES' ? amount / KES_USD_RATE : amount;
      const currentFunds = accountType === 'demo' ? demoBalance : realBalance;

      if (amountUsd > currentFunds) {
        showNotification(`Withdrawal failed: requested amount exceeds current balance.`, 'error');
        return false;
      }

      if (accountType === 'demo') {
        showNotification('Demo funds are virtual practice credits and cannot be withdrawn to real accounts.', 'error');
        return false;
      }

      setRealBalance((prev) => prev - amountUsd);
      const txn: Transaction = {
        id: `WTH-${Date.now().toString().slice(-5)}`,
        type: 'WITHDRAWAL',
        amountKes: amountUsd * KES_USD_RATE,
        amountUsd,
        method: method as any,
        status: 'PROCESSING',
        timestamp: Date.now(),
        notes: `Payout request to ${recipient} via ${method}`,
      };
      setTransactions((prev) => [txn, ...prev]);
      showNotification(`Withdrawal of ${formatMoney(amountUsd)} dispatched to ${recipient}`, 'success');
      return true;
    },
    [accountType, demoBalance, realBalance, formatMoney, showNotification]
  );

  // Place Social Order
  const placeSocialOrder = useCallback(
    (
      serviceId: string,
      targetLink: string,
      quantity: number,
      paymentMethod: 'wallet' | 'mpesa'
    ) => {
      const srv = services.find((s) => s.id === serviceId);
      if (!srv) return { success: false, message: 'Invalid service selected.' };

      const totalKes = (srv.pricePer1000Kes * quantity) / 1000;
      const totalUsd = (srv.pricePer1000Usd * quantity) / 1000;

      if (paymentMethod === 'wallet') {
        const availableFunds = accountType === 'demo' ? demoBalance : realBalance;
        if (totalUsd > availableFunds) {
          return {
            success: false,
            message: `Insufficient ${accountType} funds (${formatMoney(availableFunds)}). Order total: ${formatMoney(totalUsd)}. Top up or switch payment.`,
          };
        }
        if (accountType === 'demo') {
          setDemoBalance((prev) => prev - totalUsd);
        } else {
          setRealBalance((prev) => prev - totalUsd);
        }
      }

      const orderId = `WFX-${Math.floor(10000 + Math.random() * 90000)}`;
      const newOrder: SocialOrder = {
        id: orderId,
        serviceId: srv.id,
        serviceName: srv.name,
        platform: srv.platform,
        targetLink,
        quantity,
        totalKes,
        totalUsd,
        status: 'PROCESSING',
        progressPercent: 3,
        deliveredCount: Math.floor(quantity * 0.03),
        createdAt: Date.now(),
        estimatedDelivery: srv.speed,
      };

      setSocialOrders((prev) => [newOrder, ...prev]);

      const txn: Transaction = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        type: 'BOOST_ORDER',
        amountKes: totalKes,
        amountUsd: totalUsd,
        method: paymentMethod === 'wallet' ? 'WurlFX Wallet' : 'M-Pesa STK (400200)',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Order ${orderId}: ${quantity} ${srv.name}`,
      };
      setTransactions((prev) => [txn, ...prev]);

      showNotification(`Order ${orderId} queued successfully! Live delivery tracking active.`, 'success');
      return { success: true, message: 'Order submitted to distribution queue', orderId };
    },
    [services, accountType, demoBalance, realBalance, formatMoney, showNotification]
  );

  // Place Campaign Order (Packages starting KSH 15,000)
  const placeCampaignOrder = useCallback(
    (
      campaignId: string,
      targetLink: string,
      paymentMethod: 'wallet' | 'mpesa'
    ) => {
      const camp = campaigns.find((c) => c.id === campaignId);
      if (!camp) return { success: false, message: 'Campaign package not found.' };

      const totalKes = camp.priceKes;
      const totalUsd = camp.priceUsd;

      if (paymentMethod === 'wallet') {
        const availableFunds = accountType === 'demo' ? demoBalance : realBalance;
        if (totalUsd > availableFunds) {
          return {
            success: false,
            message: `Insufficient funds. Needed: ${formatMoney(totalUsd)}. Available: ${formatMoney(availableFunds)}.`,
          };
        }
        if (accountType === 'demo') {
          setDemoBalance((prev) => prev - totalUsd);
        } else {
          setRealBalance((prev) => prev - totalUsd);
        }
      }

      const orderId = `WFX-CMP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: SocialOrder = {
        id: orderId,
        serviceId: camp.id,
        serviceName: `${camp.name} (Campaign Bundle)`,
        platform: 'tiktok',
        targetLink,
        quantity: 1,
        totalKes,
        totalUsd,
        status: 'PROCESSING',
        progressPercent: 5,
        deliveredCount: 1,
        createdAt: Date.now(),
        estimatedDelivery: camp.deliveryTimeframe,
      };

      setSocialOrders((prev) => [newOrder, ...prev]);

      const txn: Transaction = {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        type: 'BOOST_ORDER',
        amountKes: totalKes,
        amountUsd: totalUsd,
        method: paymentMethod === 'wallet' ? 'WurlFX Wallet' : 'M-Pesa STK (400200)',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Campaign ${camp.name} started for ${targetLink}`,
      };
      setTransactions((prev) => [txn, ...prev]);

      showNotification(`Campaign ${orderId} launched! Wurl_Sphilah team notified via WhatsApp & Email.`, 'success');
      return { success: true, message: 'Campaign initiated', orderId };
    },
    [campaigns, accountType, demoBalance, realBalance, formatMoney, showNotification]
  );

  // Request Refill
  const requestRefill = useCallback((orderId: string) => {
    showNotification(`Refill request lodged for Order ${orderId}. Automated algorithm audit in progress.`, 'info');
  }, [showNotification]);

  // Auth Actions
  const login = useCallback(
    (emailOrPhone: string, role?: UserRole) => {
      const existing = allUsers.find(
        (u) =>
          u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
          u.phone === emailOrPhone
      );
      if (existing) {
        if (role) {
          existing.role = role;
        }
        setCurrentUser({ ...existing });
        showNotification(
          `Signed in as ${existing.fullName} (${existing.role.toUpperCase()})`,
          'success'
        );
      } else {
        const newUser: UserProfile = {
          id: `WURL-${Math.floor(10000 + Math.random() * 90000)}`,
          fullName: emailOrPhone.includes('@')
            ? emailOrPhone.split('@')[0]
            : 'Kenyan Customer',
          email: emailOrPhone.includes('@') ? emailOrPhone : 'customer@wurlfx.com',
          phone:
            emailOrPhone.startsWith('0') || emailOrPhone.startsWith('254')
              ? emailOrPhone
              : '0762294296',
          role: role || (emailOrPhone.toLowerCase().includes('admin') ? 'admin' : 'user'),
          kycStatus: 'pending',
          referralCode: `WURL-${Math.floor(1000 + Math.random() * 9000)}`,
          referralsCount: 1,
          referralBonusKes: 50, // KSh 50 per referral
          referralWithdrawnKes: 0,
          createdAt: Date.now(),
        };
        setAllUsers((prev) => [newUser, ...prev]);
        setCurrentUser(newUser);
        showNotification(
          `New account registered! Welcome ${newUser.fullName} (${newUser.role.toUpperCase()})`,
          'success'
        );
      }
      setIsAuthModalOpen(false);
    },
    [allUsers, showNotification]
  );

  const logout = useCallback(() => {
    setCurrentUser(DEMO_USERS[0]);
    showNotification('Logged out successfully. Switched to Guest Demo.', 'info');
  }, [showNotification]);

  const switchRole = useCallback(
    (newRole: UserRole) => {
      setCurrentUser((prev) => ({ ...prev, role: newRole }));
      showNotification(
        `Switched active role to ${newRole === 'admin' ? 'Administrator' : 'Customer'}`,
        'info'
      );
    },
    [showNotification]
  );

  // Referral Program: KSh 50 per referral, max KSh 1,000 withdrawal rule
  const claimReferralBonus = useCallback(
    (amountKes: number) => {
      const unwithdrawnBonus =
        currentUser.referralBonusKes - currentUser.referralWithdrawnKes;
      const maxAllowableRemaining = Math.max(
        0,
        1000 - currentUser.referralWithdrawnKes
      );

      if (amountKes <= 0) {
        return {
          success: false,
          message: 'Please specify a valid referral bonus amount.',
        };
      }
      if (amountKes > unwithdrawnBonus) {
        return {
          success: false,
          message: `Withdrawal exceeds available earned referral bonus (Available: KSh ${unwithdrawnBonus.toLocaleString()}).`,
        };
      }
      if (amountKes > maxAllowableRemaining) {
        return {
          success: false,
          message: `Maximum lifetime referral withdrawal limit is KSh 1,000. You have KSh ${maxAllowableRemaining.toLocaleString()} remaining allowance.`,
        };
      }

      // Credit to active balance
      const amountUsd = amountKes / KES_USD_RATE;
      if (accountType === 'demo') {
        setDemoBalance((prev) => prev + amountUsd);
      } else {
        setRealBalance((prev) => prev + amountUsd);
      }

      // Update user records
      setCurrentUser((prev) => ({
        ...prev,
        referralWithdrawnKes: prev.referralWithdrawnKes + amountKes,
      }));
      setAllUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === currentUser.id
            ? { ...u, referralWithdrawnKes: u.referralWithdrawnKes + amountKes }
            : u
        )
      );

      const txn: Transaction = {
        id: `REF-${Date.now().toString().slice(-5)}`,
        type: 'REFERRAL_PAYOUT',
        amountKes,
        amountUsd,
        method: 'WurlFX Wallet',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Referral bonus payout (KSh 50/referral) credited to wallet`,
      };
      setTransactions((prev) => [txn, ...prev]);

      showNotification(
        `Successfully transferred KSh ${amountKes.toLocaleString()} referral bonus to your account!`,
        'success'
      );
      return { success: true, message: 'Referral reward credited to balance' };
    },
    [currentUser, accountType, showNotification]
  );

  const addMockReferral = useCallback(() => {
    setCurrentUser((prev) => ({
      ...prev,
      referralsCount: prev.referralsCount + 1,
      referralBonusKes: prev.referralBonusKes + 50,
    }));
    setAllUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              referralsCount: u.referralsCount + 1,
              referralBonusKes: u.referralBonusKes + 50,
            }
          : u
      )
    );
    showNotification(
      'New referral signed up using your link! +KSh 50 added to your referral balance (Max withdrawal KSh 1,000).',
      'success'
    );
  }, [currentUser.id, showNotification]);

  // Sports Betting Actions
  const addToBetSlip = useCallback(
    (item: BetSlipItem) => {
      setBetSlip((prev) => {
        const existing = prev.find((p) => p.matchId === item.matchId);
        if (existing) {
          return prev.map((p) => (p.matchId === item.matchId ? item : p));
        }
        return [...prev, item];
      });
      showNotification(
        `Added to Bet Slip: ${item.matchTitle} [${item.market} @ ${item.odds.toFixed(2)}]`,
        'info'
      );
    },
    [showNotification]
  );

  const removeFromBetSlip = useCallback((matchId: string) => {
    setBetSlip((prev) => prev.filter((p) => p.matchId !== matchId));
  }, []);

  const clearBetSlip = useCallback(() => {
    setBetSlip([]);
  }, []);

  const placeSportsBet = useCallback(
    (stakeKes: number) => {
      if (betSlip.length === 0) {
        return { success: false, message: 'Please select at least one match on your bet slip.' };
      }
      if (stakeKes < 20) {
        return { success: false, message: 'Minimum sports bet stake is KSh 20.' };
      }

      const stakeUsd = stakeKes / KES_USD_RATE;
      const currentFunds = accountType === 'demo' ? demoBalance : realBalance;

      if (stakeUsd > currentFunds) {
        return {
          success: false,
          message: `Insufficient balance (${formatMoney(currentFunds)}). Stake requires KSh ${stakeKes.toLocaleString()}. Top up to continue.`,
        };
      }

      // Deduct balance directly
      if (accountType === 'demo') {
        setDemoBalance((prev) => prev - stakeUsd);
      } else {
        setRealBalance((prev) => prev - stakeUsd);
      }

      const totalOdds = parseFloat(
        betSlip.reduce((acc, it) => acc * it.odds, 1).toFixed(2)
      );
      const potentialPayoutKes = Math.round(stakeKes * totalOdds);
      const betDescription = betSlip
        .map((b) => `${b.matchTitle} (${b.market})`)
        .join(' + ');

      const newSettledBet: SettledBet = {
        id: `BET-SP-${Date.now().toString().slice(-6)}`,
        type: 'sports',
        description: betDescription,
        stakeKes,
        oddsOrMultiplier: totalOdds,
        potentialPayoutKes,
        actualPayoutKes: 0,
        status: 'OPEN',
        timestamp: Date.now(),
      };

      setSettledBets((prev) => [newSettledBet, ...prev]);

      const txn: Transaction = {
        id: `SP-${Date.now().toString().slice(-5)}`,
        type: 'BET_STAKE',
        amountKes: stakeKes,
        amountUsd: stakeUsd,
        method: 'WurlFX Wallet',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Sports Bet (${betSlip.length} picks @ ${totalOdds}x) - Potential: KSh ${potentialPayoutKes.toLocaleString()}`,
      };
      setTransactions((prev) => [txn, ...prev]);
      setBetSlip([]);

      showNotification(
        `Bet Placed! Stake: KSh ${stakeKes.toLocaleString()} | Total Odds: ${totalOdds}x | Potential: KSh ${potentialPayoutKes.toLocaleString()}`,
        'success'
      );
      return { success: true, message: 'Sports bet placed successfully.' };
    },
    [betSlip, accountType, demoBalance, realBalance, formatMoney, showNotification]
  );

  // Aviator Crash Game Actions
  const placeAviatorBet = useCallback(
    (stakeKes: number, autoCashout?: number) => {
      if (stakeKes < 10) {
        return { success: false, message: 'Minimum Sprime bet is KSh 10.' };
      }

      const stakeUsd = stakeKes / KES_USD_RATE;
      const currentFunds = accountType === 'demo' ? demoBalance : realBalance;

      if (stakeUsd > currentFunds) {
        return {
          success: false,
          message: `Insufficient balance (${formatMoney(currentFunds)}). Stake requires KSh ${stakeKes.toLocaleString()}.`,
        };
      }

      // Deduct balance directly
      if (accountType === 'demo') {
        setDemoBalance((prev) => prev - stakeUsd);
      } else {
        setRealBalance((prev) => prev - stakeUsd);
      }

      const betId = `SP-${Date.now().toString().slice(-6)}`;
      const newBet: AviatorBet = {
        id: betId,
        username: currentUser.fullName.split(' ')[0] || 'Player',
        stakeKes,
        status: 'ACTIVE',
        timestamp: Date.now(),
        autoCashout,
      };

      setAviatorBets((prev) => [newBet, ...prev]);

      const txn: Transaction = {
        id: `SP-STK-${Date.now().toString().slice(-5)}`,
        type: 'BET_STAKE',
        amountKes: stakeKes,
        amountUsd: stakeUsd,
        method: 'WurlFX Wallet',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Sprime Stake: KSh ${stakeKes.toLocaleString()}${
          autoCashout ? ` (Auto-Cashout @ ${autoCashout}x)` : ''
        }`,
      };
      setTransactions((prev) => [txn, ...prev]);

      return { success: true, message: 'Sprime bet active', betId };
    },
    [accountType, demoBalance, realBalance, currentUser, formatMoney]
  );

  const cashoutAviatorBet = useCallback(
    (betId: string, currentMultiplier: number) => {
      const bet = aviatorBets.find((b) => b.id === betId);
      if (!bet || bet.status !== 'ACTIVE') {
        return { success: false, message: 'Bet is not active or already settled.' };
      }

      const payoutKes = Math.round(bet.stakeKes * currentMultiplier);
      const payoutUsd = payoutKes / KES_USD_RATE;

      // Credit balance directly
      if (accountType === 'demo') {
        setDemoBalance((prev) => prev + payoutUsd);
      } else {
        setRealBalance((prev) => prev + payoutUsd);
      }

      // Update aviator bets
      setAviatorBets((prev) =>
        prev.map((b) =>
          b.id === betId
            ? {
                ...b,
                status: 'WON',
                cashedOutMultiplier: currentMultiplier,
                payoutKes,
              }
            : b
        )
      );

      // Add to settled bets
      const settled: SettledBet = {
        id: `WIN-${Date.now().toString().slice(-6)}`,
        type: 'aviator',
        description: `Sprime Cashed Out @ ${currentMultiplier.toFixed(2)}x`,
        stakeKes: bet.stakeKes,
        oddsOrMultiplier: currentMultiplier,
        potentialPayoutKes: payoutKes,
        actualPayoutKes: payoutKes,
        status: 'WON',
        timestamp: Date.now(),
      };
      setSettledBets((prev) => [settled, ...prev]);

      const txn: Transaction = {
        id: `SP-WIN-${Date.now().toString().slice(-5)}`,
        type: 'BET_PAYOUT',
        amountKes: payoutKes,
        amountUsd: payoutUsd,
        method: 'WurlFX Wallet',
        status: 'COMPLETED',
        timestamp: Date.now(),
        notes: `Sprime Win @ ${currentMultiplier.toFixed(2)}x (+KSh ${payoutKes.toLocaleString()})`,
      };
      setTransactions((prev) => [txn, ...prev]);

      showNotification(
        `Cashed out @ ${currentMultiplier.toFixed(2)}x! Won KSh ${payoutKes.toLocaleString()} (Credited to your balance)`,
        'success'
      );
      return { success: true, message: 'Cashed out successfully', payoutKes };
    },
    [aviatorBets, accountType, showNotification]
  );

  const recordAviatorRoundCrash = useCallback((multiplier: number) => {
    setAviatorHistory((prev) => [
      parseFloat(multiplier.toFixed(2)),
      ...prev.slice(0, 14),
    ]);

    // Mark remaining active bets as LOST
    setAviatorBets((prev) =>
      prev.map((b) => {
        if (b.status === 'ACTIVE') {
          const lostBet: SettledBet = {
            id: `LOST-${Date.now().toString().slice(-6)}`,
            type: 'aviator',
            description: `Sprime Crashed @ ${multiplier.toFixed(2)}x before cashout`,
            stakeKes: b.stakeKes,
            oddsOrMultiplier: multiplier,
            potentialPayoutKes: 0,
            actualPayoutKes: 0,
            status: 'LOST',
            timestamp: Date.now(),
          };
          setSettledBets((prevSettled) => [lostBet, ...prevSettled]);
          return { ...b, status: 'LOST' };
        }
        return b;
      })
    );
  }, []);

  // Admin Management Actions
  const updateUserKycStatus = useCallback(
    (userId: string, status: 'verified' | 'rejected') => {
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, kycStatus: status } : u))
      );
      if (currentUser.id === userId) {
        setCurrentUser((prev) => ({ ...prev, kycStatus: status }));
        setKycVerified(status === 'verified');
      }
      showNotification(
        `User ${userId} KYC status updated to ${status.toUpperCase()}`,
        'success'
      );
    },
    [currentUser.id, showNotification]
  );

  const approveWithdrawalTransaction = useCallback(
    (transactionId: string) => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId ? { ...t, status: 'COMPLETED' } : t
        )
      );
      showNotification(
        `Withdrawal #${transactionId} marked as COMPLETED (Dispatched via Co-op Bank Paybill 400200).`,
        'success'
      );
    },
    [showNotification]
  );

  const rejectWithdrawalTransaction = useCallback(
    (transactionId: string, reason: string) => {
      const target = transactions.find((t) => t.id === transactionId);
      if (target && target.status === 'PROCESSING') {
        setRealBalance((prev) => prev + target.amountUsd);
      }
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === transactionId
            ? {
                ...t,
                status: 'REJECTED',
                notes: `${t.notes || ''} [Rejected by Admin: ${reason}]`,
              }
            : t
        )
      );
      showNotification(
        `Withdrawal #${transactionId} rejected. Funds returned to client balance.`,
        'info'
      );
    },
    [transactions, showNotification]
  );

  return (
    <AppContext.Provider
      value={{
        accountType,
        setAccountType,
        currency,
        setCurrency,
        formatMoney,
        usdToCurrentCurrency,
        currentCurrencyToUsd,
        demoBalance,
        realBalance,
        currentBalance,
        equity,
        usedMargin,
        freeMargin,
        marginLevel,
        floatingPnl,
        kycVerified,
        verifyKyc,
        resetDemoBalance,
        depositFunds,
        withdrawFunds,
        assets,
        selectedAsset,
        setSelectedAssetId,
        candles,
        timeframe,
        setTimeframe,
        indicators,
        toggleIndicator,
        positions,
        closedTrades,
        openPosition,
        closePosition,
        modifyPosition,
        priceAlerts,
        addPriceAlert,
        deletePriceAlert,
        togglePriceAlert,
        unreadAlertsCount,
        markAlertsAsRead,
        pushPermission,
        requestPushPermission,
        isAlertModalOpen,
        setIsAlertModalOpen,
        voteSentiment,
        services,
        campaigns,
        socialOrders,
        placeSocialOrder,
        placeCampaignOrder,
        requestRefill,
        transactions,
        currentUser,
        allUsers,
        login,
        logout,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        claimReferralBonus,
        addMockReferral,
        sportsMatches,
        betSlip,
        addToBetSlip,
        removeFromBetSlip,
        clearBetSlip,
        placeSportsBet,
        aviatorBets,
        aviatorHistory,
        placeAviatorBet,
        cashoutAviatorBet,
        recordAviatorRoundCrash,
        settledBets,
        updateUserKycStatus,
        approveWithdrawalTransaction,
        rejectWithdrawalTransaction,
        activeTab,
        setActiveTab,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isContactModalOpen,
        setIsContactModalOpen,
        isKycModalOpen,
        setIsKycModalOpen,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
