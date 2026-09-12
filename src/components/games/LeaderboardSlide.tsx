import React, { useState, useEffect } from 'react';
import { Trophy, Zap, BrainCircuit, TimerReset, Flame, Crown, MessageSquare } from 'lucide-react';
import { getActiveUser, getChatMessageCounts, getLeaderboardScores, ChatMessageCountRecord, LeaderboardScoreRecord } from '../../utils/accountManager';
import { UserAccount } from '../../types';

interface LeaderboardSlideProps {
  onOpenPaymentModal: (plan?: 'original' | 'vip' | 'sidekick' | 'nolife') => void;
  onOpenContactModal: (topic?: string) => void;
  onOpenAuthModal?: (tab?: 'signin' | 'signup' | 'reset') => void;
}

interface LeaderboardRow {
  rank: number;
  user: string;
  value: number | string;
  badge: string;
  isYou?: boolean;
}

const readNumber = (key: string, fallback: number) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? Number(raw) || fallback : fallback;
  } catch {
    return fallback;
  }
};

const formatScore = (value: number) => {
  return new Intl.NumberFormat('en-US').format(Math.max(0, value));
};

export const LeaderboardSlide: React.FC<LeaderboardSlideProps> = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveUser());
  const [scoreRecords, setScoreRecords] = useState<LeaderboardScoreRecord[]>(() => getLeaderboardScores());
  const [chatMessageCounts, setChatMessageCounts] = useState<ChatMessageCountRecord[]>(() => getChatMessageCounts());
  const [siteTime, setSiteTime] = useState<number>(() => readNumber('site_visible_seconds_v1', 0));

  useEffect(() => {
    const refresh = () => {
      setCurrentUser(getActiveUser());
      setScoreRecords(getLeaderboardScores());
      setChatMessageCounts(getChatMessageCounts());
      setSiteTime(readNumber('site_visible_seconds_v1', 0));
    };

    refresh();
    const interval = window.setInterval(refresh, 60 * 60 * 1000);
    const handleAuthChange = () => setCurrentUser(getActiveUser());
    const handleChatUpdate = () => setChatMessageCounts(getChatMessageCounts());
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'eaglecraft_chat_message_counts_v1') {
        setChatMessageCounts(getChatMessageCounts());
      }
    };
    window.addEventListener('auth-state-changed', handleAuthChange);
    window.addEventListener('chat-updated', handleChatUpdate);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('auth-state-changed', handleAuthChange);
      window.removeEventListener('chat-updated', handleChatUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const playerName = currentUser?.username ?? 'You';
  const playerBadge = currentUser ? 'You' : 'Guest';

  const tetrisRows = scoreRecords
    .map(record => ({
      rank: 0,
      user: record.username,
      value: record.tetrisHighScore,
      badge: record.userId === currentUser?.id ? playerBadge : 'Player',
      isYou: record.userId === currentUser?.id
    }))
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const cookieRows = scoreRecords
    .map(record => ({
      rank: 0,
      user: record.username,
      value: record.cookieClicks,
      badge: record.userId === currentUser?.id ? playerBadge : 'Player',
      isYou: record.userId === currentUser?.id
    }))
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const websiteRows = [
    { rank: 1, user: playerName, value: formatTime(siteTime), badge: playerBadge, isYou: true }
  ];

  const chatRows = chatMessageCounts
    .map(record => ({
      rank: 0,
      user: record.username,
      value: record.count,
      badge: record.userId === currentUser?.id ? playerBadge : 'Player',
      isYou: record.userId === currentUser?.id
    }))
    .sort((a, b) => b.value - a.value)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const leaderboardCards: Array<{
    title: string;
    icon: React.ReactNode;
    accent: string;
    valueKey: string;
    rows: LeaderboardRow[];
    renderValue: (value: number | string) => string;
  }> = [
    {
      title: 'Tetris High Score',
      icon: <BrainCircuit className="w-4 h-4 text-violet-400" />,
      accent: 'border-violet-500/50 bg-violet-950/20',
      valueKey: 'High Score',
      rows: tetrisRows,
      renderValue: value => formatScore(Number(value))
    },
    {
      title: 'Cookie Clicker',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      accent: 'border-amber-500/50 bg-amber-950/20',
      valueKey: 'Clicks',
      rows: cookieRows,
      renderValue: value => formatScore(Number(value))
    },
    {
      title: 'Website Time',
      icon: <TimerReset className="w-4 h-4 text-cyan-400" />,
      accent: 'border-cyan-500/50 bg-cyan-950/20',
      valueKey: 'Time',
      rows: websiteRows,
      renderValue: value => String(value)
    },
    {
      title: 'Chat Messages',
      icon: <MessageSquare className="w-4 h-4 text-cyan-400" />,
      accent: 'border-cyan-500/50 bg-cyan-950/20',
      valueKey: 'Messages',
      rows: chatRows,
      renderValue: value => `${formatScore(Number(value))} sent`
    }
  ];

  return (
    <div className="w-full flex flex-col h-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-600/30 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">Leaderboards</span>
          </div>
        </div>
      </div>

      <div className="relative w-full min-h-[520px] lg:min-h-[640px] bg-[#0c0e15] rounded-2xl border-2 border-[#242b3e] p-4 sm:p-6 overflow-y-auto shadow-2xl custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
          <div className="grid gap-4 lg:grid-cols-4">
            {leaderboardCards.map(card => (
              <div key={card.title} className={`rounded-2xl border p-4 ${card.accent}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {card.icon}
                    <span className="text-sm font-bold text-white">{card.title}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-gray-400">Live</span>
                </div>

                <div className="space-y-2">
                  {card.rows.slice(0, 5).map(row => (
                    <div
                      key={`${card.title}-${row.user}`}
                      className={`flex items-center justify-between rounded-xl border px-2.5 py-2 text-[11px] ${
                        row.isYou ? 'bg-[#131d2b] border-emerald-500/40' : 'bg-[#121621] border-[#2a3348]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-[#1d2433] text-gray-200 flex items-center justify-center font-black text-[10px]">
                          #{row.rank}
                        </span>
                        <span className="truncate text-white font-semibold">{row.user}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#1d2433] text-gray-300 border border-[#2f3d53]">
                          {row.badge}
                        </span>
                      </div>

                      <span className="font-mono font-bold text-emerald-300 shrink-0">
                        {card.renderValue(row.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#2a3348] bg-[#121821] p-4">
              <div className="flex items-center gap-2 mb-3 text-amber-300">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-bold text-white">Cookie Clicker</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Highest click count updates live from the Cookie Clicker game and is ranked here automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-[#2a3348] bg-[#121821] p-4">
              <div className="flex items-center gap-2 mb-3 text-violet-300">
                <Crown className="w-4 h-4" />
                <span className="text-sm font-bold text-white">Tetris</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Highest game score is saved locally and updates on this board whenever the score increases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
