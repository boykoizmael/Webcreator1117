import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  EyeOff, 
  Globe, 
  Check, 
  ExternalLink, 
  Sparkles, 
  AlertTriangle,
  FolderDown,
  Lock,
  Copy,
  Zap,
  GraduationCap,
  BookOpen,
  Link,
  ShieldCheck,
  Play
} from 'lucide-react';
import { TabCloakPreset } from '../types';
import { 
  CLOAK_PRESETS, 
  applyTabCloak, 
  launchAboutBlank, 
  downloadOfflineGame, 
  triggerPanic,
  launchBlobUrl
} from '../utils/stealthUtils';
import { copyToClipboard } from '../utils/gameUtils';

interface SchoolBypassModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCloak: TabCloakPreset;
  onSelectCloak: (preset: TabCloakPreset) => void;
  activeMirrorUrl: string;
  onToggleDecoy?: () => void;
  initialTab?: 'urls' | 'download' | 'aboutblank' | 'cloak' | 'host';
}

export const SchoolBypassModal: React.FC<SchoolBypassModalProps> = ({
  isOpen,
  onClose,
  activeCloak,
  onSelectCloak,
  activeMirrorUrl,
  onToggleDecoy,
  initialTab = 'urls'
}) => {
  const [activeTab, setActiveTab] = useState<'urls' | 'download' | 'aboutblank' | 'cloak' | 'host'>(initialTab);
  const [copiedHost, setCopiedHost] = useState<string | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const stealthLinks = [
    {
      id: 'clever-ultra-long',
      name: 'Ultra-Long Clever & Green River URL (Direct Simulation)',
      path: '/clever-portal/greenriver-college/learning/canvas-lms/courses/edu-1117/fall-quarter-2026/modules/syllabus/student-interactive-lab-simulation.html',
      fullUrl: `${origin}/clever-portal/greenriver-college/learning/canvas-lms/courses/edu-1117/fall-quarter-2026/modules/syllabus/student-interactive-lab-simulation.html`,
      description: 'Ultra-long 160+ character URL packed with Clever, Green River College, learning, canvas, syllabus, and course keywords.'
    },
    {
      id: 'clever-portal-spa',
      name: 'Clever SSO Learning Portal Link',
      path: '/clever/portal/greenriver-college/learning/canvas/course-1117/modules',
      fullUrl: `${origin}/clever/portal/greenriver-college/learning/canvas/course-1117/modules`,
      description: 'Matches the exact URL format used by school Clever single sign-on district portals.'
    },
    {
      id: 'grc-portal',
      name: 'Green River College Academic Portal',
      path: '/greenriver-college/student-portal/course-1117/syllabus',
      fullUrl: `${origin}/greenriver-college/student-portal/course-1117/syllabus`,
      description: 'Pre-cloaked as Green River College Student LMS with Course 1117 syllabus.'
    },
    {
      id: 'direct-stealth',
      name: 'Direct Stealth Portal Frame',
      path: '/greenriver/portal.html',
      fullUrl: `${origin}/greenriver/portal.html`,
      description: 'Direct game client served with "Clever | Green River College" HTML title tag.'
    }
  ];

  const handleDownload = (type: 'syllabus' | 'clever' | 'standard' = 'syllabus') => {
    setDownloadStarted(true);
    if (type === 'syllabus') {
      downloadOfflineGame('/download/GRC-EDU-1117-Syllabus.html', 'GRC-EDU-1117-Syllabus.html');
    } else if (type === 'clever') {
      downloadOfflineGame('/download/Clever-GreenRiver-Course1117-Material.html', 'Clever-GreenRiver-Course1117-Material.html');
    } else {
      downloadOfflineGame('/download-game', 'Eaglecraft-1.8.8-Offline.html');
    }
    setTimeout(() => setDownloadStarted(false), 3500);
  };

  const handleLaunchAboutBlank = () => {
    launchAboutBlank('/greenriver/portal.html', activeCloak);
  };

  const handleCopy = async (text: string, id: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedHost(id);
      setTimeout(() => setCopiedHost(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        id="school-bypass-dialog"
        className="relative w-full max-w-2xl bg-[#151821] border border-[#373e4f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#1b1f2b] border-b border-[#2d3443] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide font-pixel">
                  CLEVER & GREEN RIVER STEALTH HUB
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  COURSE 1117
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Ultra-long learning URLs, Clever & Green River disguise, and obscure non-Google hosts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#282f3e] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-[#2d3443] bg-[#12151c] px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('urls')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'urls'
                ? 'border-emerald-500 text-emerald-400 bg-[#171b24]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>1. Ultra-Long Clever & GRC URLs</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'download'
                ? 'border-emerald-500 text-emerald-400 bg-[#171b24]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>2. Offline Download (Clever/GRC)</span>
          </button>

          <button
            onClick={() => setActiveTab('aboutblank')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'aboutblank'
                ? 'border-emerald-500 text-emerald-400 bg-[#171b24]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>3. About:Blank Cloak</span>
          </button>

          <button
            onClick={() => setActiveTab('cloak')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cloak'
                ? 'border-emerald-500 text-emerald-400 bg-[#171b24]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>4. Tab Cloaker & Panic</span>
          </button>

          <button
            onClick={() => setActiveTab('host')}
            className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'host'
                ? 'border-emerald-500 text-emerald-400 bg-[#171b24]'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>5. Obscure Non-Google Hosts</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ULTRA-LONG CLEVER & GREEN RIVER URLS */}
          {activeTab === 'urls' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-4 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    Ultra-Long Learning Disguise URLs (Clever & Green River College)
                  </h3>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    These URLs are intentionally long and packed with academic keywords (<strong className="text-white">Clever</strong>, <strong className="text-white">Green River College</strong>, <strong className="text-white">Canvas LMS</strong>, <strong className="text-white">Course 1117</strong>, <strong className="text-white">Syllabus</strong>). Content filters and teachers inspecting the address bar will only see legitimate educational course routes.
                  </p>
                </div>
              </div>

              {/* URL List */}
              <div className="space-y-3">
                {stealthLinks.map(link => (
                  <div key={link.id} className="bg-[#1a1e28] border border-[#2e3544] rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-xs font-bold text-white">{link.name}</span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#282f3d] text-emerald-300 px-2 py-0.5 rounded">
                        Stealth Path
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{link.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <input 
                        type="text" 
                        readOnly 
                        value={link.fullUrl}
                        className="flex-1 bg-[#101217] border border-[#343c4f] rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-300 truncate outline-none select-all"
                      />
                      <button
                        onClick={() => handleCopy(link.fullUrl, link.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedHost === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHost === link.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decoy Mode Banner */}
              {onToggleDecoy && (
                <div className="bg-[#181d27] border border-[#323a4a] rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Interactive Green River College Canvas Decoy Screen</span>
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Flips the screen to a realistic Canvas LMS course page with syllabus, assignments, and a discreet launch button.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onToggleDecoy();
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#273042] hover:bg-[#344059] border border-[#404c63] text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
                  >
                    View Decoy Mode
                  </button>
                </div>
              )}

              {/* URL Shortener / Masker */}
              <div className="bg-[#12151c] border border-[#2b313f] rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mask Behind a Custom Domain (10 Seconds)</span>
                </h4>
                <p className="text-xs text-gray-400">
                  Mask the whole link with an innocent alias like <strong className="text-emerald-300">tinyurl.com/greenriver-clever-1117</strong>:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a 
                    href={`https://tinyurl.com/create.php?url=${encodeURIComponent(stealthLinks[0].fullUrl)}&alias=greenriver-clever-1117`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2c3447] text-xs text-emerald-300 border border-[#3b455b] flex items-center gap-1.5"
                  >
                    <span>Create TinyURL (tinyurl.com/greenriver-clever-1117)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href={`https://is.gd/create.php?format=simple&url=${encodeURIComponent(stealthLinks[0].fullUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2c3447] text-xs text-gray-300 hover:text-white border border-[#3b455b] flex items-center gap-1.5"
                  >
                    <span>Create is.gd Alias</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOWNLOAD OFFLINE HTML */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-start gap-3">
                <FolderDown className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">
                    100% Offline Single-File HTML (Zero Host / Zero Block Risk)
                  </h3>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Because this file runs locally under <code className="bg-emerald-950/80 px-1 py-0.5 rounded text-white font-mono">file:///</code> on your computer, <strong className="text-white">NO Google host, NO web server, and NO domain exists</strong>. Clever, GoGuardian, and Securly cannot block local files!
                  </p>
                </div>
              </div>

              {/* Download Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Clever Academic Name */}
                <div className="bg-[#1a1e28] border-2 border-emerald-500/50 rounded-xl p-4 flex flex-col justify-between gap-3 shadow-lg">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Clever Disguise
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">Clever-GreenRiver-Course1117-Material.html</h4>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Saved under Clever district learning title. Completely invisible to school file inspectors.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload('clever')}
                    className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                  >
                    {downloadStarted ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{downloadStarted ? 'Downloading...' : 'Download Clever Material'}</span>
                  </button>
                </div>

                {/* GRC Syllabus Name */}
                <div className="bg-[#1a1e28] border border-[#2f3647] rounded-xl p-4 flex flex-col justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        College Syllabus
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">GRC-EDU-1117-Syllabus.html</h4>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Disguised as Green River College Course 1117 syllabus file.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload('syllabus')}
                    className="w-full py-2.5 rounded-lg bg-[#2b3242] hover:bg-[#384257] text-gray-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-[#3e485e] cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download GRC Syllabus HTML</span>
                  </button>
                </div>
              </div>

              {/* How to Run */}
              <div className="bg-[#111319] border border-[#272d3b] rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  How to Play Locally on Chromebook / PC
                </h4>
                <ol className="space-y-1.5 text-xs text-gray-300 list-decimal list-inside leading-relaxed">
                  <li>Download one of the files above to your Downloads or a USB flash drive.</li>
                  <li>In Google Chrome, press <kbd className="px-1.5 py-0.5 bg-[#202533] rounded text-white border border-[#333b4f]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-[#202533] rounded text-white border border-[#333b4f]">O</kbd>.</li>
                  <li>Select the downloaded file. It boots immediately with full Singleplayer and Multiplayer!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT:BLANK CLOAK */}
          {activeTab === 'aboutblank' && (
            <div className="space-y-4">
              <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">About:Blank Cloaking</h3>
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    Launches the game in a new tab where the URL bar literally shows <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono">about:blank</code>.
                    URL filters (GoGuardian, Securly, Clover extensions) cannot inspect the URL because there is NO domain in the address bar!
                  </p>
                </div>
              </div>

              <div className="bg-[#181b24] border border-[#2f3647] rounded-xl p-5 text-center space-y-3">
                <h4 className="text-sm font-bold text-white">Launch About:Blank Tab</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  The tab will be disguised as <strong className="text-white">"{activeCloak.title}"</strong> with the official Clever / Green River College icon.
                </p>

                <button
                  onClick={handleLaunchAboutBlank}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer flex items-center gap-2 mx-auto"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Launch in About:Blank Tab Now</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: TAB CLOAKER & PANIC */}
          {activeTab === 'cloak' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Choose Tab Disguise</h3>
                  <p className="text-xs text-gray-400">Select which title and favicon your browser tab displays</p>
                </div>
                <div className="text-xs bg-[#1f2430] border border-[#333c4f] px-2.5 py-1 rounded-lg text-emerald-300 font-medium">
                  Active: <span className="text-white font-bold">{activeCloak.name}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CLOAK_PRESETS.map((preset) => {
                  const isSelected = activeCloak.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectCloak(preset);
                        applyTabCloak(preset);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                          : 'bg-[#181c25] hover:bg-[#202532] border-[#2c3343]'
                      }`}
                    >
                      <img 
                        src={preset.icon} 
                        alt={preset.name} 
                        className="w-5 h-5 rounded shrink-0 mt-0.5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-300' : 'text-white'}`}>
                            {preset.name}
                          </span>
                          {preset.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              {preset.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{preset.title}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Emergency Panic Key Box */}
              <div className="bg-[#1a1315] border border-red-900/40 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Emergency Panic Hotkey Configured</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Press <kbd className="px-1.5 py-0.5 bg-red-950 text-red-300 rounded font-mono text-xs border border-red-800">\</kbd> (backslash) on your keyboard anytime to immediately fling this tab to Clever / Google Classroom.
                  </p>
                </div>
                <button
                  onClick={() => triggerPanic('https://clever.com')}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shrink-0 cursor-pointer shadow transition-colors"
                >
                  Test Panic
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: OBSCURE NON-GOOGLE HOSTS */}
          {activeTab === 'host' && (
            <div className="space-y-4">
              {/* Important Explanation */}
              <div className="bg-blue-950/40 border border-blue-500/40 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Why this preview uses `run.app` & How to completely remove Google</span>
                </div>
                <p className="text-xs text-blue-200/90 leading-relaxed">
                  The current preview container is hosted by Google AI Studio on Google Cloud Run (<code className="bg-blue-950 px-1 py-0.5 rounded text-white font-mono">*.run.app</code>). Google's cloud infrastructure automatically assigns this domain. 
                </p>
                <p className="text-xs text-blue-200/90 leading-relaxed font-semibold">
                  If your school blocks Google Cloud / Google AI Studio, choose one of the 100% Non-Google options below:
                </p>
              </div>

              <div className="space-y-3">
                {/* 0. Dedicated Cloudflare Live Tunnel (Zero Google Servers) */}
                <div className="bg-gradient-to-r from-blue-950/60 to-purple-950/50 border-2 border-blue-400/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Dedicated Non-Google Cloudflare Edge URL (Active Now)</span>
                    </h4>
                    <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                      Zero Google DNS / Servers
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    This URL runs entirely on Cloudflare edge servers (<code className="text-blue-300 font-mono">trycloudflare.com</code>) with no Google Cloud domain or branding. No school filter has this URL on any blocklist:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="bg-[#10131c] p-3 rounded-lg border border-[#2b3343] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-400">Green River College & Clever Disguised Simulation:</span>
                        <button
                          onClick={() => {
                            copyToClipboard('https://search-shaped-forward-garden.trycloudflare.com/clever-portal/greenriver-college/learning/canvas-lms/courses/edu-1117/fall-quarter-2026/modules/syllabus/student-interactive-lab-simulation.html');
                            setCopiedHost('cf-greenriver');
                            setTimeout(() => setCopiedHost(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-[#232a39] hover:bg-[#2e374a] text-gray-200 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedHost === 'cf-greenriver' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedHost === 'cf-greenriver' ? 'Copied!' : 'Copy Link'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-blue-200 font-mono break-all select-all bg-[#0b0d13] p-2 rounded border border-[#1b2230]">
                        https://search-shaped-forward-garden.trycloudflare.com/clever-portal/greenriver-college/learning/canvas-lms/courses/edu-1117/fall-quarter-2026/modules/syllabus/student-interactive-lab-simulation.html
                      </div>
                      <div className="flex gap-2 pt-1">
                        <a
                          href="https://search-shaped-forward-garden.trycloudflare.com/clever-portal/greenriver-college/learning/canvas-lms/courses/edu-1117/fall-quarter-2026/modules/syllabus/student-interactive-lab-simulation.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Disguised Link</span>
                        </a>
                        <a
                          href="https://search-shaped-forward-garden.trycloudflare.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-md bg-[#232a39] hover:bg-[#2f394d] text-gray-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Root Home</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Live Non-Google Community Web Hosts */}
                <div className="bg-[#181c26] border border-[#2f3747] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ready-to-Play Non-Google Web Hosts (Active Right Now)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      No Google Servers
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    These are verified web hosts running Eaglercraft on independent servers with zero Google involvement:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-[#12141c] p-2.5 rounded-lg border border-[#272f3d]">
                      <div>
                        <div className="text-xs font-bold text-white">GitHub Pages Community Mirror</div>
                        <div className="text-[11px] text-gray-400">Hosted by GitHub & Fastly CDN (not Google)</div>
                      </div>
                      <a
                        href="https://eaglercraft1-8.github.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>Open Host</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between bg-[#12141c] p-2.5 rounded-lg border border-[#272f3d]">
                      <div>
                        <div className="text-xs font-bold text-white">Deev.is Independent Host</div>
                        <div className="text-[11px] text-gray-400">Hosted on private European infrastructure (not Google)</div>
                      </div>
                      <a
                        href="https://g.deev.is/eaglercraft/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md bg-[#2d3545] hover:bg-[#3b465c] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>Open Host</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="flex items-center justify-between bg-[#12141c] p-2.5 rounded-lg border border-[#272f3d]">
                      <div>
                        <div className="text-xs font-bold text-white">q13x High-Speed WASM Engine</div>
                        <div className="text-[11px] text-gray-400">Hosted on independent non-cloud servers</div>
                      </div>
                      <a
                        href="https://eaglercraft.q13x.com/1.8.8/wasm/?retina=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-md bg-[#2d3545] hover:bg-[#3b465c] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <span>Open Host</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. In-Memory Blob Launcher */}
                <div className="bg-[#181c26] border border-[#2f3747] rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Launch In-Memory Blob URL (Hides Server Domain in URL)</span>
                    </h4>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded font-mono">
                      In-Browser RAM
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Streams the entire game client into the browser's temporary memory so the address bar reads <code className="text-amber-300">blob:...</code> without loading page assets from Google.
                  </p>
                  <button
                    onClick={() => launchBlobUrl(activeCloak)}
                    className="w-full py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Launch Game as In-Memory Blob Now</span>
                  </button>
                </div>

                {/* 3. Host Your Own on Cloudflare Pages */}
                <div className="bg-[#13161f] border border-[#2b3242] rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cloudflare Pages (Never Blocked & 100% Free)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Because school districts use Cloudflare for DNS, <code className="text-gray-300">pages.dev</code> is almost never blocked:
                  </p>
                  <ol className="text-xs text-gray-300 list-decimal list-inside space-y-1">
                    <li>Download the offline HTML file from Tab 2.</li>
                    <li>Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">dash.cloudflare.com</a> &rarr; Workers & Pages &rarr; Upload assets.</li>
                    <li>Choose your name: <code className="text-emerald-300 font-bold">greenriver-clever-1117</code> (becomes <code className="text-white">greenriver-clever-1117.pages.dev</code>).</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#12141a] border-t border-[#252b38] flex items-center justify-between text-xs text-gray-400">
          <span>Emergency Panic Key: <kbd className="px-1.5 py-0.5 bg-[#1e2330] rounded text-white font-mono border border-[#333b4e] font-bold">\</kbd></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#222836] hover:bg-[#2e374a] text-gray-200 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
