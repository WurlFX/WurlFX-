import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampaignPackage } from '../../types';
import { Check, ShieldCheck, Zap, ArrowRight, MessageCircle, Sparkles, X, Phone } from 'lucide-react';

export const CampaignBundles: React.FC = () => {
  const {
    campaigns,
    formatMoney,
    currency,
    placeCampaignOrder,
    setActiveTab,
    accountType,
    currentBalance,
    setIsContactModalOpen,
  } = useApp();

  const [activePackage, setActivePackage] = useState<CampaignPackage | null>(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [payMethod, setPayMethod] = useState<'wallet' | 'mpesa'>('wallet');
  const [phone, setPhone] = useState('0762294296');
  const [isOrdering, setIsOrdering] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLaunchCampaign = (camp: CampaignPackage) => {
    setActivePackage(camp);
    setTargetUrl('');
    setErrorMsg('');
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePackage) return;
    if (!targetUrl.trim()) {
      setErrorMsg('Please enter your primary channel or profile URL.');
      return;
    }

    setIsOrdering(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = placeCampaignOrder(activePackage.id, targetUrl.trim(), payMethod);
    setIsOrdering(false);

    if (result.success) {
      setActivePackage(null);
      setActiveTab('orders');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Showcase with Generated Visual Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[280px]">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4 z-10">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Official Strategic Campaigns · Managed by Wurl_Sphilah
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                All-in-One Viral Growth Bundles
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                Engineered for serious creators, brands, and public figures. Every campaign includes algorithmic pacing, non-drop warranties, high-dwell video views, and dedicated WhatsApp progress support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Starting Price:</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatMoney(115.38)}
                </span>
                <span className="text-[11px] text-neutral-500">(KSH 15,000)</span>
              </div>
              <span className="text-neutral-600">·</span>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>30 to 90-Day Auto Refill</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-full">
            <img
              src="/src/assets/images/wurlfx_growth_social_1792571919137.jpg"
              alt="Social Media Growth Strategy Desk"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((camp, idx) => {
          const isFeatured = idx === 0; // Starter Breakthrough
          return (
            <div
              key={camp.id}
              className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                isFeatured
                  ? 'bg-neutral-900/90 border-emerald-500/50 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-500/20'
                  : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-4">
                {/* Header & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    {camp.id === 'starter_growth' ? 'Standard Order' : 'Pro Package'}
                  </span>
                  <span className="text-xs text-neutral-400">{camp.deliveryTimeframe}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{camp.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1">{camp.tagline}</p>
                </div>

                {/* Price Display */}
                <div className="pt-2 border-t border-neutral-800">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white tabular-nums">
                      {formatMoney(camp.priceUsd)}
                    </span>
                    <span className="text-xs text-neutral-500 line-through tabular-nums">
                      {formatMoney(camp.originalPriceUsd)}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 block mt-0.5">
                    {currency === 'KES'
                      ? `($${camp.priceUsd} USD equivalent)`
                      : `(KSh ${camp.priceKes.toLocaleString()} KES)`}
                  </span>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                    Package Deliverables:
                  </div>
                  <ul className="space-y-2">
                    {camp.deliverables.map((item, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-neutral-800 space-y-2">
                <button
                  onClick={() => handleLaunchCampaign(camp)}
                  className={`w-full py-2.5 rounded-lg text-xs font-bold tracking-wide uppercase transition-colors shadow-sm flex items-center justify-center gap-1.5 ${
                    isFeatured
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Launch Campaign</span>
                </button>

                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-1.5 text-[11px] text-neutral-400 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span>Ask Wurl_Sphilah via WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Launch Campaign Modal */}
      {activePackage && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 text-white">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Launch Growth Campaign
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activePackage.name}
                </h3>
              </div>
              <button
                onClick={() => setActivePackage(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-neutral-300 block mb-1">
                  Primary Profile or Channel Link <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://tiktok.com/@youraccount or YouTube URL"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs space-y-1">
                <div className="flex justify-between text-neutral-400">
                  <span>Package Price:</span>
                  <span className="font-bold text-white tabular-nums">
                    {formatMoney(activePackage.priceUsd)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Turnaround Time:</span>
                  <span className="text-neutral-300">{activePackage.deliveryTimeframe}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Warranty:</span>
                  <span className="text-emerald-400 font-medium">Non-Drop Guaranteed</span>
                </div>
              </div>

              {/* Payment Option */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-neutral-300 block">
                  Select Payment Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('wallet')}
                    className={`p-2 rounded-lg border text-left text-xs ${
                      payMethod === 'wallet'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold">WurlFX Wallet</div>
                    <div className="text-[10px] text-neutral-400">
                      Avail: {formatMoney(currentBalance)}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('mpesa')}
                    className={`p-2 rounded-lg border text-left text-xs ${
                      payMethod === 'mpesa'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    <div className="font-bold">M-Pesa STK</div>
                    <div className="text-[10px] text-neutral-400">Direct STK push</div>
                  </button>
                </div>

                {payMethod === 'mpesa' && (
                  <div className="pt-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0762294296"
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white"
                    />
                    <span className="text-[10px] text-neutral-400 block mt-1">
                      M-Pesa STK prompt will be triggered for KSh {activePackage.priceKes.toLocaleString()} to this number.
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActivePackage(null)}
                  className="flex-1 py-2 bg-neutral-800 rounded-lg text-xs font-medium text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOrdering}
                  className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider"
                >
                  {isOrdering ? 'Deploying...' : 'Confirm & Deploy'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
