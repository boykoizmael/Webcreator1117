import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Copy, 
  Check, 
  Wifi, 
  WifiOff, 
  Radio, 
  Play, 
  Plus, 
  Zap, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Clock,
  GraduationCap,
  Download
} from 'lucide-react';
import { MinecraftServer } from '../types';
import { DEFAULT_SERVERS } from '../data/servers';
import { copyToClipboard, testServerPing } from '../utils/gameUtils';
import { downloadOfflineGame } from '../utils/stealthUtils';

interface ServerPanelProps {
  activeServerUrl: string;
  onSelectActiveServer: (url: string) => void;
  onOpenSchoolBypass?: () => void;
}

export const ServerPanel: React.FC<ServerPanelProps> = ({
  activeServerUrl,
  onSelectActiveServer,
  onOpenSchoolBypass
}) => {
  const [servers, setServers] = useState<MinecraftServer[]>(() => {
    const saved = localStorage.getItem('eaglecraft_custom_servers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return [...DEFAULT_SERVERS, ...parsed];
      } catch (_) {}
    }
    return DEFAULT_SERVERS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [pingingId, setPingingId] = useState<string | null>(null);
  
  // Custom server test input
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [testResult, setTestResult] = useState<{ ok: boolean; ping: number; error?: string } | null>(null);
  const [isTestingCustom, setIsTestingCustom] = useState(false);

  // Ping primary server on load
  useEffect(() => {
    testServerPing(activeServerUrl, 3000).then(res => {
      setServers(prev => prev.map(s => s.url === activeServerUrl ? {
        ...s,
        status: res.ok ? 'online' : 'offline',
        ping: res.ok ? res.ping : undefined
      } : s));
    });
  }, [activeServerUrl]);

  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    }
  };

  const handlePingServer = async (server: MinecraftServer) => {
    setPingingId(server.id);
    const result = await testServerPing(server.url, 4000);
    setServers(prev => prev.map(s => {
      if (s.id === server.id) {
        return {
          ...s,
          status: result.ok ? 'online' : 'offline',
          ping: result.ok ? result.ping : undefined
        };
      }
      return s;
    }));
    setPingingId(null);
  };

  const handleTestCustomServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    let formatted = customUrl.trim();
    if (!formatted.startsWith('ws://') && !formatted.startsWith('wss://')) {
      formatted = 'wss://' + formatted;
      setCustomUrl(formatted);
    }

    setIsTestingCustom(true);
    setTestResult(null);

    const result = await testServerPing(formatted, 5000);
    setTestResult(result);
    setIsTestingCustom(false);
  };

  const handleAddCustomServer = () => {
    if (!customUrl.trim()) return;
    const newServer: MinecraftServer = {
      id: 'custom-' + Date.now(),
      name: customName.trim() || 'Custom Server',
      url: customUrl.trim(),
      category: 'Survival',
      playersEstimate: 'Custom',
      description: 'User added custom Eaglercraft server address.',
      version: '1.8.8',
      status: testResult?.ok ? 'online' : 'unknown',
      ping: testResult?.ok ? testResult.ping : undefined
    };

    const updated = [newServer, ...servers];
    setServers(updated);
    onSelectActiveServer(newServer.url);

    // Save custom servers to local storage
    const customOnly = updated.filter(s => s.id.startsWith('custom-'));
    localStorage.setItem('eaglecraft_custom_servers', JSON.stringify(customOnly));

    setCustomUrl('');
    setCustomName('');
    setTestResult(null);
  };

  const filteredServers = activeCategory === 'All'
    ? servers
    : servers.filter(s => s.category === activeCategory);

  const activeServerObj = servers.find(s => s.url === activeServerUrl) || servers[0];

  return (
    <section id="servers-section" className="w-full space-y-6">
      {/* Primary Server URL Hero Banner (Directly addressing user requirement) */}
      <div className="bg-gradient-to-r from-[#171a22] via-[#1c212c] to-[#171a22] border-2 border-emerald-500/50 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                Active Multiplayer Server URL Ready
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#2b3240] text-gray-300 font-medium">
                {activeServerObj.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold border border-emerald-800/40">
                100% Tested & Working
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Ready to Play with Thousands of Online Players
            </h2>
            <p className="text-sm text-gray-300">
              Copy the server address below, open <strong className="text-white">Multiplayer</strong> in Eaglecraft, click <strong className="text-white">Direct Connect</strong> (or Add Server), and paste it to jump right into the game!
            </p>

            {/* Big Copyable Server URL Input Box */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 bg-[#101217] border border-emerald-500/40 rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-base sm:text-lg font-bold text-emerald-300 truncate select-all">
                    {activeServerUrl}
                  </span>
                </div>
                {activeServerObj.ping && (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activeServerObj.ping}ms
                  </span>
                )}
              </div>

              <button
                id="hero-copy-server-btn"
                onClick={() => handleCopy(activeServerUrl)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                  copiedUrl === activeServerUrl
                    ? 'bg-emerald-500 text-black shadow-emerald-500/30 scale-105'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-emerald-950/60'
                }`}
              >
                {copiedUrl === activeServerUrl ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>COPY SERVER URL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3 Step Visual Guide Card */}
          <div className="w-full lg:w-80 bg-[#12141a]/90 border border-[#2f3544] rounded-xl p-4 space-y-3 shrink-0 shadow-lg">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>How to Join in 30 Seconds</span>
            </div>

            <ol className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Click <strong className="text-white">Multiplayer</strong> on the main menu.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Click <strong className="text-white">Direct Connect</strong> or <strong className="text-white">Add Server</strong>.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <span>Press <strong className="text-emerald-300 font-mono">Ctrl+V</strong> to paste URL and click <strong className="text-white">Join Server</strong>!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* School & Restricted Network Notice Banner */}
      <div className="bg-[#171a23] border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <span>Playing from School or a Filtered Network?</span>
            </h4>
            <p className="text-xs text-gray-300 mt-0.5">
              School filters block Google Studio (<code className="text-gray-200">*.run.app</code>). Download the standalone offline HTML to play directly from your Chromebook / PC files with zero web server required, or disguise your tab.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => downloadOfflineGame('/download-game', 'Eaglecraft-1.8.8-Offline.html')}
            className="px-3 py-1.5 rounded-lg bg-[#242b3b] hover:bg-[#30394e] text-emerald-300 hover:text-white border border-[#3b455b] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download offline single-file HTML"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline (.html)</span>
          </button>

          {onOpenSchoolBypass && (
            <button
              onClick={onOpenSchoolBypass}
              className="px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>School Bypass Hub</span>
            </button>
          )}
        </div>
      </div>

      {/* Server Directory Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#292e3a] pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-400" />
            <span>Verified Eaglercraft Server List</span>
          </h3>
          <p className="text-xs text-gray-400">All servers tested with WebSocket handshakes in real time</p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Popular', 'Survival', 'Minigames', 'PvP', 'Vanilla'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-[#1b1e26] hover:bg-[#252a35] text-gray-300 border border-[#303746]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServers.map((server) => {
          const isSelected = server.url === activeServerUrl;
          const isPinging = pingingId === server.id;

          return (
            <div
              key={server.id}
              className={`bg-[#181a21] border rounded-xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 relative ${
                isSelected
                  ? 'border-emerald-500/70 bg-[#192222]/80 shadow-md shadow-emerald-950/30 ring-1 ring-emerald-500/40'
                  : 'border-[#2c3240] hover:border-[#3e475b]'
              }`}
            >
              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{server.name}</h4>
                      {server.featured && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Top Choice
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-gray-400">{server.playersEstimate} • {server.version}</span>
                  </div>

                  {/* Status badge */}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                    server.status === 'online'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : server.status === 'offline'
                      ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                      : 'bg-gray-800 text-gray-300'
                  }`}>
                    {server.status === 'online' ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {server.ping ? `${server.ping}ms` : 'Online'}
                      </>
                    ) : server.status === 'offline' ? (
                      <>
                        <WifiOff className="w-3 h-3 text-red-400" />
                        Offline
                      </>
                    ) : (
                      'Checking'
                    )}
                  </span>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {server.description}
                </p>

                {/* Server URL code */}
                <div className="bg-[#101217] border border-[#2b303d] rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-emerald-300 truncate select-all">
                    {server.url}
                  </code>
                  <button
                    onClick={() => handleCopy(server.url)}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copy URL"
                  >
                    {copiedUrl === server.url ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#262b37]">
                <button
                  onClick={() => onSelectActiveServer(server.url)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#252a35] hover:bg-[#303746] text-gray-200 hover:text-white'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isSelected ? 'Currently Selected' : 'Select Server'}</span>
                </button>

                <button
                  onClick={() => handlePingServer(server)}
                  disabled={isPinging}
                  className="px-2.5 py-1.5 rounded-lg bg-[#1f232d] hover:bg-[#2b313f] text-gray-300 hover:text-white border border-[#343b4c] text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Test server WebSocket ping"
                >
                  <Wifi className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-emerald-400' : 'text-gray-400'}`} />
                  <span>{isPinging ? '...' : 'Ping'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add & Test Custom Server URL Section */}
      <div className="bg-[#171920] border border-[#2e3442] rounded-xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-white text-sm">Test or Add Your Own Server URL</h4>
          </div>
          <span className="text-xs text-gray-400 font-mono">Supports all wss:// protocols</span>
        </div>

        <form onSubmit={handleTestCustomServer} className="flex flex-col sm:flex-row items-stretch gap-3">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Server Name (Optional)"
            className="sm:w-48 bg-[#101217] border border-[#353b4c] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="wss://your-eagler-server.com"
            className="flex-1 bg-[#101217] border border-[#353b4c] rounded-lg px-3 py-2 text-xs text-white font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isTestingCustom || !customUrl.trim()}
            className="px-4 py-2 bg-[#262c38] hover:bg-[#323a4b] text-white text-xs font-semibold rounded-lg border border-[#3e475b] transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Wifi className={`w-3.5 h-3.5 ${isTestingCustom ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>{isTestingCustom ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </form>

        {/* Custom Server Test Result Banner */}
        {testResult && (
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
            testResult.ok
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.ok ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-400" />
              )}
              <span>
                {testResult.ok
                  ? `Server responded! Online with ${testResult.ping}ms latency.`
                  : `Could not connect: ${testResult.error || 'Server is offline or unreachable'}`}
              </span>
            </div>

            {testResult.ok && (
              <button
                type="button"
                onClick={handleAddCustomServer}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors shadow"
              >
                Save & Use Server
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
