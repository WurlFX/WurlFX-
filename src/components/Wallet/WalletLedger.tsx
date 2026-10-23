import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  ShieldCheck,
  Download,
  RefreshCw,
  Gift,
  Copy,
  Building2,
  CheckCircle2,
  Share2,
} from 'lucide-react';

export const WalletLedger: React.FC = () => {
  const {
    transactions,
    formatMoney,
    currentBalance,
    equity,
    accountType,
    currentUser,
    claimReferralBonus,
    addMockReferral,
    setIsDepositModalOpen,
    showNotification,
  } = useApp();

  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [claimAmount, setClaimAmount] = useState<string>('400');

  // Referral Calculations
  const unwithdrawnBonus = currentUser.referralBonusKes - currentUser.referralWithdrawnKes;
  const maxRemainingWithdrawal = Math.max(0, 1000 - currentUser.referralWithdrawnKes);
  const claimableNow = Math.min(unwithdrawnBonus, maxRemainingWithdrawal);

  const filteredTransactions = transactions.filter((txn) => {
    const matchType = filterType === 'ALL' || txn.type === filterType;
    const matchSearch =
      txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (txn.notes && txn.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchType && matchSearch;
  });

  const handleExportCsv = () => {
    const header = 'ID,Type,AmountKES,AmountUSD,Method,Status,Date,Notes\n';
    const rows = transactions
      .map(
        (t) =>
          `"${t.id}","${t.type}","${t.amountKes}","${t.amountUsd}","${t.method}","${t.status}","${new Date(t.timestamp).toISOString()}","${t.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wurlfx-financial-statement-${Date.now()}.csv`;
    a.click();
    showNotification('Financial ledger statement exported to CSV successfully.', 'success');
  };

  const copyReferralLink = () => {
    const link = `https://wurlfx.com/?ref=${currentUser.referralCode}`;
    navigator.clipboard.writeText(link);
    showNotification('Referral link copied to clipboard! Share with friends.', 'success');
  };

  const handleClaim = () => {
    const val = parseFloat(claimAmount);
    if (!val || val <= 0) {
      showNotification('Please enter a valid amount to claim.', 'error');
      return;
    }
    const res = claimReferralBonus(val);
    if (!res.success) {
      showNotification(res.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Summary Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              {accountType.toUpperCase()} FINANCIAL RESERVES
            </span>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-extrabold text-white tabular-nums">
                {formatMoney(currentBalance)}
              </h2>
              <span className="text-xs text-neutral-400">
                (Equity: <span className="text-emerald-400 font-semibold">{formatMoney(equity)}</span>)
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
              Unified treasury balance. Your capital powers live forex market orders, sports betting accumulators, Sprime crash rounds, and social growth packages. Minimum deposit allowed: <span className="text-emerald-400 font-semibold">KSh 200</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Deposit via Co-op Paybill 400200</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Verified Co-operative Bank Merchant Paybill Card */}
      <div className="bg-neutral-950 border border-emerald-500/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Co-operative Bank of Kenya · Official Paybill</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-mono">
                Verified
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Paybill: <strong className="text-white font-mono">400200</strong> · Account Number: <strong className="text-emerald-400 font-mono">25470215481001</strong> · Reference Nickname: <strong className="text-white">WURLFX</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDepositModalOpen(true)}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          View Payment Instructions
        </button>
      </div>

      {/* Referral Program Card (KSh 50 per referral, max KSh 1,000 withdrawal) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                WurlFX Refer &amp; Earn Program
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                KSh 50 / Invite
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Invite friends to trade or bet on WurlFX. Earn <span className="text-emerald-400 font-bold">KSh 50 for every verified referral</span>. Maximum lifetime referral withdrawal limit is <span className="text-emerald-400 font-bold">KSh 1,000</span>.
            </p>
          </div>

          <button
            onClick={copyReferralLink}
            className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copy Invite Link ({currentUser.referralCode})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block">Total Friends Invited</span>
            <span className="text-lg font-black text-white font-mono">{currentUser.referralsCount}</span>
          </div>

          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block">Earned Bonus (KSh 50/ea)</span>
            <span className="text-lg font-black text-white font-mono">
              KSh {currentUser.referralBonusKes.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800">
            <span className="text-[11px] text-neutral-400 block">Claimed / Withdrawn</span>
            <span className="text-lg font-black text-neutral-400 font-mono">
              KSh {currentUser.referralWithdrawnKes.toLocaleString()} / 1,000
            </span>
          </div>

          <div className="p-3.5 bg-neutral-950 rounded-xl border border-emerald-500/40">
            <span className="text-[11px] text-emerald-400 font-bold block">Available to Transfer</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              KSh {claimableNow.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Claim / Transfer Action */}
        <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-white">Transfer Referral Bonus to Wallet</div>
            <div className="text-[11px] text-neutral-400">
              Transfers directly to your active trading &amp; betting balance. Maximum allowance: KSh 1,000.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              min="50"
              max={claimableNow}
              step="50"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              className="w-24 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-mono font-bold text-white text-center"
            />
            <button
              onClick={handleClaim}
              disabled={claimableNow <= 0}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
            >
              Transfer to Balance
            </button>
            <button
              onClick={addMockReferral}
              className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-[11px]"
              title="Simulate someone joining through your referral link"
            >
              +Simulate Invite
            </button>
          </div>
        </div>
      </div>

      {/* Ledger Header & Search */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transactions by reference or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['ALL', 'DEPOSIT', 'WITHDRAWAL', 'BET_STAKE', 'BET_PAYOUT', 'BOOST_ORDER', 'REFERRAL_PAYOUT'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap text-[11px] ${
                  filterType === f
                    ? 'bg-neutral-800 text-white font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] uppercase font-semibold text-neutral-500">
                <th className="px-3 py-2">Transaction ID</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Method</th>
                <th className="px-3 py-2">Date &amp; Time</th>
                <th className="px-3 py-2">Details / Memo</th>
                <th className="px-3 py-2 text-right">Amount</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredTransactions.map((txn) => {
                const isCredit =
                  txn.type === 'DEPOSIT' ||
                  txn.type === 'TRADE_PROFIT' ||
                  txn.type === 'BET_PAYOUT' ||
                  txn.type === 'REFERRAL_PAYOUT';
                return (
                  <tr key={txn.id} className="hover:bg-neutral-900/40 transition-colors tabular-nums">
                    <td className="px-3 py-2.5 font-mono text-[11px] text-neutral-300">
                      {txn.id}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          txn.type === 'DEPOSIT'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : txn.type === 'WITHDRAWAL'
                            ? 'bg-blue-500/10 text-blue-400'
                            : txn.type === 'BET_PAYOUT'
                            ? 'bg-amber-500/10 text-amber-300'
                            : txn.type === 'BET_STAKE'
                            ? 'bg-rose-500/10 text-rose-300'
                            : txn.type === 'REFERRAL_PAYOUT'
                            ? 'bg-purple-500/10 text-purple-300'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        {txn.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-neutral-300">{txn.method}</td>
                    <td className="px-3 py-2.5 text-neutral-400">
                      {new Date(txn.timestamp).toLocaleDateString()} {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-3 py-2.5 text-neutral-400 max-w-xs truncate">
                      {txn.notes || '-'}
                    </td>
                    <td
                      className={`px-3 py-2.5 text-right font-semibold font-mono ${
                        isCredit ? 'text-emerald-400' : 'text-neutral-200'
                      }`}
                    >
                      {isCredit ? '+' : '-'}KSh {txn.amountKes.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          txn.status === 'COMPLETED'
                            ? 'text-emerald-400'
                            : txn.status === 'PROCESSING'
                            ? 'text-amber-400'
                            : 'text-rose-500'
                        }`}
                      >
                        ● {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-neutral-500 text-xs">
              No transactions match your current query or category filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
