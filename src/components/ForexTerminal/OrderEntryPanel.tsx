tsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const OrderEntryPanel: React.FC = () => {
  const { selectedAsset, formatMoney } = useApp();
  const [amount, setAmount] = useState(200);
  const [autoSell, setAutoSell] = useState(10);
  const [pnl, setPnl] = useState(0);

  const handleBuy = () => {
    // Your buy logic here
    console.log(`BUY ${selectedAsset?.symbol} KES ${amount}`);
    setPnl((Math.random() - 0.5) * 100);
  };

  const handleSell = () => {
    // Your sell logic here
    console.log(`SELL ${selectedAsset?.symbol} KES ${amount}`);
    setPnl((Math.random() - 0.5) * 100);
  };

  return (
    <div className="flex flex-col bg-[#0a0f1e] text-white border-t border-zinc-800">
      {/* KES Amount Selector - Like ShikaPesa */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-[#151c30] px-3 py-2 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 text-xs">KES</span>
            <span className="font-bold text-lg">{amount}</span>
          </div>
          
          <div className="flex gap-2 flex-1">
            {[50, 100, 200, 500].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(v)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                  amount === v
                    ? 'bg-[#1e293b] border-yellow-500/50 text-yellow-400'
                    : 'bg-[#151c30] border-zinc-800 text-zinc-500'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* AUTOSELL and P&L - Like ShikaPesa */}
        <div className="flex justify-between items-center mt-3 px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center bg-black">
              <span className="text-sm font-bold">{autoSell}</span>
            </div>
            <span className="text-xs text-zinc-500 tracking-wider">AUTOSELL</span>
          </div>
          <div className="text-xs">
            <span className="text-zinc-500">P&L </span>
            <span className="text-zinc-300">KES {pnl.toFixed(2)}</span>
          </div>
        </div>

        {/* BIG BUY/SELL Buttons - Like ShikaPesa */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleBuy}
            className="flex-1 bg-[#00d26a] hover:bg-[#00b85a] text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(0,210,106,0.3)] active:scale-95 transition-all"
          >
            BUY
          </button>
          <button
            onClick={handleSell}
            className="flex-1 bg-[#ff2e5c] hover:bg-[#e62952] text-white font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(255,46,92,0.3)] active:scale-95 transition-all"
          >
            SELL
          </button>
        </div>
      </div>

      {/* Bottom Nav - Like ShikaPesa */}
      <div className="flex justify-around items-center py-3 bg-[#080c18] border-t border-zinc-900 mt-2">
        <div className="flex flex-col items-center text-[#00d26a]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text- mt-1">TRADE</span>
        </div>
        <div className="flex flex-col items-center text-zinc-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
          <span className="text- mt-1">DEPOSIT</span>
        </div>
        <div className="flex flex-col items-center text-zinc-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          <span className="text- mt-1">HISTORY</span>
        </div>
        <div className="flex flex-col items-center text-zinc-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text- mt-1">PROFILE</span>
        </div>
      </div>

      <div className="text-[8px] text-zinc-600 text-center py-2 px-2 bg-black">
        Licensed in the Republic of Kenya • CMA • Risk Warning: Trading involves risk • WurlFX V1 • 2.3 • 2024
      </div>
    </div>
  );
};
