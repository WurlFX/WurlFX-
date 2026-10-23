import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Phone, Mail, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setIsContactModalOpen, setIsDepositModalOpen } = useApp();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & Overview */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                WurlFX<span className="text-emerald-400">.com</span>
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-md">
              A premier dual financial engine combining institutional-grade Forex trading simulation with algorithmic social media growth services. Starting package price: KSH 15,000.
            </p>

            <div className="flex items-center gap-4 pt-1 text-xs text-neutral-300">
              <a
                href="https://wa.me/254762294296"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: 0762294296</span>
              </a>

              <a
                href="mailto:wurlfxhelpcare@gmail.com"
                className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>wurlfxhelpcare@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              Platform Features
            </div>
            <ul className="space-y-1.5 text-neutral-400">
              <li>
                <button
                  onClick={() => setActiveTab('terminal')}
                  className="hover:text-white transition-colors"
                >
                  Live Forex Terminal
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('boosting')}
                  className="hover:text-white transition-colors"
                >
                  Social Media Boosting
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="hover:text-white transition-colors"
                >
                  Growth Campaigns (From KSH 15K)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="hover:text-white transition-colors"
                >
                  Order Delivery Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className="hover:text-white transition-colors"
                >
                  Treasury &amp; M-Pesa Cashier
                </button>
              </li>
            </ul>
          </div>

          {/* External Services Section */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>External Services</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Verified links to third-party operators (opens in new tab; leaves WurlFX):
            </p>
            <ul className="space-y-1.5 text-neutral-400 text-xs">
              <li>
                <a
                  href="https://www.betika.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  title="Official Betika Sports Betting Platform (Leaves WurlFX)"
                >
                  <span>Betika Official</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://shikapesa.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  title="Official Shikapesa Financial Platform (Leaves WurlFX)"
                >
                  <span>Shikapesa Official</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.denzgains.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  title="Official DenzGains SMM Platform (Leaves WurlFX)"
                >
                  <span>Denzgains Official</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-emerald-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Management & Regulatory Desk */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs uppercase tracking-wider">
              Founder &amp; Desk
            </div>
            <p className="text-neutral-400 text-xs">
              Principal: <span className="text-white font-medium">Wurl_Sphilah</span>
            </p>
            <p className="text-neutral-400 text-xs">
              Nairobi Central Desk &amp; International Delivery Node
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded text-xs font-medium transition-colors"
              >
                Open Support Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Regulatory Risk Notice */}
        <div className="border-t border-neutral-900 pt-6 space-y-2 text-[11px] text-neutral-500 leading-relaxed">
          <div className="flex items-center gap-1.5 text-neutral-400 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>Financial Risk Disclosure &amp; Regulatory Separation</span>
          </div>
          <p>
            Forex trading and Contracts for Difference (CFDs) are leveraged products carrying high financial risk to your invested capital. Demo accounts utilize virtual practice funds with zero real-money liability. Real-money accounts require legal age and complete KYC identity verification. Social media boosting services adhere to organic delivery pacing with 30-to-90 day refill warranties.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-neutral-900 text-[11px] text-neutral-500">
            <div>
              &copy; {new Date().getFullYear()} WurlFX.com. All rights reserved. Directed by Wurl_Sphilah.
            </div>
            <div className="flex items-center gap-3 mt-2 sm:mt-0">
              <span>Starting Order: KSH 15,000</span>
              <span>·</span>
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Execution</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
