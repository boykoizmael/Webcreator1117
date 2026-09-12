import React from 'react';
import { Mail, Clock, Send, Sparkles } from 'lucide-react';

interface FooterProps {
  onOpenContactModal?: (topic?: string) => void;
}

const DAILY_QUOTES = [
  'Small steps still move you forward.',
  'Make today useful.',
  'Curiosity opens new paths.',
  'Keep building what matters.',
  'A fresh idea can change everything.',
  'Progress begins with one try.',
  'Stay focused, stay creative.'
];

const getDailyQuote = () => {
  const today = new Date();
  const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
  return DAILY_QUOTES[Math.abs(dayNumber) % DAILY_QUOTES.length];
};

export const Footer: React.FC<FooterProps> = ({ onOpenContactModal = (_topic?: string) => {} }) => {
  const dailyQuote = getDailyQuote();

  return (
    <footer className="w-full border-t border-[#232733] bg-[#12141a] py-8 px-4 sm:px-6 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <span className="text-base" role="img" aria-label="Web browser">🌐</span>
          <span className="text-gray-300 italic">"{dailyQuote}"</span>
        </div>

        {/* Creator & Contact Location */}
        <div className="flex flex-wrap items-center gap-2.5 justify-center bg-[#181b24] px-3 py-1.5 rounded-xl border border-[#2d3548]">
          <span className="text-gray-300">Created by <strong className="text-white font-bold">Webcreator1117</strong></span>
          <span>•</span>
          <button
            onClick={() => onOpenContactModal('what should we add??')}
            className="text-cyan-300 hover:text-cyan-200 font-mono font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Send email to Webcreator1117@outlook.com"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Webcreator1117@outlook.com</span>
          </button>
          <span>•</span>
          <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Always replies in 2-3 days</span>
          </span>
        </div>

        <div className="text-gray-500 text-[11px]">
          Chat about the Website
        </div>
      </div>
    </footer>
  );
};
