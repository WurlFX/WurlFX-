import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialService, SocialPlatform } from '../../types';
import { BoostOrderModal } from './BoostOrderModal';
import {
  Search,
  Zap,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Wallet,
  Copy,
  Check,
  Users,
  Flame,
  Sparkles,
  MessageCircle,
  Info,
  X,
  Clock,
  Send,
  Layers,
  Star,
  DollarSign,
  TrendingUp,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface RecentOrderTicker {
  id: string;
  name: string;
  city: string;
  service: string;
  amount: number;
  timeAgo: string;
}

export const BoostingCatalog: React.FC = () => {
  const {
    services,
    formatMoney,
    currency,
    placeSocialOrder,
    accountType,
    currentBalance,
    setActiveTab,
    setIsDepositModalOpen,
    setIsContactModalOpen,
    showNotification,
  } = useApp();

  // Active SMM View Tab
  const [activeSubTab, setActiveSubTab] = useState<'new_order' | 'services_rates' | 'platforms' | 'mass_order' | 'affiliates'>('new_order');

  // Selected Service for the New Order form
  const [selectedServiceId, setSelectedServiceId] = useState<string>(() => services[0]?.id || 'tt_followers_vip');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa'>('wallet');
  const [mpesaPhone, setMpesaPhone] = useState('0762294296');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [lastPlacedOrderId, setLastPlacedOrderId] = useState<string | null>(null);

  // Rate sheet filters
  const [rateSearch, setRateSearch] = useState('');
  const [ratePlatform, setRatePlatform] = useState<string>('all');

  // Mass order state
  const [massOrderText, setMassOrderText] = useState('');
  const [massOrderStatus, setMassOrderStatus] = useState<string | null>(null);

  // Instagram Review Modal
  const [showReviewGuide, setShowReviewGuide] = useState(false);

  // Referral copy state
  const [copiedRef, setCopiedRef] = useState(false);

  // Active service entity
  const activeService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  // Sync quantity boundaries when active service changes
  useEffect(() => {
    if (activeService) {
      if (quantity < activeService.minQuantity) {
        setQuantity(activeService.minQuantity);
      } else if (quantity > activeService.maxQuantity) {
        setQuantity(activeService.maxQuantity);
      }
    }
  }, [activeService]);

  // Live total calculation
  const totalKes = activeService ? (activeService.pricePer1000Kes * quantity) / 1000 : 0;
  const totalUsd = activeService ? (activeService.pricePer1000Usd * quantity) / 1000 : 0;

  // Platform definitions with icons & counts
  const platforms = [
    { id: 'all', label: 'All Services', icon: '⚡' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', badge: 'Popular' },
    { id: 'instagram', label: 'Instagram', icon: '📸', badge: 'HQ Non-Drop' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '🟢', badge: 'Exclusive' },
    { id: 'youtube', label: 'YouTube', icon: '🔴', badge: '4K Hours' },
    { id: 'facebook', label: 'Facebook', icon: '🌐', badge: 'Fast Page' },
    { id: 'telegram', label: 'Telegram', icon: '✈️', badge: 'Premium' },
    { id: 'twitter', label: 'X (Twitter)', icon: '🐦', badge: 'Viral' },
    { id: 'spotify', label: 'Spotify', icon: '🎧', badge: 'Streams' },
  ];

  // Filtered services for New Order dropdown
  const orderDropdownServices = useMemo(() => {
    if (selectedPlatform === 'all') return services;
    return services.filter((s) => s.platform === selectedPlatform);
  }, [services, selectedPlatform]);

  // Filtered services for Rate Sheet Table
  const filteredRateServices = useMemo(() => {
    return services.filter((srv) => {
      const matchPlatform = ratePlatform === 'all' || srv.platform === ratePlatform;
      const matchSearch =
        rateSearch.trim() === '' ||
        srv.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
        srv.id.toLowerCase().includes(rateSearch.toLowerCase()) ||
        (srv.serviceIdNumber && srv.serviceIdNumber.toString().includes(rateSearch)) ||
        srv.description.toLowerCase().includes(rateSearch.toLowerCase()) ||
        srv.platform.toLowerCase().includes(rateSearch.toLowerCase());
      return matchPlatform && matchSearch;
    });
  }, [services, ratePlatform, rateSearch]);

  // Live Simulated WurlFX SMM activity ticker
  const [recentOrders, setRecentOrders] = useState<RecentOrderTicker[]>([
    { id: '1', name: 'Kelvin M.', city: 'Nairobi', service: 'TikTok Viral Views', amount: 25000, timeAgo: '2m ago' },
    { id: '2', name: 'Kevin M.', city: 'Mombasa', service: 'Instagram Non-Drop Followers', amount: 1500, timeAgo: '4m ago' },
    { id: '3', name: 'Faith W.', city: 'Nakuru', service: 'WhatsApp Channel Members', amount: 1000, timeAgo: '7m ago' },
    { id: '4', name: 'Amina S.', city: 'Kisumu', service: 'YouTube 4,000 Watch Hours', amount: 4000, timeAgo: '11m ago' },
    { id: '5', name: 'Dennis K.', city: 'Eldoret', service: 'Facebook Page Likes', amount: 3000, timeAgo: '14m ago' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['George M.', 'Wanjiku N.', 'Otieno P.', 'Stacy K.', 'Emmanuel T.', 'Mercy J.', 'Collins B.'];
      const cities = ['Nairobi', 'Kiambu', 'Mombasa', 'Thika', 'Nakuru', 'Kisumu', 'Machakos'];
      const randomSrv = services[Math.floor(Math.random() * services.length)];
      const amounts = [500, 1000, 2500, 5000, 10000, 20000];
      const newEntry: RecentOrderTicker = {
        id: Date.now().toString(),
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        service: randomSrv ? randomSrv.name.replace(/\[.*?\]/g, '').trim() : 'Social Growth',
        amount: amounts[Math.floor(Math.random() * amounts.length)],
        timeAgo: 'Just now',
      };
      setRecentOrders((prev) => [newEntry, ...prev.slice(0, 4)]);
    }, 12000);
    return () => clearInterval(interval);
  }, [services]);

  // Handle Order Submit
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError('');
    setLastPlacedOrderId(null);

    if (!activeService) {
      setOrderError('Please select a service first.');
      return;
    }

    if (!targetLink.trim()) {
      setOrderError('Please provide your public profile, channel, post or invite link.');
      return;
    }

    if (quantity < activeService.minQuantity || quantity > activeService.maxQuantity) {
      setOrderError(
        `Quantity must be between ${activeService.minQuantity.toLocaleString()} and ${activeService.maxQuantity.toLocaleString()}.`
      );
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 650));

    const result = placeSocialOrder(activeService.id, targetLink.trim(), quantity, paymentMethod);
    setIsSubmitting(false);

    if (result.success) {
      setLastPlacedOrderId(result.orderId || 'WFX-SUCCESS');
      showNotification(`Order #${result.orderId} submitted to dispatch queue!`, 'success');
      setTargetLink('');
    } else {
      setOrderError(result.message);
    }
  };

  // Mass Order processor
  const handleMassOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMassOrderStatus(null);
    const lines = massOrderText.trim().split('\n').filter((l) => l.trim().length > 0);
    if (lines.length === 0) {
      setMassOrderStatus('Please enter at least one order line (format: service_id | link | quantity).');
      return;
    }

    let successCount = 0;
    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim());
      if (parts.length >= 3) {
        const srvIdOrNum = parts[0];
        const link = parts[1];
        const qty = parseInt(parts[2], 10);
        const match = services.find(
          (s) => s.id === srvIdOrNum || (s.serviceIdNumber && s.serviceIdNumber.toString() === srvIdOrNum)
        );
        if (match && link && qty >= match.minQuantity) {
          placeSocialOrder(match.id, link, qty, 'wallet');
          successCount++;
        }
      }
    }

    if (successCount > 0) {
      setMassOrderStatus(`Successfully queued ${successCount} mass order(s) via account wallet!`);
      setMassOrderText('');
      showNotification(`${successCount} bulk orders dispatched to API engine!`, 'success');
    } else {
      setMassOrderStatus('No valid orders could be parsed. Check the syntax: service_id | link | quantity');
    }
  };

  const copyReferralLink = () => {
    const refUrl = `https://wurlfx.com/ref?user=0762294296`;
    navigator.clipboard?.writeText(refUrl);
    setCopiedRef(true);
    showNotification('12% Affiliate referral link copied to clipboard!', 'success');
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const dynamicLinkPlaceholder = useMemo(() => {
    if (!activeService) return 'https://...';
    switch (activeService.platform) {
      case 'tiktok':
        return activeService.category === 'followers'
          ? 'https://www.tiktok.com/@username'
          : 'https://www.tiktok.com/@username/video/739123456789';
      case 'instagram':
        return activeService.category === 'followers'
          ? 'https://www.instagram.com/your_handle'
          : 'https://www.instagram.com/reel/C8xyz123456/';
      case 'whatsapp':
        return activeService.categoryName?.includes('Reactions')
          ? 'https://whatsapp.com/channel/0029VbCZqDe.../message/102'
          : 'https://whatsapp.com/channel/0029VbCZqDe0LKZBNYDkJa1j';
      case 'youtube':
        return activeService.category === 'followers'
          ? 'https://www.youtube.com/@YourChannelName'
          : 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      case 'facebook':
        return 'https://www.facebook.com/yourpage or post URL';
      case 'telegram':
        return 'https://t.me/your_channel_or_group';
      case 'twitter':
        return 'https://x.com/your_handle';
      case 'spotify':
        return 'https://open.spotify.com/track/...';
      default:
        return 'https://...';
    }
  }, [activeService]);

  return (
    <div className="space-y-6">
      {/* 1. WURLFX HIGH-SPEED SMM TICKER BANNER */}
      <div className="rounded-xl overflow-hidden border border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 shadow-md">
        <div className="py-2.5 px-4 overflow-hidden relative border-b border-neutral-800/80">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
            <span className="inline-flex items-center gap-2 text-xs font-black text-amber-400">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>WELCOME TO WURLFX HIGH-SPEED SMM GROWTH PANEL</span>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>INVITE FRIENDS &amp; EARN 12% COMMISSION EVERY TIME THEY DEPOSIT</span>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-sky-400">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              <span>INSTANT AUTOMATED SMM DISPATCH ACROSS KENYA &amp; GLOBAL</span>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-purple-400">
              <DollarSign className="w-3.5 h-3.5 text-purple-400" />
              <span>DIRECT M-PESA AUTOMATED STK CASHOUTS &amp; DEPOSITS (MIN KSH 200)</span>
            </span>
            <span className="text-neutral-700">|</span>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span>ACTIVE SERVERS: 500+ INSTANT FAST DELIVERY CHANNELS</span>
            </span>
          </div>
        </div>

        {/* WURLFX SMM WARNING BANNER */}
        <div className="bg-purple-950/40 border-b border-purple-800/30 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-neutral-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-amber-300">Notice:</strong> Turn off{' '}
              <span className="font-mono text-white underline">"Flag for Review"</span> in your Instagram settings before ordering followers, or delivery will fail.
            </span>
          </div>
          <button
            onClick={() => setShowReviewGuide(true)}
            className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
          >
            <span>See How</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. WURLFX SMM HUB HERO & HEADER */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>WurlFX Growth Engine · 100% Automated SMM Server</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Gain Likes, Followers &amp; Views — Cheapest &amp; Fastest in Kenya
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            High-speed algorithmic boosting for creators, artists, businesses, and resellers. Instant delivery via automated Safaricom M-Pesa STK push and account wallet.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-300">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>30 - 90 Days Auto-Refill</span>
            </span>
            <span className="text-neutral-700">·</span>
            <span className="inline-flex items-center gap-1 text-sky-400 font-medium">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Speed up to 100K/Day</span>
            </span>
            <span className="text-neutral-700">·</span>
            <span className="inline-flex items-center gap-1 text-purple-400 font-medium">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>Desk: 0762294296</span>
            </span>
          </div>
        </div>

        {/* Action button: Big Campaign Bundles */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('campaigns')}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pro Growth Bundles (From KSH 15K)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>Track Live Deliveries</span>
          </button>
        </div>
      </div>

      {/* 3. WURLFX INNER NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-800 text-xs font-semibold">
        <button
          onClick={() => setActiveSubTab('new_order')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'new_order'
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>New Order Engine</span>
        </button>

        <button
          onClick={() => setActiveSubTab('services_rates')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'services_rates'
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Services &amp; Rate Sheet</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-neutral-900 text-neutral-300 font-mono">
            {services.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('platforms')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'platforms'
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Platform Categories</span>
        </button>

        <button
          onClick={() => setActiveSubTab('mass_order')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'mass_order'
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Mass Order (Bulk)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('affiliates')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === 'affiliates'
              ? 'bg-emerald-500 text-neutral-950 font-bold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>12% Affiliate Earn</span>
        </button>
      </div>

      {/* 4. SUBTAB 1: NEW ORDER ENGINE (WURLFX AUTOMATED ORDER FORM) */}
      {activeSubTab === 'new_order' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Order Form Column (7 cols) */}
          <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Zap className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-white">Create New Growth Order</h2>
              </div>
              <span className="text-[11px] text-neutral-400">
                Automated API Dispatch
              </span>
            </div>

            {/* Success notification banner */}
            {lastPlacedOrderId && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Order #{lastPlacedOrderId} placed successfully!</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Delivery has started on our automated server. You can monitor live progress bars in your orders desk.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-md inline-flex items-center gap-1 transition-colors"
                >
                  <span>View in Live Delivery Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Error banner */}
            {orderError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{orderError}</span>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {/* Step 1: Platform Quick Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                  <span>1. Select Platform</span>
                  <span className="text-neutral-500 font-normal text-[11px]">Filter services</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs">
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setSelectedPlatform(p.id);
                        const match = services.find((s) => p.id === 'all' || s.platform === p.id);
                        if (match) setSelectedServiceId(match.id);
                      }}
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedPlatform === p.id
                          ? 'bg-neutral-800 border-emerald-500 text-white font-bold shadow-sm'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-950'
                      }`}
                    >
                      <span className="text-base">{p.icon}</span>
                      <span className="text-[11px] truncate w-full">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Service Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                  <span>2. Select Specific Service</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {activeService ? `ID: #${activeService.serviceIdNumber || activeService.id}` : ''}
                  </span>
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  {orderDropdownServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.serviceIdNumber || s.id} - {s.name} (KSh {s.pricePer1000Kes.toLocaleString()} / 1k)
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 3: WurlFX Service Description & Specs Box */}
              {activeService && (
                <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Service Specifications
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {activeService.refillGuaranteeDays > 0
                        ? `${activeService.refillGuaranteeDays}-Day Auto-Refill`
                        : 'Safe Instant Start'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                      <span className="text-neutral-500 block">⚡ Start Time</span>
                      <span className="font-semibold text-white">
                        {activeService.startTime || 'Instant (0 - 15m)'}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/80">
                      <span className="text-neutral-500 block">🚀 Delivery Speed</span>
                      <span className="font-semibold text-white">{activeService.speed}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/80 col-span-2 sm:col-span-1">
                      <span className="text-neutral-500 block">💰 Rate per 1,000</span>
                      <span className="font-bold text-emerald-400">
                        KSh {activeService.pricePer1000Kes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
                    {activeService.description}
                  </p>
                </div>
              )}

              {/* Step 4: Target Link Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  3. Target Link / Username / URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={dynamicLinkPlaceholder}
                  value={targetLink}
                  onChange={(e) => setTargetLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-[10px] text-neutral-500 block">
                  Ensure the account or target content is set to <strong>Public</strong>. Do not submit multiple orders for the same link until the previous completes.
                </span>
              </div>

              {/* Step 5: Quantity Input & Presets */}
              {activeService && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                    <span>4. Quantity</span>
                    <span className="text-neutral-400 font-normal text-[11px]">
                      Min: {activeService.minQuantity.toLocaleString()} · Max:{' '}
                      {activeService.maxQuantity.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={activeService.minQuantity}
                      max={activeService.maxQuantity}
                      step={activeService.minQuantity >= 500 ? 500 : 100}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || activeService.minQuantity)}
                      className="w-36 px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-sm font-bold text-white tabular-nums text-center focus:outline-none focus:border-emerald-500"
                    />

                    {/* Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {[500, 1000, 2500, 5000, 10000].map((preset) => {
                        if (preset > activeService.maxQuantity) return null;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setQuantity(preset)}
                            className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                              quantity === preset
                                ? 'bg-emerald-500 text-neutral-950 font-bold'
                                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                            }`}
                          >
                            +{preset >= 1000 ? `${preset / 1000}K` : preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Live Price Calculation Box */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/30 to-neutral-950 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                    Total Order Charge
                  </span>
                  <div className="text-xl font-black text-white tabular-nums">
                    KSh {totalKes.toLocaleString()}{' '}
                    <span className="text-xs font-normal text-neutral-400">
                      (≈ ${totalUsd.toFixed(2)} USD)
                    </span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-neutral-400">
                  <span className="block text-emerald-400 font-semibold">
                    Automated Start
                  </span>
                  <span>Instant Receipt</span>
                </div>
              </div>

              {/* Step 7: Payment Source */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 block">
                  5. Payment Source
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Wallet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">WurlFX Wallet</div>
                      <div className="text-[10px] text-neutral-400">
                        Balance: {formatMoney(currentBalance)} ({accountType})
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">M-Pesa STK Push</div>
                      <div className="text-[10px] text-neutral-400">
                        Direct Safaricom Prompt
                      </div>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'mpesa' && (
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                    <label className="text-[11px] text-neutral-300 block">
                      Safaricom Phone Number for STK Prompt:
                    </label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="0762294296"
                      className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white"
                    />
                    <span className="text-[10px] text-neutral-400 block">
                      A prompt for <strong>KSh {totalKes.toLocaleString()}</strong> will be dispatched to this phone. Enter your M-Pesa PIN to finalize.
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting to SMM API Server...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Submit &amp; Launch Boost — KSh {totalKes.toLocaleString()}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Side Column: WurlFX Quick Stats, Live Ticker & VIP Desk (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Orders Activity Stream */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span>Live Dispatch Feed</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Real-Time</span>
              </div>

              <div className="space-y-2.5">
                {recentOrders.map((ro) => (
                  <div
                    key={ro.id}
                    className="p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 flex items-center justify-between text-xs animate-in fade-in duration-300"
                  >
                    <div>
                      <div className="font-semibold text-white">
                        {ro.name} <span className="text-[10px] text-neutral-500">from {ro.city}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">{ro.service}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold block">
                        +{ro.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-500">{ro.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 12% Affiliate Promo Box */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Earn 12% Commission for Life</span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                WurlFX Affiliate Program
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Share your referral link with friends, creators, or clients. You automatically receive 12% in real cash balance every time they top up via M-Pesa.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  readOnly
                  value="https://wurlfx.com/ref?user=0762294296"
                  className="flex-1 px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-300"
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-lg font-bold text-xs transition-colors flex items-center gap-1"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* 24/7 VIP Help Desk Support Box */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>24/7 Customer Help Desk</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-medium">Online</span>
              </div>
              <p className="text-xs text-neutral-400">
                Need customized bulk quotes or order verification? Contact our support operators directly:
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href="https://wa.me/254762294296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp: 0762294296</span>
                </a>

                <a
                  href="mailto:wurlfxhelpcare@gmail.com"
                  className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Email: wurlfxhelpcare@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBTAB 2: SERVICES & RATE SHEET (WURLFX FULL PRICE LIST TABLE) */}
      {activeSubTab === 'services_rates' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white">Full SMM Services &amp; Rates Sheet</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Browse our real-time SMM catalog with transparent pricing per 1,000 units in Kenyan Shillings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Total Available:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                {filteredRateServices.length} Services
              </span>
            </div>
          </div>

          {/* Search & Platform Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by ID, platform, or service name (e.g. 1042, TikTok Views, WhatsApp, Watch Hours)..."
                value={rateSearch}
                onChange={(e) => setRateSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={ratePlatform}
              onChange={(e) => setRatePlatform(e.target.value)}
              className="px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {platforms.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto rounded-xl border border-neutral-800">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="px-3.5 py-3 font-semibold">ID</th>
                  <th className="px-3.5 py-3 font-semibold">Service Name</th>
                  <th className="px-3.5 py-3 font-semibold">Platform</th>
                  <th className="px-3.5 py-3 font-semibold text-right">Rate / 1K (KSh)</th>
                  <th className="px-3.5 py-3 font-semibold text-center">Min / Max</th>
                  <th className="px-3.5 py-3 font-semibold">Average Speed</th>
                  <th className="px-3.5 py-3 font-semibold">Refill</th>
                  <th className="px-3.5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {filteredRateServices.map((srv) => (
                  <tr key={srv.id} className="hover:bg-neutral-950/50 transition-colors">
                    <td className="px-3.5 py-3 font-mono text-neutral-400 font-bold">
                      #{srv.serviceIdNumber || srv.id}
                    </td>

                    <td className="px-3.5 py-3 font-semibold text-white max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-1.5">
                        <span>{srv.name}</span>
                        {srv.popular && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                            HOT
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {srv.description}
                      </span>
                    </td>

                    <td className="px-3.5 py-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] uppercase font-bold text-neutral-300">
                        {srv.platform}
                      </span>
                    </td>

                    <td className="px-3.5 py-3 text-right tabular-nums">
                      <div className="font-bold text-emerald-400">
                        KSh {srv.pricePer1000Kes.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-neutral-500 block">
                        ≈ ${srv.pricePer1000Usd.toFixed(2)} USD
                      </span>
                    </td>

                    <td className="px-3.5 py-3 text-center text-[11px] text-neutral-400 tabular-nums">
                      {srv.minQuantity.toLocaleString()} / {srv.maxQuantity.toLocaleString()}
                    </td>

                    <td className="px-3.5 py-3 text-[11px] text-neutral-300">
                      {srv.speed}
                    </td>

                    <td className="px-3.5 py-3 text-[11px]">
                      {srv.refillGuaranteeDays > 0 ? (
                        <span className="text-emerald-400 font-medium">
                          {srv.refillGuaranteeDays}d Refill
                        </span>
                      ) : (
                        <span className="text-neutral-500">No Refill</span>
                      )}
                    </td>

                    <td className="px-3.5 py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedServiceId(srv.id);
                          setSelectedPlatform(srv.platform);
                          setActiveSubTab('new_order');
                        }}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-emerald-500 hover:text-neutral-950 text-white rounded-lg text-xs font-bold transition-all whitespace-nowrap"
                      >
                        Order Now
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRateServices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-500 text-xs">
                      No services match your search query. Try clearing filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SUBTAB 3: PLATFORM CATEGORIES (VISUAL CARDS) */}
      {activeSubTab === 'platforms' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms
              .filter((p) => p.id !== 'all')
              .map((plat) => {
                const count = services.filter((s) => s.platform === plat.id).length;
                const cheapest = services
                  .filter((s) => s.platform === plat.id)
                  .sort((a, b) => a.pricePer1000Kes - b.pricePer1000Kes)[0];

                return (
                  <div
                    key={plat.id}
                    className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{plat.icon}</span>
                        {plat.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-950 text-emerald-400 border border-emerald-500/30">
                            {plat.badge}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-base text-white group-hover:text-emerald-400 transition-colors">
                          {plat.label}
                        </h3>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {count} active automated server services
                        </p>
                      </div>

                      {cheapest && (
                        <div className="pt-2 border-t border-neutral-800 text-xs">
                          <span className="text-neutral-500 block text-[10px] uppercase font-semibold">
                            Rates From
                          </span>
                          <span className="font-black text-emerald-400 text-sm">
                            KSh {cheapest.pricePer1000Kes.toLocaleString()}
                          </span>
                          <span className="text-neutral-500 text-[10px]"> / 1k</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPlatform(plat.id);
                        const match = services.find((s) => s.platform === plat.id);
                        if (match) setSelectedServiceId(match.id);
                        setActiveSubTab('new_order');
                      }}
                      className="mt-5 w-full py-2 bg-neutral-950 hover:bg-emerald-500 hover:text-neutral-950 text-white border border-neutral-800 hover:border-emerald-500 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Boost {plat.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 7. SUBTAB 4: MASS ORDER (BULK SMM FORMAT) */}
      {activeSubTab === 'mass_order' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 max-w-3xl mx-auto">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Agency &amp; Reseller Automation
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">Bulk Mass Order Entry</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Place multiple boost orders at once. Enter one order per line in the standard SMM format:
              <br />
              <code className="text-emerald-400 font-mono bg-neutral-950 px-2 py-0.5 rounded text-[11px] mt-1 inline-block">
                service_id | link | quantity
              </code>
            </p>
          </div>

          {massOrderStatus && (
            <div className="p-3 bg-neutral-950 border border-emerald-500/40 rounded-xl text-xs text-emerald-300">
              {massOrderStatus}
            </div>
          )}

          <form onSubmit={handleMassOrderSubmit} className="space-y-4">
            <textarea
              rows={8}
              value={massOrderText}
              onChange={(e) => setMassOrderText(e.target.value)}
              placeholder="1042 | https://www.tiktok.com/@creator | 2000
2011 | https://www.instagram.com/business | 1500
3010 | https://whatsapp.com/channel/0029... | 500"
              className="w-full p-4 bg-neutral-950 border border-neutral-700 rounded-xl text-xs text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() =>
                  setMassOrderText(
                    `1042 | https://www.tiktok.com/@wurl_creator | 2000\n2011 | https://www.instagram.com/wurlfx_official | 1000\n3010 | https://whatsapp.com/channel/0029VbCZqDe0LKZBNYDkJa1j/post/1 | 500`
                  )
                }
                className="text-neutral-400 hover:text-white underline text-[11px]"
              >
                Fill with example batch
              </button>

              <span className="text-neutral-400 text-[11px]">
                Payment will be automatically debited from Account Wallet ({formatMoney(currentBalance)})
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Submit Mass Orders Batch
            </button>
          </form>
        </div>
      )}

      {/* 8. SUBTAB 5: 12% AFFILIATE EARN (WURLFX REFERRAL PROGRAM) */}
      {activeSubTab === 'affiliates' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Passive Reseller Income
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                Earn 12% Commission on All Referred Deposits
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Share your personal WurlFX affiliate link. Every time someone deposits funds into their account via M-Pesa or card, you get an instant 12% credit added directly to your withdrawable wallet.
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-lg">
              12%
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Total Referrals</span>
              <div className="text-2xl font-black text-white">48</div>
              <span className="text-[10px] text-emerald-400 font-medium">12 Active this week</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Total Deposits Referred</span>
              <div className="text-2xl font-black text-white tabular-nums">KSh 164,500</div>
              <span className="text-[10px] text-neutral-400">Across East Africa</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold">Your 12% Earnings</span>
              <div className="text-2xl font-black text-emerald-400 tabular-nums">KSh 19,740</div>
              <span className="text-[10px] text-emerald-400 font-medium">Credited to Balance</span>
            </div>
          </div>

          {/* Referral link box */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">
              Your Unique Referral Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value="https://wurlfx.com/ref?user=0762294296"
                className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs font-mono text-white"
              />
              <button
                type="button"
                onClick={copyReferralLink}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRef ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. INSTAGRAM REVIEW GUIDE MODAL ("See How") */}
      {showReviewGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-4 text-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Turn Off "Flag for Review" on Instagram
                </h3>
              </div>
              <button
                onClick={() => setShowReviewGuide(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p>
                Instagram recently added a feature called <strong>"Flag for review"</strong> which automatically isolates new followers into a spam quarantine. To ensure instant automated follower delivery:
              </p>

              <ol className="list-decimal pl-5 space-y-2 text-neutral-200">
                <li>Open your Instagram app and go to your <strong>Profile</strong>.</li>
                <li>Tap the <strong>☰ Menu (Settings &amp; activity)</strong> at top right.</li>
                <li>Scroll down and tap <strong>"Follow and invite friends"</strong>.</li>
                <li>Locate the toggle named <strong>"Flag for review"</strong>.</li>
                <li>Toggle it to <strong>OFF (Disabled)</strong>.</li>
              </ol>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400">
                💡 Once disabled, return to this panel and submit your Instagram order. Delivery begins immediately!
              </div>
            </div>

            <button
              onClick={() => setShowReviewGuide(false)}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-xl uppercase tracking-wider"
            >
              Understood, Return to Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
