import React, { useState, useEffect } from 'react';
import { 
  Maximize, 
  Minimize, 
  RefreshCw, 
  MousePointer, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink, 
  GraduationCap, 
  Download,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Trophy,
  Crosshair,
  Crown,
  History,
  Keyboard,
  Target,
  Lightbulb
} from 'lucide-react';
import { ClientMirror } from '../types';
import { CLIENT_MIRRORS } from '../data/servers';
import { copyToClipboard } from '../utils/gameUtils';
import { downloadOfflineGame } from '../utils/stealthUtils';
import { OneVOneGame } from './games/OneVOneGame';
import { RealisticTetris } from './games/RealisticTetris';
import { CookieClickerGame } from './games/CookieClickerGame';
import { LeaderboardSlide } from './games/LeaderboardSlide';
import { ChatSlide } from './ChatSlide';

interface GameViewportProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  activeMirror: ClientMirror;
  activeServerUrl: string;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  reloadKey: number;
  onReload: () => void;
  onSelectMirror?: (mirror: ClientMirror) => void;
  onOpenSchoolBypass?: () => void;
  onOpenPaymentModal: (plan?: 'original' | 'vip' | 'sidekick' | 'nolife') => void;
  onOpenContactModal: (topic?: string) => void;
  onOpenAuthModal?: (tab?: 'signin' | 'signup' | 'reset') => void;
  onSlideChange?: (slideIndex: number) => void;
}

export const SLIDES = [
  { id: 'minecraft', title: 'Minecraft 1.8.8', icon: '⛏️', subtitle: 'Eaglecraft Web + Servers' },
  { id: '1v1', title: '1v1.lol', icon: '🎯', subtitle: 'Battle Royale & Building' },
  { id: 'tetris', title: 'Tetris Realistic!', icon: '🧱', subtitle: 'Physics, Ghost & SRS' },
  { id: 'cookie', title: 'Cookie Clicker', icon: '🍪', subtitle: 'Bakery & Golden Cookies' },
  { id: 'leaderboard', title: 'Leaderboards', icon: '🏆', subtitle: 'Tetris & Cookie Scores' },
  { id: 'chat', title: 'Chat', icon: '💬', subtitle: 'Talk with people live' }
];

export const GameViewport: React.FC<GameViewportProps> = ({
  containerRef,
  iframeRef,
  activeMirror,
  activeServerUrl,
  isFullscreen,
  onToggleFullscreen,
  reloadKey,
  onReload,
  onSelectMirror,
  onOpenSchoolBypass,
  onOpenPaymentModal,
  onOpenContactModal,
  onOpenAuthModal,
  onSlideChange
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Reset loading state on reload or mirror change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, [reloadKey, activeMirror.id]);

  const handleCopy = async () => {
    const success = await copyToClipboard(activeServerUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenDirect = () => {
    window.open(activeMirror.url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = () => {
    setDownloading(true);
    downloadOfflineGame('/download-game', 'Eaglecraft-1.8.8-Offline.html');
    setTimeout(() => setDownloading(false), 3000);
  };

  const changeSlide = (nextIndex: number) => {
    setCurrentSlide(nextIndex);
    onSlideChange?.(nextIndex);
  };

  const nextSlide = () => {
    changeSlide((currentSlide + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    changeSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);
  };

  const activeSlideData = SLIDES[currentSlide];

  return (
    <div className="space-y-3 relative">
      {/* Top Carousel Navigation Bar: Switch sideways between games */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        {/* Game Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full custom-scrollbar">
          <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Games:</span>
          </span>

          {SLIDES.map((slide, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={slide.id}
                onClick={() => changeSlide(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/50 border border-emerald-400/50 scale-[1.02]'
                    : 'bg-[#181b24] hover:bg-[#232836] text-gray-300 border border-[#2b3346]'
                }`}
              >
                <span>{slide.icon}</span>
                <span>{slide.title}</span>
                {idx === 4 && (
                  <span className="text-[10px] px-1 py-0.2 bg-amber-400 text-black font-black rounded ml-1">
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Side Scroll Hint & Slide Counter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 hidden sm:inline font-mono">
            Slide {currentSlide + 1} of {SLIDES.length}
          </span>

        </div>
      </div>

      {/* Main Game Stage Container with Side Navigation Arrows */}
      <div className="relative group">
        
        {/* LEFT SIDE ARROW: Scroll sideways to previous game */}
        <button
          onClick={prevSlide}
          id="carousel-left-arrow"
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-40 w-10 h-14 sm:w-12 sm:h-18 bg-black/80 hover:bg-emerald-600 active:scale-95 text-white backdrop-blur-md rounded-r-2xl border-y border-r border-white/20 shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-emerald-950/80 group/arrow"
          title={`Previous: ${SLIDES[(currentSlide - 1 + SLIDES.length) % SLIDES.length].title}`}
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover/arrow:-translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-bold hidden sm:block uppercase tracking-tight text-emerald-300 group-hover/arrow:text-white">
            Prev
          </span>
        </button>

        {/* RIGHT SIDE ARROW: Scroll sideways to next game */}
        <button
          onClick={nextSlide}
          id="carousel-right-arrow"
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-40 w-10 h-14 sm:w-12 sm:h-18 bg-black/80 hover:bg-emerald-600 active:scale-95 text-white backdrop-blur-md rounded-l-2xl border-y border-l border-white/20 shadow-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-emerald-950/80 group/arrow"
          title={`Next: ${SLIDES[(currentSlide + 1) % SLIDES.length].title}`}
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover/arrow:translate-x-0.5 transition-transform" />
          <span className="text-[9px] font-bold hidden sm:block uppercase tracking-tight text-emerald-300 group-hover/arrow:text-white">
            Next
          </span>
        </button>

        {/* SLIDE 0: Minecraft (Eaglecraft 1.8.8) */}
        {currentSlide === 0 && (
          <div className="space-y-2.5 animate-fadeIn">
            {/* Mirror Selector Quick Bar & School Bypass Trigger */}
            {!isFullscreen && (
              <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                {onSelectMirror && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    <span className="text-gray-400 font-semibold uppercase text-[11px] tracking-wider shrink-0 mr-1">
                      Client:
                    </span>
                    {CLIENT_MIRRORS.map(mirror => {
                      const isSelected = mirror.id === activeMirror.id;
                      return (
                        <button
                          key={mirror.id}
                          onClick={() => onSelectMirror(mirror)}
                          className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/40'
                              : 'bg-[#1a1d25] hover:bg-[#232732] text-gray-300 border border-[#2f3545]'
                          }`}
                        >
                          <span>{mirror.name}</span>
                          {mirror.badge && (
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                              isSelected ? 'bg-black/30 text-emerald-200' : 'bg-emerald-950 text-emerald-400'
                            }`}>
                              {mirror.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {onOpenSchoolBypass && (
                    <button
                      onClick={onOpenSchoolBypass}
                      className="text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-md flex items-center gap-1 text-xs font-semibold cursor-pointer transition-colors"
                      title="School Unblock, Stealth Cloak & Offline Guide"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>School / Stealth Hub</span>
                    </button>
                  )}

                  <button
                    onClick={handleOpenDirect}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-xs font-semibold hover:underline cursor-pointer"
                    title="Open Eaglercraft game page in a dedicated browser tab"
                  >
                    <span>Open in New Tab</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Main Game Container */}
            <div 
              id="eaglecraft-game-container"
              ref={containerRef}
              className={`relative w-full bg-[#0a0a0d] border border-[#2e3442] shadow-2xl transition-all duration-200 overflow-hidden ${
                isFullscreen 
                  ? 'fixed inset-0 z-50 rounded-none w-screen h-screen border-none' 
                  : 'rounded-xl h-[600px] sm:h-[660px] lg:h-[720px]'
              }`}
            >
              {/* Active Fullscreen Floating Action Bar */}
              {isFullscreen && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-[#161920]/95 backdrop-blur-md border border-[#3b4354] px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-3 text-xs pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-pixel text-[11px] text-emerald-400 font-bold">FULLSCREEN ACTIVE</span>
                    <span className="text-gray-400 hidden sm:inline">|</span>
                    <span className="text-gray-300 font-mono text-[11px] hidden sm:inline">{activeServerUrl}</span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-0.5 rounded bg-[#272d3b] hover:bg-[#343c4f] text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Copy Server URL"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy IP'}</span>
                  </button>

                  <button
                    id="fullscreen-exit-bar-btn"
                    onClick={onToggleFullscreen}
                    className="px-2.5 py-0.5 rounded bg-red-600/90 hover:bg-red-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow cursor-pointer"
                    title="Exit Fullscreen (Esc or F11)"
                  >
                    <Minimize className="w-3.5 h-3.5" />
                    <span>Exit (Esc)</span>
                  </button>
                </div>
              )}

              {/* Floating Canvas Top Overlay Controls (Normal View) */}
              {!isFullscreen && (
                <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    className="px-2.5 py-1.5 rounded-lg bg-[#181b23]/90 hover:bg-[#232733] backdrop-blur-md text-gray-300 hover:text-white border border-[#373e4f] shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Download 100% Offline Game file (.html) - Runs without internet"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">{downloading ? 'Downloading...' : 'Offline .html'}</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1.5 rounded-lg bg-[#181b23]/90 hover:bg-[#232733] backdrop-blur-md text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 shadow-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Copy Active Server URL for Multiplayer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="hidden sm:inline font-mono">{copied ? 'IP Copied!' : 'Copy Server IP'}</span>
                  </button>

                  <button
                    onClick={handleOpenDirect}
                    className="p-1.5 rounded-lg bg-[#181b23]/90 hover:bg-[#232733] backdrop-blur-md text-gray-300 hover:text-white border border-[#373e4f] shadow-lg transition-colors cursor-pointer"
                    title="Open full page in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onReload}
                    className="p-1.5 rounded-lg bg-[#181b23]/90 hover:bg-[#232733] backdrop-blur-md text-gray-300 hover:text-white border border-[#373e4f] shadow-lg transition-colors cursor-pointer"
                    title="Refresh game frame"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    id="viewport-fullscreen-btn"
                    onClick={onToggleFullscreen}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-xl shadow-emerald-950/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Toggle Fullscreen Mode (F11 or Esc)"
                  >
                    <Maximize className="w-4 h-4 text-white" />
                    <span>Fullscreen</span>
                  </button>
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 z-20 bg-[#101217] flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mb-4 animate-pulse">
                    <Sparkles className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="font-pixel text-lg font-bold text-white mb-2 tracking-wide">
                    STARTING EAGLECRAFT
                  </h3>
                  <p className="text-sm text-gray-300 max-w-md mb-4">
                    Loading WebAssembly client engine and WebGL canvas...
                  </p>
                  <div className="w-64 h-2 bg-[#222734] rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-emerald-400 font-mono mb-4">
                    Ready Server URL: <span className="font-bold underline">{activeServerUrl}</span>
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsLoading(false)}
                      className="px-3 py-1.5 rounded-md bg-[#252a38] hover:bg-[#32394c] text-xs font-medium text-gray-200 transition-colors cursor-pointer"
                    >
                      Skip Loading Screen
                    </button>
                    <button
                      onClick={handleOpenDirect}
                      className="px-3 py-1.5 rounded-md bg-emerald-600/80 hover:bg-emerald-600 text-xs font-medium text-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open in Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Pointer Lock Hint */}
              {showHint && !isFullscreen && !isLoading && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-[#151821]/95 backdrop-blur border border-[#394254] px-3.5 py-1.5 rounded-lg text-xs text-gray-300 shadow-xl flex items-center gap-2 pointer-events-auto">
                  <MousePointer className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  <span>Click game to capture mouse. Press <kbd className="px-1.5 py-0.5 bg-[#252b3b] rounded text-[10px] text-white border border-[#454e63]">ESC</kbd> anytime to release.</span>
                  <button 
                    onClick={() => setShowHint(false)}
                    className="ml-2 text-gray-400 hover:text-white text-xs px-1 cursor-pointer"
                    title="Dismiss hint"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* The Actual Minecraft IFrame */}
              <iframe
                id="eaglecraft-game-iframe"
                ref={iframeRef}
                key={`${activeMirror.id}-${reloadKey}`}
                src={activeMirror.url}
                title="Eaglecraft Minecraft Client"
                className="w-full h-full border-none bg-black select-none outline-none block"
                allow="fullscreen; pointer-lock; autoplay; camera; microphone; keyboard-map"
                allowFullScreen={true}
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        )}

        {/* SLIDE 1: 1v1.lol */}
        {currentSlide === 1 && (
          <div className="animate-fadeIn">
            <OneVOneGame
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
            />
          </div>
        )}

        {/* SLIDE 2: Realistic Tetris */}
        {currentSlide === 2 && (
          <div className="animate-fadeIn">
            <RealisticTetris
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
            />

            <section className="mt-5 rounded-2xl border border-[#2e3442] bg-[#10141d] p-4 sm:p-6 shadow-xl">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#293244] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-violet-300">
                    <History className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.18em]">The Story of Tetris</span>
                  </div>
                  <h2 className="mt-2 text-xl sm:text-2xl font-black text-white">From a Soviet computer lab to a worldwide classic</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
                    Tetris is a puzzle game about arranging falling geometric pieces into complete horizontal lines. Its rules are simple, but every move changes the space left for the pieces that come next.
                  </p>
                </div>
                <div className="rounded-xl border border-violet-500/30 bg-violet-950/30 px-3 py-2 text-right">
                  <div className="text-2xl font-black text-violet-300">1984</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">First created</div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-violet-300">1984 · The beginning</div>
                  <h3 className="mt-2 text-sm font-bold text-white">Alexey Pajitnov creates the game</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Computer engineer Alexey Pajitnov built the first version while working at the Soviet Academy of Sciences in Moscow. He designed it for the Electronika 60, a computer with no graphical display, so the early game used text characters to show its pieces.
                  </p>
                </article>

                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-cyan-300">The name</div>
                  <h3 className="mt-2 text-sm font-bold text-white">Tetra plus tennis</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    The word Tetris combines “tetra,” the Greek prefix for four, because every piece is made from four squares, with “tennis,” Pajitnov’s favorite sport. The seven pieces are now commonly known as tetrominoes.
                  </p>
                </article>

                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-amber-300">1985–1988 · Spread worldwide</div>
                  <h3 className="mt-2 text-sm font-bold text-white">From Moscow to personal computers</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Vadim Gerasimov helped bring Tetris to IBM-compatible PCs. Copies traveled through Eastern Europe and then to the West, where publishers and platforms began competing to release their own versions.
                  </p>
                </article>

                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-emerald-300">1989 · The handheld breakthrough</div>
                  <h3 className="mt-2 text-sm font-bold text-white">Tetris becomes a Game Boy phenomenon</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Nintendo bundled Tetris with the original Game Boy in many regions. The handheld version made short puzzle sessions portable and introduced the game to millions of new players around the world.
                  </p>
                </article>

                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-rose-300">1996 · Rights become organized</div>
                  <h3 className="mt-2 text-sm font-bold text-white">The Tetris Company is formed</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Pajitnov and Henk Rogers established The Tetris Company to manage the Tetris brand and licensing. This helped create a consistent identity for official releases across consoles, computers, mobile devices, and other platforms.
                  </p>
                </article>

                <article className="rounded-xl border border-[#2a3448] bg-[#151b27] p-4">
                  <div className="text-xs font-black text-orange-300">Today · Competitive and creative</div>
                  <h3 className="mt-2 text-sm font-bold text-white">One rule, many ways to play</h3>
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    Modern Tetris includes marathon modes, timed challenges, versus battles, tournaments, music-driven experiences, and mobile play. The core loop remains the same: place pieces, clear lines, and survive as the pace increases.
                  </p>
                </article>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-violet-500/30 bg-violet-950/20 p-4">
                  <div className="flex items-center gap-2 text-violet-300">
                    <Target className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-white">What is the goal?</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-300">
                    Complete full rows from left to right. Completed rows disappear, giving you more room and adding points. Clear four rows with one I-piece for the classic “Tetris.”
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Keyboard className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-white">Controls</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-300">
                    Use Left and Right Arrow to move, Up Arrow to rotate, Down Arrow to soft-drop, Space for a hard drop, C to hold a piece, and P to pause. Touch controls are available on smaller screens.
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Lightbulb className="w-4 h-4" />
                    <h3 className="text-sm font-bold text-white">Why it lasts</h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-300">
                    Tetris rewards planning, spatial awareness, rhythm, and fast decisions. The board is easy to understand, but improving your high score always leaves another pattern to master.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SLIDE 3: Cookie Clicker */}
        {currentSlide === 3 && (
          <div className="animate-fadeIn">
            <CookieClickerGame
              isFullscreen={isFullscreen}
              onToggleFullscreen={onToggleFullscreen}
            />
          </div>
        )}

        {/* SLIDE 4: Leaderboard Slide */}
        {currentSlide === 4 && (
          <div className="animate-fadeIn">
            <LeaderboardSlide
              onOpenPaymentModal={onOpenPaymentModal}
              onOpenContactModal={onOpenContactModal}
              onOpenAuthModal={onOpenAuthModal}
            />
          </div>
        )}

        {/* SLIDE 5: Live Chat */}
        {currentSlide === 5 && (
          <div className="animate-fadeIn">
            <ChatSlide />
          </div>
        )}

      </div>

      {/* Bottom Slide Pager Bar with quick dots */}
      <div className="flex items-center justify-center gap-3 pt-1">
        <button
          onClick={prevSlide}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Game</span>
        </button>

        <div className="flex items-center gap-1.5">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-600 hover:bg-gray-400'
              }`}
              title={s.title}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>Next Game</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
