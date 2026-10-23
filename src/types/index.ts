export type AccountType = 'demo' | 'real';
export type CurrencyType = 'KES' | 'USD';

export type AssetCategory = 'Forex Majors' | 'Exotics' | 'Commodities' | 'Crypto';

export interface ForexAsset {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  bid: number;
  ask: number;
  spread: number;
  high24h: number;
  low24h: number;
  change24h: number;
  decimalPlaces: number;
  basePrice: number;
  pipMultiplier: number;
  sparkline: number[];
  sentiment?: MarketSentimentData;
}

export interface MarketSentimentData {
  symbol: string;
  bullPercent: number;
  bearPercent: number;
  totalPositionsCount: number;
  longVolumeLots: number;
  shortVolumeLots: number;
  stance: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Bearish' | 'Strong Bearish';
  communityVotes: {
    bull: number;
    bear: number;
  };
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradingPosition {
  id: string;
  accountType: AccountType;
  symbol: string;
  type: 'BUY' | 'SELL';
  lots: number;
  openPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  pnl: number;
  timestamp: number;
  margin: number;
  leverage: number;
  status: 'OPEN' | 'CLOSED';
  closePrice?: number;
  closedAt?: number;
}

export type SocialPlatform = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'twitter' | 'spotify' | 'telegram' | 'whatsapp';

export interface SocialService {
  id: string;
  serviceIdNumber?: number;
  platform: SocialPlatform;
  name: string;
  category: 'followers' | 'likes' | 'views' | 'engagement' | 'campaign';
  categoryName?: string;
  pricePer1000Kes: number;
  pricePer1000Usd: number;
  minQuantity: number;
  maxQuantity: number;
  speed: string;
  startTime?: string;
  refillGuaranteeDays: number;
  description: string;
  popular?: boolean;
}

export interface SocialOrder {
  id: string;
  serviceId: string;
  serviceName: string;
  platform: SocialPlatform;
  targetLink: string;
  quantity: number;
  totalKes: number;
  totalUsd: number;
  status: 'PENDING' | 'PROCESSING' | 'IN_PROGRESS' | 'COMPLETED';
  progressPercent: number;
  deliveredCount: number;
  createdAt: number;
  estimatedDelivery: string;
}

export interface CampaignPackage {
  id: string;
  name: string;
  tagline: string;
  priceKes: number;
  priceUsd: number;
  originalPriceKes: number;
  originalPriceUsd: number;
  description: string;
  targetAudience: string;
  deliverables: string[];
  deliveryTimeframe: string;
  guaranteeText: string;
}

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycIdNumber?: string;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  referralBonusKes: number; // KSh 50 per referral
  referralWithdrawnKes: number; // Max KSh 1,000 withdrawal rule
  createdAt: number;
}

export interface AviatorBet {
  id: string;
  username: string;
  stakeKes: number;
  cashedOutMultiplier?: number;
  payoutKes?: number;
  status: 'ACTIVE' | 'WON' | 'LOST';
  timestamp: number;
  autoCashout?: number;
}

export interface AviatorRound {
  id: string;
  crashMultiplier: number;
  startTime: number;
  endTime: number;
  status: 'WAITING' | 'FLYING' | 'CRASHED';
}

export interface SportsMatch {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  isLive?: boolean;
  score?: string;
  odds: {
    home: number;    // 1
    draw: number;    // X
    away: number;    // 2
    over25: number;
    under25: number;
    gg: number;
    ng: number;
  };
}

export interface BetSlipItem {
  matchId: string;
  matchTitle: string;
  market: '1' | 'X' | '2' | 'Over 2.5' | 'Under 2.5' | 'GG' | 'NG';
  odds: number;
}

export interface SettledBet {
  id: string;
  type: 'aviator' | 'sports';
  description: string;
  stakeKes: number;
  oddsOrMultiplier: number;
  potentialPayoutKes: number;
  actualPayoutKes: number;
  status: 'OPEN' | 'WON' | 'LOST';
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BOOST_ORDER' | 'TRADE_PROFIT' | 'TRADE_LOSS' | 'BET_STAKE' | 'BET_PAYOUT' | 'REFERRAL_PAYOUT';
  amountKes: number;
  amountUsd: number;
  method: 'Co-op Bank Paybill (400200)' | 'M-Pesa STK (400200)' | 'WurlFX Wallet' | 'USDT (TRC-20)' | 'Bank Transfer' | 'Card';
  status: 'COMPLETED' | 'PROCESSING' | 'REJECTED';
  timestamp: number;
  notes?: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  note?: string;
  createdAt: number;
  triggeredAt?: number;
  isActive: boolean;
  initialPrice: number;
}

