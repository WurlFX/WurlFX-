import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export const KYCModal: React.FC = () => {
  const { isKycModalOpen, setIsKycModalOpen, verifyKyc, showNotification } = useApp();

  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [acceptedRisk, setAcceptedRisk] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isKycModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedRisk) {
      showNotification('You must read and accept the financial risk declaration.', 'error');
      return;
    }

    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsVerifying(false);
    verifyKyc(fullName, idNumber);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-md w-full p-6 space-y-4 text-neutral-100 shadow-2xl">
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Trader Identity Verification (KYC)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Required for real-money trading compliance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsKycModalOpen(false)}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-neutral-300 block mb-1 font-medium">
              Legal Full Name (as per National ID / Passport)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dennis Kiprono"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-neutral-300 block mb-1 font-medium">
              National ID / Passport / Alien ID Number
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 34918204"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-neutral-300 block mb-1 font-medium">
              Country of Residence
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Kenya">Kenya (Safaricom M-Pesa supported)</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Other">Other Global Jurisdiction</option>
            </select>
          </div>

          {/* Legal Risk Disclosure Acknowledgement */}
          <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Trading foreign exchange and CFDs carries a high level of risk and may not be suitable for all investors. Leverage can work against you as well as for you. You should only trade with capital you can afford to lose.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1 border-t border-neutral-800">
              <input
                type="checkbox"
                required
                checked={acceptedRisk}
                onChange={(e) => setAcceptedRisk(e.target.checked)}
                className="rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-0"
              />
              <span className="text-[11px] font-semibold text-white">
                I am 18+ and accept the financial risk disclosure
              </span>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsKycModalOpen(false)}
              className="flex-1 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded transition-colors"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Unlock Real Trading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
