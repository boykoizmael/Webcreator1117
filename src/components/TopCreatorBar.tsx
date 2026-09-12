import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  Copy, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Crown,
  User,
  Shield
} from 'lucide-react';
import { getActiveUser } from '../utils/accountManager';
import { UserAccount } from '../types';

interface TopCreatorBarProps {
  onOpenContactModal: (topic?: string) => void;
  onOpenPaymentModal?: (plan?: 'original' | 'vip' | 'sidekick' | 'nolife') => void;
  onOpenAuthModal?: (tab?: 'signin' | 'signup' | 'reset') => void;
}

export const TopCreatorBar: React.FC<TopCreatorBarProps> = ({ 
  onOpenContactModal,
  onOpenPaymentModal,
  onOpenAuthModal
}) => {
  const [copied, setCopied] = useState(false);
  const [activeUser, setActiveUser] = useState<UserAccount | null>(getActiveUser());
  const email = 'Webcreator1117@outlook.com';

  useEffect(() => {
    const handleAuth = () => setActiveUser(getActiveUser());
    window.addEventListener('auth-state-changed', handleAuth);
    return () => window.removeEventListener('auth-state-changed', handleAuth);
  }, []);

  const handleCopyEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div 
      id="top-creator-announcement-bar"
      className="w-full bg-gradient-to-r from-[#121520] via-[#161b29] to-[#121520] border-b border-cyan-500/30 px-4 py-1.5 text-xs text-gray-300 shadow-sm relative z-40"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        {/* Creator Info & Contact Email */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-bold text-[10px] shadow">
              W
            </span>
            <span className="text-gray-300">Website Created by</span>
            <strong className="text-white font-bold tracking-wide">Webcreator1117</strong>
          </div>

          <span className="hidden sm:inline text-gray-600">•</span>

          {/* Contact Location */}
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-gray-400">Contact:</span>
            <button
              onClick={() => onOpenContactModal('what should we add??')}
              className="text-cyan-300 hover:text-cyan-200 font-mono font-bold hover:underline cursor-pointer transition-colors"
              title="Click to write and send what you want to send"
            >
              {email}
            </button>
            <button
              onClick={handleCopyEmail}
              className="p-1 hover:bg-[#222838] rounded text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Copy email address"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Guaranteed Response & Quick Action Prompts */}
        <div className="flex items-center gap-2 justify-center sm:justify-end text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-medium shrink-0">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>Response with always 2-3days!</span>
          </span>

          <button
            onClick={() => onOpenContactModal('what should we add??')}
            className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3 h-3 text-amber-300" />
            <span className="hidden md:inline">What should we add?</span>
            <span className="md:hidden">Ask / Suggest</span>
          </button>

          {onOpenAuthModal && (
            <button
              onClick={() => onOpenAuthModal(activeUser ? 'signin' : 'signup')}
              className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                activeUser
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-[#1b2234] border-[#313c54] text-white hover:bg-[#242e47]'
              }`}
              title={activeUser ? `Logged in as @${activeUser.username}` : 'Sign in or create account'}
            >
              <User className="w-3 h-3 text-emerald-400" />
              <span>{activeUser ? `@${activeUser.username}` : 'Account / Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
