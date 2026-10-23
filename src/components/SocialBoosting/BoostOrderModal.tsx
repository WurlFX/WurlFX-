import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialService } from '../../types';
import { X, CheckCircle, Shield, Zap, Sparkles, Phone, CreditCard, Wallet } from 'lucide-react';

interface BoostOrderModalProps {
  service: SocialService | null;
  onClose: () => void;
}

export const BoostOrderModal: React.FC<BoostOrderModalProps> = ({ service, onClose }) => {
  const {
    formatMoney,
    currency,
    placeSocialOrder,
    accountType,
    currentBalance,
    setActiveTab,
    setIsDepositModalOpen,
  } = useApp();

  const [quantity, setQuantity] = useState<number>(() => service?.minQuantity || 1000);
  const [targetLink, setTargetLink] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa'>('wallet');
  const [mpesaPhone, setMpesaPhone] = useState('0762294296');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!service) return null;

  const totalKes = (service.pricePer1000Kes * quantity) / 1000;
  const totalUsd = (service.pricePer1000Usd * quantity) / 1000;

  const handleQuantityPreset = (val: number) => {
    setQuantity(Math.min(service.maxQuantity, Math.max(service.minQuantity, val)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!targetLink.trim()) {
      setErrorMsg('Please enter your target profile, channel, or post link.');
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const result = placeSocialOrder(service.id, targetLink.trim(), quantity, paymentMethod);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      setActiveTab('orders');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-5 text-neutral-100 shadow-2xl relative my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              {service.platform.toUpperCase()} · Growth Service
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {service.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Link or Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300 block">
              Target Profile URL / Post Link <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={`e.g. https://${service.platform}.com/@your_handle`}
              value={targetLink}
              onChange={(e) => setTargetLink(e.target.value)}
              className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-neutral-400">
              Account or target post must be set to public during delivery.
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-300">
              <span>Order Quantity</span>
              <span className="text-neutral-400 tabular-nums">
                Min: {service.minQuantity.toLocaleString()} · Max: {service.maxQuantity.toLocaleString()}
              </span>
            </div>

            <input
              type="range"
              min={service.minQuantity}
              max={Math.min(service.maxQuantity, 25000)}
              step={service.minQuantity >= 500 ? 500 : 100}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-neutral-950 h-2 rounded cursor-pointer"
            />

            <div className="flex items-center justify-between">
              <input
                type="number"
                min={service.minQuantity}
                max={service.maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || service.minQuantity)}
                className="w-32 px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-md text-sm font-bold text-white tabular-nums text-center focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-1.5">
                {[1000, 2500, 5000, 10000].map((preset) => {
                  if (preset > service.maxQuantity) return null;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuantityPreset(preset)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        quantity === preset
                          ? 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/30'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {preset >= 1000 ? `${preset / 1000}K` : preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Service Guarantees and Speed */}
          <div className="bg-neutral-950/80 p-3 rounded-lg border border-neutral-800 space-y-1.5 text-xs text-neutral-300">
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Estimated Speed:</span>
              <span className="font-semibold text-white">{service.speed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-400">Warranty:</span>
              <span className="font-semibold text-emerald-400">
                {service.refillGuaranteeDays > 0
                  ? `${service.refillGuaranteeDays}-Day Auto-Refill Guarantee`
                  : 'Instant Delivery Safe'}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-800/80 pt-1.5 mt-1.5">
              <span className="text-neutral-300 font-medium">Total Price:</span>
              <div className="text-right">
                <span className="text-base font-extrabold text-white tabular-nums">
                  {formatMoney(totalUsd)}
                </span>
                <span className="text-neutral-400 text-[11px] block">
                  {currency === 'KES'
                    ? `($${totalUsd.toFixed(2)} USD)`
                    : `(KSh ${totalKes.toLocaleString()} KES)`}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300 block">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">WurlFX Wallet</div>
                  <div className="text-[10px] text-neutral-400">
                    Avail: {formatMoney(currentBalance)} ({accountType})
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('mpesa')}
                className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-colors ${
                  paymentMethod === 'mpesa'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">M-Pesa STK Push</div>
                  <div className="text-[10px] text-neutral-400">Direct Safaricom Prompt</div>
                </div>
              </button>
            </div>

            {paymentMethod === 'mpesa' && (
              <div className="pt-1">
                <input
                  type="tel"
                  placeholder="e.g. 0762294296"
                  value={mpesaPhone}
                  onChange={(e) => setMpesaPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500"
                />
                <span className="text-[10px] text-neutral-400 block mt-1">
                  You will receive an M-Pesa PIN prompt on this phone number for KSh {totalKes.toLocaleString()}.
                </span>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-xs font-semibold text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-lg text-xs font-bold tracking-wide uppercase transition-colors shadow-lg shadow-emerald-500/10"
            >
              {isSubmitting ? 'Queueing Boost...' : `Confirm & Boost`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
