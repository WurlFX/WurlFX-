import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, RefreshCw, ExternalLink, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const OrderTracker: React.FC = () => {
  const { socialOrders, requestRefill, formatMoney, setActiveTab } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Real-Time Delivery Engine
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Social Growth Orders &amp; Progress
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Track live dispatch status, delivery milestones, algorithmic pacing, and warranty refill coverage.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('boosting')}
          className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto"
        >
          + New Growth Order
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {socialOrders.map((order) => {
          const isDone = order.status === 'COMPLETED';
          return (
            <div
              key={order.id}
              className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 space-y-4 hover:border-neutral-700 transition-colors"
            >
              {/* Top row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-white uppercase px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                    {order.platform}
                  </span>
                  <span className="font-semibold text-sm text-white">
                    {order.serviceName}
                  </span>
                  <span className="text-xs text-neutral-500 tabular-nums">
                    #{order.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3 animate-spin" />
                    )}
                    <span>{order.status.replace('_', ' ')}</span>
                  </span>

                  <span className="text-xs font-bold text-white tabular-nums">
                    {formatMoney(order.totalUsd)}
                  </span>
                </div>
              </div>

              {/* Progress Bar & Numerical stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Delivered:</span>
                    <span className="font-bold text-white tabular-nums">
                      {order.deliveredCount.toLocaleString()} / {order.quantity.toLocaleString()}
                    </span>
                  </div>

                  <div className="font-bold tabular-nums text-emerald-400">
                    {order.progressPercent}%
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      isDone
                        ? 'bg-emerald-500'
                        : 'bg-gradient-to-r from-emerald-500 to-sky-400'
                    }`}
                    style={{ width: `${order.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Footer details & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400 pt-1">
                <div className="flex items-center gap-3 truncate">
                  <span className="text-neutral-500">Target:</span>
                  <span className="text-neutral-300 font-mono text-[11px] truncate max-w-xs sm:max-w-md">
                    {order.targetLink}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-neutral-500">
                    {order.estimatedDelivery}
                  </span>

                  {isDone && (
                    <button
                      onClick={() => requestRefill(order.id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 rounded flex items-center gap-1 transition-colors"
                      title="Request refill if you experienced any drop"
                    >
                      <RefreshCw className="w-3 h-3 text-emerald-400" />
                      <span>Request Refill</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {socialOrders.length === 0 && (
          <div className="py-16 text-center text-neutral-500 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3">
            <p className="text-sm">No growth orders placed yet.</p>
            <button
              onClick={() => setActiveTab('boosting')}
              className="px-4 py-2 bg-emerald-500 text-neutral-950 font-bold text-xs rounded-lg"
            >
              Configure First Boost
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
