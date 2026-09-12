import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Smile, Users } from 'lucide-react';
import { getActiveUser, recordChatMessage } from '../utils/accountManager';
import { UserAccount } from '../types';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  sentAt: string;
}

const CHAT_STORAGE_KEY = 'eaglecraft_live_chat_v1';
const CHAT_CHANNEL_NAME = 'eaglecraft_live_chat_channel_v1';
const MAX_MESSAGES = 100;
const SEND_COOLDOWN_MS = 2500;
const EMOJI_OPTIONS = ['😀', '😂', '❤️', '🔥', '👍', '🎮', '🎉', '😎'];

const readMessages = (): ChatMessage[] => {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!saved) return [];
    const messages = JSON.parse(saved);
    return Array.isArray(messages) ? messages : [];
  } catch {
    return [];
  }
};

const mapRemoteMessage = (message: { id: string; username: string; message: string; sent_at: string }): ChatMessage => ({
  id: message.id,
  username: message.username,
  text: message.message,
  sentAt: message.sent_at
});

const fetchRemoteMessages = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, username, message, sent_at')
    .order('sent_at', { ascending: true })
    .limit(MAX_MESSAGES);
  return error || !data ? null : data.map(mapRemoteMessage);
};

export const ChatSlide: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(readMessages);
  const [messageText, setMessageText] = useState('');
  const [isSendLocked, setIsSendLocked] = useState(false);
  const [chatStatus, setChatStatus] = useState<string>('Connecting...');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getActiveUser());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const pendingMessageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getActiveUser());
    window.addEventListener('auth-state-changed', handleAuthChange);

    if (!supabase && 'BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel(CHAT_CHANNEL_NAME);
      channelRef.current.onmessage = event => {
        if (event.data?.type === 'chat-updated') {
          setMessages(readMessages());
        }
      };
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CHAT_STORAGE_KEY) setMessages(readMessages());
    };
    if (!supabase) window.addEventListener('storage', handleStorageChange);

    let isMounted = true;
    if (supabase) {
      fetchRemoteMessages().then(remoteMessages => {
        if (remoteMessages && isMounted) {
          setMessages(previous => {
            const remoteIds = new Set(remoteMessages.map(message => message.id));
            const pendingMessages = previous.filter(message => pendingMessageIdsRef.current.has(message.id) && !remoteIds.has(message.id));
            return [...remoteMessages, ...pendingMessages].slice(-MAX_MESSAGES);
          });
          setChatStatus('Connected');
        } else if (isMounted) {
          setChatStatus('Chat database unavailable');
        }
      });

      const refreshTimer = window.setInterval(() => {
        fetchRemoteMessages().then(remoteMessages => {
          if (remoteMessages && isMounted) {
            setMessages(previous => {
              const remoteIds = new Set(remoteMessages.map(message => message.id));
              const pendingMessages = previous.filter(message => pendingMessageIdsRef.current.has(message.id) && !remoteIds.has(message.id));
              return [...remoteMessages, ...pendingMessages].slice(-MAX_MESSAGES);
            });
            setChatStatus('Connected');
          }
        });
      }, 2500);

      const subscription = supabase
        .channel('live-chat-messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
          if (isMounted) {
            setMessages(previous => previous.some(message => message.id === payload.new.id)
              ? previous
              : [...previous, mapRemoteMessage(payload.new as { id: string; username: string; message: string; sent_at: string })].slice(-MAX_MESSAGES));
          }
        })
        .subscribe();

      return () => {
        isMounted = false;
        window.removeEventListener('auth-state-changed', handleAuthChange);
        if (!supabase) window.removeEventListener('storage', handleStorageChange);
        channelRef.current?.close();
        window.clearInterval(refreshTimer);
        void supabase.removeChannel(subscription);
      };
    }

    return () => {
      isMounted = false;
      window.removeEventListener('auth-state-changed', handleAuthChange);
      if (!supabase) window.removeEventListener('storage', handleStorageChange);
      channelRef.current?.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const persistMessages = (nextMessages: ChatMessage[]) => {
    const trimmedMessages = nextMessages.slice(-MAX_MESSAGES);
    setMessages(trimmedMessages);
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmedMessages));
      channelRef.current?.postMessage({ type: 'chat-updated' });
    } catch {
      // Chat remains usable if browser storage is unavailable.
    }
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || isSendLocked) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username: currentUser?.username ?? 'Guest',
      text: text.slice(0, 500),
      sentAt: new Date().toISOString()
    };

    pendingMessageIdsRef.current.add(message.id);
    if (supabase) {
      const { error } = await supabase.from('chat_messages').insert({
        id: message.id,
        username: message.username,
        message: message.text,
        sent_at: message.sentAt
      });
      if (error) {
        persistMessages([...messages, message]);
        setChatStatus(`Send failed: ${error.message}`);
      } else {
        pendingMessageIdsRef.current.delete(message.id);
        setMessages(previous => previous.some(item => item.id === message.id) ? previous : [...previous, message].slice(-MAX_MESSAGES));
        setChatStatus('Connected');
      }
    } else {
      persistMessages([...messages, message]);
    }
    recordChatMessage(message.username);
    window.dispatchEvent(new CustomEvent('chat-updated'));
    setMessageText('');
    setIsSendLocked(true);
    window.setTimeout(() => setIsSendLocked(false), SEND_COOLDOWN_MS);
  };

  return (
    <div className="w-full flex flex-col h-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <MessageCircle className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-wide">Chat</span>
            <span className="text-gray-400 text-[11px] ml-1.5 hidden sm:inline">Talk with people in open tabs</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentUser?.username ?? 'Guest'}</span>
        </div>
      </div>

      <div className="relative w-full min-h-[520px] lg:min-h-[640px] bg-[#0c0e15] rounded-2xl border-2 border-[#242b3e] p-4 sm:p-6 shadow-2xl">
        <div className="max-w-4xl mx-auto h-full min-h-[470px] flex flex-col rounded-2xl border border-[#2a3348] bg-[#121821] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#2a3348] bg-[#171e2b]">
            <div>
              <h2 className="text-sm font-bold text-white">Live Chat</h2>
              <p className="text-[11px] text-gray-400">{isSupabaseConfigured ? `Shared live chat across the website. ${chatStatus}` : 'Local chat mode: configure Supabase to share messages.'}</p>
            </div>
          </div>

          <div className="flex-1 min-h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center text-gray-400">
                <MessageCircle className="w-8 h-8 text-cyan-500/60 mb-3" />
                <p className="text-sm font-semibold text-gray-300">No messages yet</p>
                <p className="text-xs mt-1">Start the conversation below.</p>
              </div>
            ) : (
              messages.map(message => {
                const isCurrentUser = message.username === (currentUser?.username ?? 'Guest');
                return (
                  <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-xl px-3 py-2 border ${isCurrentUser ? 'bg-cyan-950/40 border-cyan-500/40' : 'bg-[#1a2230] border-[#303b50]'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-white">{message.username}</span>
                        <time className="text-[10px] text-gray-500" dateTime={message.sentAt}>
                          {new Date(message.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </time>
                      </div>
                      <p className="text-sm text-gray-200 break-words whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-[#2a3348] bg-[#171e2b]">
            <div className="flex items-center gap-2">
              <input
                value={messageText}
                onChange={event => setMessageText(event.target.value)}
                maxLength={500}
                placeholder={currentUser ? `Message as ${currentUser.username}` : 'Sign in or chat as Guest'}
                className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-[#0e131d] border border-[#303b50] text-sm text-white placeholder:text-gray-500 outline-none focus:border-cyan-500/70"
              />
              <button
                type="submit"
                disabled={!messageText.trim() || isSendLocked}
                className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title={isSendLocked ? 'Wait 2.5 seconds before sending again' : 'Send message'}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 pt-2">
              <Smile className="w-3.5 h-3.5 text-gray-500" />
              {EMOJI_OPTIONS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setMessageText(text => `${text}${emoji}`)}
                  className="w-7 h-7 rounded-md hover:bg-[#273246] text-base leading-none cursor-pointer"
                  title={`Add ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              {isSendLocked && <span className="ml-auto text-[10px] text-gray-500">Sending cooldown: 2.5s</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
