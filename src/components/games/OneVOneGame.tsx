import React, { useState } from 'react';
import { 
  Maximize, 
  RefreshCw, 
  ExternalLink, 
  Gamepad2, 
  Sparkles, 
  Shield, 
  Crosshair, 
  Zap, 
  Layers
} from 'lucide-react';

interface OneVOneGameProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MIRRORS = [
  { id: 'primary', name: '1v1lol.me', url: 'https://1v1lol.me/' },
  { id: 'www', name: '1v1lol.me (WWW)', url: 'https://www.1v1lol.me/' }
];

export const OneVOneGame: React.FC<OneVOneGameProps> = ({
  isFullscreen,
  onToggleFullscreen
}) => {
  const [activeMirror, setActiveMirror] = useState(MIRRORS[0]);
  const [key, setKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveMirror = MIRRORS.find(m => m.url === activeMirror.url) || MIRRORS[0];

  const handleReload = () => {
    setIsLoading(true);
    setKey(prev => prev + 1);
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleOpenDirect = () => {
    window.open(effectiveMirror.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col h-full space-y-3">
      {/* Top Bar for 1v1.lol */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center font-bold">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">1v1.lol</span>
            <span className="text-gray-400 text-[11px] ml-1.5 hidden sm:inline">
              Fast duel arena • build, shoot, repeat
            </span>
          </div>
        </div>

        {/* Mirror Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Mirror:</span>
          {MIRRORS.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMirror(m);
                handleReload();
              }}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                effectiveMirror.id === m.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-300 border border-[#2d364c]'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReload}
            className="p-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-300 hover:text-white rounded-lg border border-[#2d364c] cursor-pointer transition-colors"
            title="Reload 1v1.lol"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleOpenDirect}
            className="px-2.5 py-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-200 hover:text-white rounded-lg border border-[#2d364c] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Popout</span>
          </button>
          <button
            onClick={onToggleFullscreen}
            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors shadow"
            title="Fullscreen mode"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Game Stage */}
      <div className={`relative w-full bg-[#0c0e14] overflow-hidden shadow-2xl ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0' : 'aspect-video min-h-[500px] lg:min-h-[640px] rounded-2xl border-2 border-[#242b3d]'}`}>
        <iframe
          key={key}
          src={effectiveMirror.url}
          className="w-full h-full border-0"
          title="1v1.lol Game"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation"
          onLoad={() => setIsLoading(false)}
        />

        {/* Fallback & Controls hint overlay at bottom */}
        <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-black/75 backdrop-blur-sm border border-white/10 text-[11px] text-gray-300 pointer-events-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-red-400">Controls:</span>
            <span>WASD = Move</span>
            <span>•</span>
            <span>Left Click = Shoot</span>
            <span>•</span>
            <span>Right Click = Build</span>
            <span>•</span>
            <span>Space = Jump</span>
            <span>•</span>
            <span>Shift = Sprint</span>
          </div>

          <button
            onClick={handleOpenDirect}
            className="text-red-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer underline"
          >
            <span>Open in raw window</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="bg-[#121821] border border-[#2b3344] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-red-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">1v1.lol experience</span>
          </div>

          <h3 className="text-2xl font-black text-white tracking-tight">Build fast, duel faster, win instantly.</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Jump straight into quick 1v1 battles with instant rematches, fast build fights, and a simple arena flow designed for short, intense rounds.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-xl bg-[#181f2a] border border-[#2a3548] p-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Mode</div>
              <div className="font-bold text-white">1v1 Duels</div>
            </div>
            <div className="rounded-xl bg-[#181f2a] border border-[#2a3548] p-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Style</div>
              <div className="font-bold text-white">Build + Shoot</div>
            </div>
            <div className="rounded-xl bg-[#181f2a] border border-[#2a3548] p-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Flow</div>
              <div className="font-bold text-white">Instant Rematch</div>
            </div>
          </div>
        </div>

        <div className="bg-[#111722] border border-[#2b3344] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-300">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Quick controls</span>
          </div>

          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex justify-between gap-3"><span>Move</span><span className="font-mono text-emerald-300">WASD</span></li>
            <li className="flex justify-between gap-3"><span>Jump</span><span className="font-mono text-emerald-300">Space</span></li>
            <li className="flex justify-between gap-3"><span>Shoot</span><span className="font-mono text-emerald-300">Left Click</span></li>
            <li className="flex justify-between gap-3"><span>Build</span><span className="font-mono text-emerald-300">Right Click</span></li>
            <li className="flex justify-between gap-3"><span>Switch tools</span><span className="font-mono text-emerald-300">1-5</span></li>
            <li className="flex justify-between gap-3"><span>Run</span><span className="font-mono text-emerald-300">Shift</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
