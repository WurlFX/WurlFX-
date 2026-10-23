import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, ShieldCheck, ChevronRight, X } from 'lucide-react';

export const RiskBanner: React.FC = () => {
  const { accountType, kycVerified, setIsKycModalOpen } = useApp();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="bg-neutral-900/90 border-b border-neutral-800 text-xs px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-neutral-300">
          {accountType === 'demo' ? (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                Demo Mode
              </span>
              <span className="text-neutral-400 hidden sm:inline">
                You are trading with $10,000 risk-free virtual funds. No real money is at risk.
              </span>
              <span className="text-neutral-400 sm:hidden">
                Virtual practice funds active.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                Real Trading
              </span>
              <span className="text-neutral-300">
                Leveraged CFDs carry substantial capital risk.{' '}
                {!kycVerified ? (
                  <button
                    onClick={() => setIsKycModalOpen(true)}
                    className="text-amber-400 font-medium underline inline-flex items-center gap-0.5 hover:text-amber-300"
                  >
                    <span>ID Verification required before placing real orders</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    Verified Trader Tier 1 · Capital Segregated
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-neutral-500 text-[11px] hidden lg:inline">
            Official Brokerage & Growth Platform · Managed by Wurl_Sphilah
          </span>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-neutral-500 hover:text-neutral-300 p-0.5"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
