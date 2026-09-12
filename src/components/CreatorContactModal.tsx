import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  Clock, 
  UserCheck, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

interface CreatorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const CreatorContactModal: React.FC<CreatorContactModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'What should we add??'
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = 'Webcreator1117@outlook.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  const getEncodedSubject = () => {
    return encodeURIComponent(`[Eaglecraft Web] ${topic} ${senderName ? `- from ${senderName}` : ''}`);
  };

  const getEncodedBody = () => {
    const header = senderName ? `From: ${senderName}\n\n` : '';
    const text = message || `Hi Webcreator1117,\n\nI wanted to ask / suggest:\n- Topic: ${topic}\n\n`;
    return encodeURIComponent(header + text + `\n\n---\nSent via Eaglecraft Web Portal`);
  };

  const handleSendMailto = () => {
    const mailtoUrl = `mailto:${email}?subject=${getEncodedSubject()}&body=${getEncodedBody()}`;
    window.location.href = mailtoUrl;
  };

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${getEncodedSubject()}&body=${getEncodedBody()}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenOutlookWeb = () => {
    const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}&subject=${getEncodedSubject()}&body=${getEncodedBody()}`;
    window.open(outlookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="creator-contact-modal"
        className="relative w-full max-w-xl bg-[#161822] border border-[#2e3547] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282f42] bg-[#1a1d2a]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-950/50">
                <Mail className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1a1d2a] rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Contact Webcreator1117</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Website Owner
                </span>
              </div>
              <p className="text-xs text-gray-400">Direct creator inbox • Feedback, ideas & questions</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#252a3a] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Response Promise Banner */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#1a2b25] to-[#162534] border border-emerald-500/30">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>Response always within 2–3 days!</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <div className="text-gray-300 text-[11px] mt-0.5">
                Have ideas or suggestions? Send what you want to send directly to the owner.
              </div>
            </div>
          </div>

          {/* Direct Email Address Card */}
          <div className="bg-[#12141c] border border-[#262c3e] rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Official Creator Email
              </div>
              <div className="text-sm font-mono font-bold text-emerald-400 select-all">
                {email}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg bg-[#222838] hover:bg-[#2c344a] text-gray-200 text-xs font-semibold flex items-center gap-1.5 border border-[#353e56] transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-300" />}
                <span>{copied ? 'Copied Email!' : 'Copy Email'}</span>
              </button>
              <button
                onClick={handleSendMailto}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-950/50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Mail</span>
              </button>
            </div>
          </div>

          {/* Interactive Message Composer */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              Choose What You Want to Ask or Suggest
            </label>

            {/* Quick Topic Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTopic('what should we add??')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  topic === 'what should we add??'
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-[#181b26] border-[#293043] text-gray-300 hover:bg-[#202535]'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span>What should we add??</span>
              </button>

              <button
                type="button"
                onClick={() => setTopic('what should we do')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  topic === 'what should we do'
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-[#181b26] border-[#293043] text-gray-300 hover:bg-[#202535]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>What should we do</span>
              </button>

              <button
                type="button"
                onClick={() => setTopic('Ask questions to the owner of the Website')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all cursor-pointer flex items-center gap-2 ${
                  topic === 'Ask questions to the owner of the Website'
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-[#181b26] border-[#293043] text-gray-300 hover:bg-[#202535]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ask questions to owner</span>
              </button>
            </div>

            {/* Sender Name / Alias */}
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">
                Your Name, Gamertag or Email (optional)
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. DiamondMiner123 or student@school.edu"
                className="w-full bg-[#12141c] border border-[#2b3245] rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Message Box */}
            <div>
              <label className="text-xs text-gray-400 font-medium block mb-1">
                Your Message / Feature Idea
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write what you think we should add, what servers to include, or any question for Webcreator1117..."
                className="w-full bg-[#12141c] border border-[#2b3245] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Convenient Send Actions (supports School Chromebooks without native mail clients) */}
          <div className="space-y-2 pt-2 border-t border-[#252b3d]">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Send Your Message To Webcreator1117
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleSendMailto}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-950/60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mail App</span>
              </button>

              <button
                onClick={handleOpenGmail}
                className="w-full py-2.5 px-3 rounded-xl bg-[#222838] hover:bg-[#2c344a] text-gray-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-[#353e56] transition-all cursor-pointer"
                title="Send using Gmail in browser (ideal for school Google accounts)"
              >
                <ExternalLink className="w-3.5 h-3.5 text-red-400" />
                <span>Gmail Web</span>
              </button>

              <button
                onClick={handleOpenOutlookWeb}
                className="w-full py-2.5 px-3 rounded-xl bg-[#222838] hover:bg-[#2c344a] text-gray-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-[#353e56] transition-all cursor-pointer"
                title="Send using Outlook / Hotmail in browser"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Outlook Web</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#13151f] border-t border-[#232838] flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Created by <strong className="text-white">Webcreator1117</strong></span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-[#222634] hover:bg-[#2a3042] text-gray-300 text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
