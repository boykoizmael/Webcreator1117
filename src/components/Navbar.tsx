import React, { useState } from 'react';
import { 
  Maximize, 
  Minimize, 
  Keyboard, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Gamepad2,
  GraduationCap,
  Download,
  BookOpen,
  Globe
} from 'lucide-react';
import { ClientMirror } from '../types';
import { copyToClipboard } from '../utils/gameUtils';
import { downloadOfflineGame } from '../utils/stealthUtils';
import { CreatorBadge } from './CreatorBadge';
import { getActiveUser } from '../utils/accountManager';
import { UserAccount } from '../types';
import { User } from 'lucide-react';

interface NavbarProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  activeServerUrl: string;
  activeMirror: ClientMirror;
  onReloadGame: () => void;
  onOpenControls: () => void;
  onOpenSchoolBypass: (tab?: 'urls' | 'download' | 'aboutblank' | 'cloak' | 'host') => void;
  onToggleDecoy?: () => void;
  onOpenContactModal?: (topic?: string) => void;
  onOpenAuthModal?: (tab?: 'signin' | 'signup' | 'reset') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isFullscreen,
  onToggleFullscreen,
  activeServerUrl,
  activeMirror,
  onReloadGame,
  onOpenControls,
  onOpenSchoolBypass,
  onToggleDecoy,
  onOpenContactModal = (_topic?: string) => {},
  onOpenAuthModal
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeUser, setActiveUser] = useState<UserAccount | null>(getActiveUser());

  React.useEffect(() => {
    const handleAuth = () => setActiveUser(getActiveUser());
    window.addEventListener('auth-state-changed', handleAuth);
    return () => window.removeEventListener('auth-state-changed', handleAuth);
  }, []);

  const handleCopyServer = async () => {
    const success = await copyToClipboard(activeServerUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDirect = () => {
    window.open(activeMirror.url, '_blank', 'noopener,noreferrer');
  };

  const handleQuickDownload = () => {
    setDownloading(true);
    downloadOfflineGame('/download/GRC-EDU-1117-Syllabus.html', 'GRC-EDU-1117-Syllabus.html');
    setTimeout(() => setDownloading(false), 3000);
  };

  return (
    <header id="app-navbar" className="w-full bg-[#16181d] border-b border-[#292d37] px-4 py-2.5 sm:px-6 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 border border-emerald-300/40 flex items-center justify-center shadow-md shadow-emerald-950/40 text-xl">
              🌐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-lg font-bold tracking-wider text-white">1117</span>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => onOpenContactModal('what should we add??')}
              className="p-1.5 bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white rounded-md text-xs font-bold shadow flex items-center justify-center w-8 h-8"
              title="Contact Webcreator1117"
            >
              W
            </button>

            {onToggleDecoy && (
              <button
                onClick={onToggleDecoy}
                className="p-2 bg-blue-900/40 text-blue-300 border border-blue-500/40 rounded-md text-xs font-semibold flex items-center gap-1"
                title="Canvas Decoy Mode"
              >
                <BookOpen className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenSchoolBypass}
              className="p-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-md text-xs font-semibold flex items-center gap-1"
              title="Green River & Stealth Hub"
            >
              <GraduationCap className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Canvas Decoy Button */}
          {onToggleDecoy && (
            <button
              onClick={onToggleDecoy}
              className="px-2.5 py-1.5 bg-[#1f2535] hover:bg-[#283248] border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Switch to Green River College Canvas Decoy Screen"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden xl:inline">Canvas Decoy</span>
            </button>
          )}

          {/* Non-Google Hosts Hub Button */}
          <button
            id="nav-non-google-hosts-btn"
            onClick={() => onOpenSchoolBypass('host')}
            className="px-2.5 py-1.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 rounded-lg text-xs font-semibold text-blue-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Non-Google Hosts: Play via GitHub, Deev.is, Cloudflare or In-Memory Blob"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xl:inline">Non-Google Hosts</span>
          </button>

          {/* School Unblock & Stealth Button */}
          <button
            id="nav-school-bypass-btn"
            onClick={() => onOpenSchoolBypass('urls')}
            className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-lg text-xs font-semibold text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Green River College URLs & Stealth Hub"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Green River & Stealth</span>
          </button>

          {/* Quick Offline HTML Download */}
          <button
            id="nav-download-offline-btn"
            onClick={handleQuickDownload}
            className="px-2.5 py-1.5 bg-[#1f222a] hover:bg-[#282d38] border border-[#343a46] rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download offline HTML disguised as GRC-EDU-1117-Syllabus.html"
          >
            {downloading ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Download className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span className="hidden lg:inline">{downloading ? 'Downloading...' : 'Offline Syllabus'}</span>
          </button>

          {/* Controls Button */}
          <button
            id="nav-controls-btn"
            onClick={onOpenControls}
            className="px-2.5 py-1.5 bg-[#1f222a] hover:bg-[#282d38] border border-[#343a46] rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            title="View Minecraft Keyboard & Mouse Controls"
          >
            <Keyboard className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Controls</span>
          </button>

          {/* Reload Button */}
          <button
            id="nav-reload-btn"
            onClick={onReloadGame}
            className="p-1.5 bg-[#1f222a] hover:bg-[#282d38] border border-[#343a46] rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Reload game client"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* New Tab / Popout */}
          <button
            id="nav-direct-window-btn"
            onClick={handleOpenDirect}
            className="p-1.5 bg-[#1f222a] hover:bg-[#282d38] border border-[#343a46] rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Open game directly in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          {/* Top Right Corner Creator Badge with Hover Drop Bar */}
          <div className="hidden sm:block">
            <CreatorBadge onOpenContactModal={onOpenContactModal} />
          </div>

          {/* User Account / Sign In Pill */}
          {onOpenAuthModal && (
            <button
              id="nav-user-account-btn"
              onClick={() => onOpenAuthModal(activeUser ? 'signin' : 'signup')}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                activeUser
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/90'
                  : 'bg-[#1e2330] hover:bg-[#283042] border-[#364057] text-white'
              }`}
              title={activeUser ? `Account: @${activeUser.username} (${activeUser.rank})` : 'Create Account or Sign In'}
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {activeUser ? `@${activeUser.username}` : 'Account'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
