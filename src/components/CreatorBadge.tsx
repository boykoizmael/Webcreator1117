import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Clock, 
  ChevronDown,
  HelpCircle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

interface CreatorBadgeProps {
  onOpenContactModal: (topic?: string) => void;
}

export const CreatorBadge: React.FC<CreatorBadgeProps> = ({ onOpenContactModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = 'Webcreator1117@outlook.com';

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

  const handleMailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenContactModal('what should we add??');
  };

  return (
    <div 
      id="creator-badge-container"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Primary Pill Button in Top Right Corner */}
      <div 
        id="creator-top-right-badge"
        onClick={() => onOpenContactModal('Ask questions to the owner of the Website')}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#191d29] via-[#1c2233] to-[#171c2b] border border-cyan-500/40 hover:border-cyan-400/80 shadow-md shadow-cyan-950/40 cursor-pointer transition-all duration-200 group select-none"
        title="Website Created by Webcreator1117 • Click to contact or hover for menu"
      >
        {/* Creator Icon with pulsing status dot */}
        <div className="relative shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-xs shadow-sm ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <span>W</span>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#161820] animate-pulse"></span>
        </div>

        {/* Creator Identity Text */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-cyan-300/90 font-medium tracking-tight">
            Website Created by
          </span>
          <span className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors flex items-center gap-1">
            <span>Webcreator1117</span>
            <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform duration-200 ${isHovered ? 'rotate-180' : ''}`} />
          </span>
        </div>
      </div>

      {/* Hover Drop Bar / Menu */}
      {isHovered && (
        <div 
          id="creator-hover-dropbar"
          className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-[#151824] border-2 border-cyan-500/50 rounded-2xl shadow-2xl p-4 z-50 animate-fadeIn backdrop-blur-md text-left"
        >
          {/* Drop Bar Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#252b3d] gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow">
                W
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Webcreator1117</span>
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-semibold">
                    Owner
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Lead Website Creator</span>
                </div>
              </div>
            </div>

            {/* Guaranteed Response Pill */}
            <div className="bg-emerald-950/90 border border-emerald-500/40 rounded-lg px-2 py-1 text-right shrink-0">
              <div className="text-[9px] font-bold text-emerald-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>2–3 Days</span>
              </div>
              <div className="text-[8px] text-emerald-400/80 font-medium">
                Always responds!
              </div>
            </div>
          </div>

          {/* Requested Prompts & Inquiries */}
          <div className="py-3 space-y-2">
            <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask questions to the owner of the Website</span>
            </div>

            {/* What should we add?? button */}
            <button
              onClick={() => onOpenContactModal('what should we add??')}
              className="w-full text-left p-2.5 rounded-xl bg-[#1d2232] hover:bg-[#252c42] border border-[#2d364f] hover:border-cyan-400/50 transition-all flex items-center justify-between group/btn cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-200 group-hover/btn:text-white">
                  what should we add??
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded font-mono">
                Suggest
              </span>
            </button>

            {/* what should we do button */}
            <button
              onClick={() => onOpenContactModal('what should we do')}
              className="w-full text-left p-2.5 rounded-xl bg-[#1d2232] hover:bg-[#252c42] border border-[#2d364f] hover:border-cyan-400/50 transition-all flex items-center justify-between group/btn cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover/btn:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-200 group-hover/btn:text-white">
                  what should we do
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded font-mono">
                Ideas
              </span>
            </button>
          </div>

          {/* Email Location & Direct Mail Button */}
          <div className="pt-2 border-t border-[#252b3d] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="font-semibold text-gray-300">Contact Email:</span>
              <button
                onClick={handleCopyEmail}
                className="text-[10px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer font-medium"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Clickable Email Display */}
            <button
              onClick={handleMailClick}
              className="w-full py-2 px-3 rounded-xl bg-[#10131d] hover:bg-[#161a28] border border-[#293147] hover:border-cyan-500/50 text-left transition-all flex items-center justify-between cursor-pointer"
              title="Click to write and send an email to Webcreator1117"
            >
              <span className="text-xs font-mono font-bold text-cyan-300 truncate">
                {email}
              </span>
              <Send className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1.5" />
            </button>

            {/* 2-3 Days Note */}
            <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-center gap-1 text-center bg-emerald-950/50 py-1.5 rounded-lg border border-emerald-500/20">
              <span>Response with always 2-3days!</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
