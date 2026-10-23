import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Smartphone, CreditCard, Coins, ArrowDownLeft, ArrowUpRight, CheckCircle2, Shield, Copy } from 'lucide-react';
import { CurrencyType } from '../../types';

export const DepositModal: React.FC = () => {
  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    accountType,
    currency,
    formatMoney,
    depositFunds,
    withdrawFunds,
    currentBalance,
    showNotification,
  } = useApp();

  const [activeMode, setActiveMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [depositMethod, setDepositMethod] = useState<'stk' | 'manual'>('stk');

  // Deposit state
  const [amountInput, setAmountInput] = useState<string>('500');
  const [phone, setPhone] = useState('0762294296');
  const [mpesaMmoRef, setMpesaMmoRef] = useState('QA71DX8890');
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepSuccess, setStepSuccess] = useState(false);

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState<string>('1000');
  const [withdrawMethod, setWithdrawMethod] = useState<'mpesa' | 'bank'>('mpesa');
  const [withdrawRecipient, setWithdrawRecipient] = useState('0762294296');

  if (!isDepositModalOpen) return null;

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountInput);
    if (!val || val < 200) {
      showNotification('Minimum deposit allowed is KSh 200.', 'error');
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));

    const methodLabel = 'Co-op Bank Paybill (400200)';
    const refLabel = depositMethod === 'stk'
      ? `STK to 0762294296 · Paybill: 400200 · Acc: 25470215481001 (WURLFX)`
      : `Manual Paybill 400200 · Acc: 25470215481001 (WURLFX) · M-Pesa Code: ${mpesaMmoRef}`;

    await depositFunds(val, 'KES', methodLabel, refLabel);
    setIsProcessing(false);
    setStepSuccess(true);
    setTimeout(() => {
      setStepSuccess(false);
      setIsDepositModalOpen(false);
    }, 1800);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (!val || val <= 0) return;

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));

    const success = await withdrawFunds(
      val,
      'KES',
      withdrawMethod === 'mpesa' ? 'M-Pesa Payout' : 'Bank Wire',
      withdrawRecipient
    );

    setIsProcessing(false);
    if (success) {
      setIsDepositModalOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification('USDT TRC-20 Address copied to clipboard!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-5 text-neutral-100 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              {accountType.toUpperCase()} ACCOUNT CASHIER
            </div>
            <h3 className="text-lg font-bold text-white">
              WurlFX Financial Cashier &amp; Payouts
            </h3>
          </div>
          <button
            onClick={() => setIsDepositModalOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Deposit / Withdraw Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveMode('deposit')}
            className={`py-2 rounded font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeMode === 'deposit'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit Capital</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('withdraw')}
            className={`py-2 rounded font-bold transition-colors flex items-center justify-center gap-1.5 ${
              activeMode === 'withdraw'
                ? 'bg-neutral-800 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw Funds</span>
          </button>
        </div>

        {stepSuccess ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">
              Funds Successfully Credited!
            </h4>
            <p className="text-xs text-neutral-400">
              Your {accountType} balance has been updated and is available for instant trading or social boosting.
            </p>
          </div>
        ) : activeMode === 'deposit' ? (
          <form onSubmit={handleDepositSubmit} className="space-y-4">
            {/* Co-op Bank Paybill Banner */}
            <div className="p-3.5 bg-neutral-950 border border-emerald-500/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Co-operative Bank Official Paybill
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 font-mono">
                  Verified Merchant
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 bg-neutral-900 rounded-lg">
                  <span className="text-[10px] text-neutral-400 block">Business Number (Paybill)</span>
                  <span className="text-sm font-mono font-black text-white">400200</span>
                </div>
                <div className="p-2 bg-neutral-900 rounded-lg">
                  <span className="text-[10px] text-neutral-400 block">Account Number</span>
                  <span className="text-sm font-mono font-black text-emerald-400">25470215481001</span>
                </div>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-0.5">
                <span>Account Nickname / Ref:</span>
                <span className="font-bold text-white font-mono">WURLFX</span>
              </div>
            </div>

            {/* Method switcher: M-Pesa STK Push vs Manual Paybill */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDepositMethod('stk')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  depositMethod === 'stk'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-bold block">Instant M-Pesa STK</span>
              </button>

              <button
                type="button"
                onClick={() => setDepositMethod('manual')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  depositMethod === 'manual'
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Copy className="w-4 h-4 mx-auto mb-1" />
                <span className="text-[11px] font-bold block">Manual Paybill</span>
              </button>
            </div>

            {/* Amount input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span>Amount to Deposit (KSh)</span>
                <span className="text-[11px] text-emerald-400 font-medium">
                  Min: KSh 200 · Approx ${(Math.max(200, parseFloat(amountInput || '0')) / 130).toFixed(2)} USD
                </span>
              </div>
              <input
                type="number"
                min="200"
                step="50"
                required
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
              />

              {/* Quick chips */}
              <div className="flex items-center gap-1.5 pt-1">
                {[200, 500, 1000, 5000, 15000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(preset.toString())}
                    className={`flex-1 py-1 text-[11px] rounded transition-colors ${
                      amountInput === preset.toString()
                        ? 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {preset === 200 ? '200 (Min)' : preset === 15000 ? '15K (VIP)' : `${preset}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Details */}
            {depositMethod === 'stk' ? (
              <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2 text-xs">
                <label className="text-[11px] font-medium text-neutral-300 block">
                  Safaricom M-Pesa Phone Number (for PIN prompt)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0762294296"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-white"
                />
                <p className="text-[11px] text-neutral-400">
                  A pop-up will appear on your phone asking for your PIN to send money to <span className="text-white font-bold">WURLFX (Co-op Bank Paybill 400200)</span>.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-neutral-950 rounded-lg border border-neutral-800 space-y-2.5 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-white">Manual Lipa na M-Pesa Steps:</div>
                  <ol className="list-decimal pl-4 space-y-1 text-neutral-400 text-[11px]">
                    <li>Go to M-Pesa menu &gt; Lipa na M-Pesa &gt; Paybill</li>
                    <li>Enter Business Number: <strong className="text-white font-mono">400200</strong></li>
                    <li>Enter Account Number: <strong className="text-emerald-400 font-mono">25470215481001</strong></li>
                    <li>Recipient will display: <strong className="text-white">WURLFX</strong></li>
                    <li>Enter your M-Pesa PIN and confirm transaction</li>
                  </ol>
                </div>
                <div className="pt-1 space-y-1">
                  <label className="text-[11px] text-neutral-300 block">Enter M-Pesa Transaction Code (e.g. QA71DX8890)</label>
                  <input
                    type="text"
                    required
                    value={mpesaMmoRef}
                    onChange={(e) => setMpesaMmoRef(e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs font-mono text-white uppercase"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              {isProcessing
                ? 'Connecting to Co-op Bank Paybill 400200...'
                : `Deposit KSh ${parseInt(amountInput || '0').toLocaleString()} via Co-op Paybill`}
            </button>
          </form>
        ) : (
          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 text-xs flex justify-between items-center">
              <span className="text-neutral-400">Available Balance:</span>
              <span className="font-bold text-white tabular-nums">
                {formatMoney(currentBalance)}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 block">
                Amount to Withdraw (KSh)
              </label>
              <input
                type="number"
                min="500"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-700 rounded-lg text-sm font-bold text-white tabular-nums focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-neutral-300 block">
                Destination M-Pesa Phone Number or Bank
              </label>
              <input
                type="text"
                required
                value={withdrawRecipient}
                onChange={(e) => setWithdrawRecipient(e.target.value)}
                placeholder="e.g. 0762294296 (M-Pesa Safaricom)"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors"
            >
              {isProcessing ? 'Submitting Payout...' : 'Request Payout'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
