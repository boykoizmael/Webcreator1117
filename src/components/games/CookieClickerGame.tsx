import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Maximize, 
  Volume2, 
  VolumeX, 
  Trophy, 
  Zap, 
  TrendingUp, 
  Flame,
  Award,
  Check
} from 'lucide-react';
import { updateLeaderboardScore } from '../../utils/accountManager';

interface CookieClickerGameProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

interface Building {
  id: string;
  name: string;
  baseCost: number;
  cps: number;
  count: number;
  icon: string;
  desc: string;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const CookieClickerGame: React.FC<CookieClickerGameProps> = ({
  isFullscreen,
  onToggleFullscreen
}) => {
  // Load saved state or default
  const [cookies, setCookies] = useState<number>(() => {
    try {
      return parseFloat(localStorage.getItem('cc_cookies') || '0');
    } catch {
      return 0;
    }
  });

  const [totalBaked, setTotalBaked] = useState<number>(() => {
    try {
      return parseFloat(localStorage.getItem('cc_total_baked') || '0');
    } catch {
      return 0;
    }
  });

  const [clickCount, setClickCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('cc_clicks') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [buildings, setBuildings] = useState<Building[]>(() => {
    const defaultBuildings: Building[] = [
      { id: 'cursor', name: 'Cursor', baseCost: 15, cps: 0.1, count: 0, icon: '👆', desc: 'Autoclicks once every 10 seconds' },
      { id: 'grandma', name: 'Grandma', baseCost: 100, cps: 1, count: 0, icon: '👵', desc: 'A nice grandma to bake more cookies' },
      { id: 'farm', name: 'Farm', baseCost: 1100, cps: 8, count: 0, icon: '🌾', desc: 'Grows cookie plants from cookie seeds' },
      { id: 'mine', name: 'Mine', baseCost: 12000, cps: 47, count: 0, icon: '⛏️', desc: 'Mines out cookie dough and chocolate chips' },
      { id: 'factory', name: 'Factory', baseCost: 130000, cps: 260, count: 0, icon: '🏭', desc: 'Produces massive amounts of cookies' },
      { id: 'bank', name: 'Bank', baseCost: 1400000, cps: 1400, count: 0, icon: '🏦', desc: 'Generates cookies from financial interest' },
      { id: 'temple', name: 'Temple', baseCost: 20000000, cps: 7800, count: 0, icon: '🏛️', desc: 'Dedicated to the ancient gods of chocolate' },
      { id: 'wizard', name: 'Wizard Tower', baseCost: 330000000, cps: 44000, count: 0, icon: '🧙‍♂️', desc: 'Summons cookies with arcane magic' }
    ];

    try {
      const saved = localStorage.getItem('cc_buildings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return defaultBuildings.map(b => {
          const match = parsed.find((p: { id: string; count: number }) => p.id === b.id);
          return match ? { ...b, count: match.count } : b;
        });
      }
    } catch {}
    return defaultBuildings;
  });

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [goldenCookie, setGoldenCookie] = useState<{ x: number; y: number; active: boolean } | null>(null);
  const [frenzyMultiplier, setFrenzyMultiplier] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCookiePressed, setIsCookiePressed] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play synthesized audio blips
  const playSfx = useCallback((type: 'click' | 'buy' | 'golden') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'buy') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.06);
        osc.frequency.setValueAtTime(783.99, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'golden') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.setValueAtTime(880, now + 0.1);
        osc.frequency.setValueAtTime(1174.66, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {}
  }, [soundEnabled]);

  // Calculate total CPS
  const totalCps = buildings.reduce((sum, b) => sum + b.count * b.cps, 0) * frenzyMultiplier;

  // Calculate current cost of building (cost = base * 1.15^count)
  const getCost = (b: Building) => {
    return Math.floor(b.baseCost * Math.pow(1.15, b.count));
  };

  // Click Big Cookie
  const handleCookieClick = (e: React.MouseEvent<HTMLDivElement>) => {
    playSfx('click');
    setIsCookiePressed(true);
    setTimeout(() => setIsCookiePressed(false), 100);

    const clickPower = (1 + buildings.find(b => b.id === 'cursor')!.count * 0.1) * frenzyMultiplier;
    setCookies(prev => prev + clickPower);
    setTotalBaked(prev => prev + clickPower);
    setClickCount(prev => prev + 1);

    // Spawn floating number
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev.slice(-10), { id, text: `+${Math.round(clickPower)}`, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  // Buy building
  const handleBuy = (b: Building) => {
    const cost = getCost(b);
    if (cookies >= cost) {
      playSfx('buy');
      setCookies(prev => prev - cost);
      setBuildings(prev =>
        prev.map(item => (item.id === b.id ? { ...item, count: item.count + 1 } : item))
      );
    }
  };

  // Golden Cookie Click
  const handleGoldenClick = () => {
    playSfx('golden');
    const bonus = Math.max(13, Math.floor(cookies * 0.15) + 77);
    setCookies(prev => prev + bonus);
    setTotalBaked(prev => prev + bonus);
    setFrenzyMultiplier(7);
    setGoldenCookie(null);

    // Frenzy lasts 20 seconds
    setTimeout(() => {
      setFrenzyMultiplier(1);
    }, 20000);
  };

  // Passive CPS loop (runs every 100ms for smooth counter)
  useEffect(() => {
    const interval = setInterval(() => {
      if (totalCps > 0) {
        const increment = totalCps / 10;
        setCookies(prev => prev + increment);
        setTotalBaked(prev => prev + increment);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [totalCps]);

  // Periodic Golden Cookie spawner (every ~60-90 seconds)
  useEffect(() => {
    const spawner = setInterval(() => {
      if (!goldenCookie && Math.random() < 0.6) {
        setGoldenCookie({
          x: Math.floor(Math.random() * 70) + 15,
          y: Math.floor(Math.random() * 60) + 20,
          active: true
        });

        // Disappears after 15 seconds if not clicked
        setTimeout(() => {
          setGoldenCookie(null);
        }, 15000);
      }
    }, 45000);

    return () => clearInterval(spawner);
  }, [goldenCookie]);

  // Auto-save to LocalStorage every 5 seconds
  useEffect(() => {
    const saver = setInterval(() => {
      try {
        localStorage.setItem('cc_cookies', cookies.toString());
        localStorage.setItem('cc_total_baked', totalBaked.toString());
        localStorage.setItem('cc_clicks', clickCount.toString());
        updateLeaderboardScore('cookieClicks', clickCount);
        localStorage.setItem(
          'cc_buildings',
          JSON.stringify(buildings.map(b => ({ id: b.id, count: b.count })))
        );
      } catch {}
    }, 5000);

    return () => clearInterval(saver);
  }, [buildings, clickCount, cookies, totalBaked]);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your Cookie Clicker progress?')) {
      setCookies(0);
      setTotalBaked(0);
      setClickCount(0);
      setBuildings(prev => prev.map(b => ({ ...b, count: 0 })));
      try {
        localStorage.removeItem('cc_cookies');
        localStorage.removeItem('cc_total_baked');
        localStorage.removeItem('cc_clicks');
        localStorage.removeItem('cc_buildings');
      } catch {}
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + ' Trillion';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' Billion';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' Million';
    if (num >= 1e3) return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="w-full flex flex-col h-full space-y-3 select-none">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
            🍪
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">Cookie Clicker Classic</span>
            <span className="text-gray-400 text-[11px] ml-1.5 hidden sm:inline">
              Autoclickers, grandmas, factories & golden cookies
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {frenzyMultiplier > 1 && (
            <span className="px-2 py-1 rounded bg-amber-500 text-black font-black text-xs animate-pulse flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>7x FRENZY ACTIVE!</span>
            </span>
          )}

          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            className="p-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-300 hover:text-white rounded-lg border border-[#2d364c] cursor-pointer"
            title={soundEnabled ? 'Mute' : 'Sound On'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          <button
            onClick={handleReset}
            className="px-2.5 py-1.5 bg-[#1b1f2b] hover:bg-[#252b3c] text-gray-300 rounded-lg border border-[#2d364c] font-semibold flex items-center gap-1 cursor-pointer"
            title="Reset Game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={onToggleFullscreen}
            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-1 cursor-pointer shadow"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>
        </div>
      </div>

      {/* Main Cookie Bakery Stage */}
      <div className={`relative w-full bg-[#0c0e15] overflow-hidden shadow-2xl flex flex-col md:flex-row ${isFullscreen ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0' : 'aspect-video min-h-[520px] lg:min-h-[640px] rounded-2xl border-2 border-[#262c3e]'}`}>
        
        {/* Left Side: Big Giant Cookie & Stats */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-gradient-to-b from-[#111522] to-[#0a0c13] border-b md:border-b-0 md:border-r border-[#1f2536]">
          
          {/* Cookie Count Display */}
          <div className="text-center mb-6 z-10">
            <div className="text-3xl lg:text-4xl font-black text-amber-400 tracking-tight drop-shadow-md">
              {formatNumber(cookies)}
            </div>
            <div className="text-xs text-amber-200/80 font-bold uppercase tracking-wider">
              cookies
            </div>
            <div className="text-xs font-semibold text-gray-400 mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>per second: <strong className="text-white">{totalCps.toFixed(1)}</strong></span>
            </div>
          </div>

          {/* Big Cookie Button */}
          <div
            onClick={handleCookieClick}
            className={`relative w-48 h-48 lg:w-60 lg:h-60 rounded-full cursor-pointer transition-transform duration-75 select-none flex items-center justify-center shadow-2xl shadow-amber-950/60 group ${
              isCookiePressed ? 'scale-90' : 'hover:scale-105 active:scale-95'
            }`}
          >
            {/* Outer Glow */}
            <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all" />

            {/* Custom Styled Realistic Cookie Disc */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#78350f] border-4 border-[#f59e0b]/50 shadow-inner relative overflow-hidden flex items-center justify-center">
              {/* Chocolate chips pattern */}
              <div className="absolute top-8 left-12 w-6 h-6 rounded-full bg-[#381e0e] shadow-sm transform rotate-12" />
              <div className="absolute top-14 right-14 w-7 h-7 rounded-full bg-[#381e0e] shadow-sm transform -rotate-45" />
              <div className="absolute bottom-10 left-16 w-8 h-8 rounded-full bg-[#381e0e] shadow-sm" />
              <div className="absolute bottom-16 right-12 w-6 h-6 rounded-full bg-[#381e0e] shadow-sm" />
              <div className="absolute top-24 left-24 w-7 h-7 rounded-full bg-[#381e0e] shadow-sm" />
              <div className="absolute top-28 right-28 w-5 h-5 rounded-full bg-[#381e0e] shadow-sm" />

              {/* Surface Texture Cracks */}
              <div className="absolute inset-2 rounded-full border border-amber-300/10 pointer-events-none" />
              <span className="text-4xl opacity-20 filter invert">🍪</span>
            </div>

            {/* Floating Numbers on click */}
            {floatingTexts.map(t => (
              <div
                key={t.id}
                style={{ left: t.x, top: t.y }}
                className="absolute pointer-events-none font-black text-amber-300 text-lg drop-shadow-md animate-floatUp"
              >
                {t.text}
              </div>
            ))}
          </div>

          {/* Golden Cookie Surprise */}
          {goldenCookie && (
            <button
              onClick={handleGoldenClick}
              style={{ left: `${goldenCookie.x}%`, top: `${goldenCookie.y}%` }}
              className="absolute z-30 p-2 rounded-full bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-100 shadow-xl shadow-yellow-500/50 cursor-pointer animate-bounce hover:scale-125 transition-transform"
              title="Click the Golden Cookie for Frenzy!"
            >
              <span className="text-3xl">✨🍪✨</span>
            </button>
          )}

          {/* Bottom Quick Stats */}
          <div className="mt-8 flex items-center gap-6 text-xs text-gray-400 z-10">
            <div>Clicks: <strong className="text-white">{clickCount.toLocaleString()}</strong></div>
            <div>•</div>
            <div>All-Time Baked: <strong className="text-white">{formatNumber(totalBaked)}</strong></div>
          </div>
        </div>

        {/* Right Side: Buildings Shop */}
        <div className="w-full md:w-80 lg:w-96 bg-[#0e111a] p-4 flex flex-col border-t md:border-t-0 md:border-l border-[#1f2536] overflow-hidden">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1c2233]">
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Buildings & Upgrades</span>
            </span>
            <span className="text-[11px] text-gray-400">Store</span>
          </div>

          {/* Building List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {buildings.map(b => {
              const cost = getCost(b);
              const canAfford = cookies >= cost;

              return (
                <button
                  key={b.id}
                  onClick={() => handleBuy(b)}
                  disabled={!canAfford}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    canAfford
                      ? 'bg-[#151926] hover:bg-[#1c2234] border-[#293248] text-white shadow-sm'
                      : 'bg-[#0f1118]/80 border-[#1a1e2b] text-gray-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span className={canAfford ? 'text-white' : 'text-gray-400'}>{b.name}</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        +{b.cps * b.count > 0 ? (b.cps * b.count).toFixed(1) : b.cps} CPS
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs font-bold font-mono ${canAfford ? 'text-amber-400' : 'text-gray-500'}`}>
                      🍪 {formatNumber(cost)}
                    </div>
                    <div className="text-[10px] font-black text-amber-300/80">
                      Owned: {b.count}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
