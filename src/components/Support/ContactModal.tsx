import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, MessageSquare, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ContactModal: React.FC = () => {
  const { isContactModalOpen, setIsContactModalOpen, showNotification } = useApp();

  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('wurlfxhelpcare@gmail.com');
  const [userPhone, setUserPhone] = useState('0762294296');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSent, setTicketSent] = useState(false);

  if (!isContactModalOpen) return null;

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSubmitting(false);
    setTicketSent(true);
    showNotification('Support ticket logged with Wurl_Sphilah team. Response expected via WhatsApp/Email.', 'success');
  };

  const whatsappUrl = `https://wa.me/254762294296?text=Hello%20Wurl_Sphilah,%20I%20am%20contacting%20you%20regarding%20WurlFX.com%20Forex%20and%20Social%20Growth%20Services.`;
  const mailtoUrl = `mailto:wurlfxhelpcare@gmail.com?subject=WurlFX%20Inquiry%20from%20Platform`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5 text-neutral-100 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div>
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Official Desk · WurlFX.com
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Contact Founder &amp; Support Desk
            </h3>
          </div>
          <button
            onClick={() => {
              setIsContactModalOpen(false);
              setTicketSent(false);
            }}
            className="text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Founder Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
          <img
            src="/src/assets/images/wurlfx_founder_avatar_1792571918334.jpg"
            alt="Wurl_Sphilah Portrait"
            className="w-14 h-14 rounded-full object-cover border border-emerald-500/30 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-white text-sm">Wurl_Sphilah</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30">
                Principal
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Founder &amp; Senior Market Operator at WurlFX.com
            </p>
            <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
              <span>Nairobi &amp; Global Desks</span>
              <span>·</span>
              <span className="text-emerald-400">Fast Response</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-neutral-950 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                WhatsApp Direct
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">
                0762294296
              </div>
            </div>
          </a>

          <a
            href={mailtoUrl}
            className="p-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded-xl flex items-center gap-3 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center text-white shrink-0">
              <Mail className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                Official Email
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                wurlfxhelpcare@gmail.com
              </div>
            </div>
          </a>
        </div>

        {ticketSent ? (
          <div className="py-6 text-center space-y-2 bg-neutral-950 rounded-xl border border-neutral-800 p-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-sm text-white">Ticket #WFX-TK982 Received</h4>
            <p className="text-xs text-neutral-400">
              Thank you for reaching out. Wurl_Sphilah will reply to your WhatsApp (0762294296) or Email within minutes.
            </p>
            <button
              onClick={() => setTicketSent(false)}
              className="mt-2 text-xs text-emerald-400 underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-3 pt-1">
            <div className="text-xs font-semibold text-neutral-300">
              Direct Desk Inquiry Form
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500"
              />
              <input
                type="tel"
                required
                placeholder="WhatsApp Phone (e.g. 0762294296)"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500"
              />
            </div>

            <input
              type="text"
              required
              placeholder="Subject (e.g. KSH 15,000 Campaign inquiry, Forex deposit, Order Refill)"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500"
            />

            <textarea
              required
              rows={3}
              placeholder="Describe your requirement, campaign target or trading inquiry..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500"
            />

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="px-3 py-1.5 bg-neutral-800 rounded text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Transmitting...' : 'Send to Wurl_Sphilah'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
