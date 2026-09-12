import { UserAccount } from '../types';

const ACCOUNTS_STORAGE_KEY = 'eaglecraft_user_accounts_v1';
const ACTIVE_USER_STORAGE_KEY = 'eaglecraft_active_user_v1';
const LEADERBOARD_SCORES_STORAGE_KEY = 'eaglecraft_leaderboard_scores_v1';
const CHAT_MESSAGE_COUNTS_STORAGE_KEY = 'eaglecraft_chat_message_counts_v1';

export interface LeaderboardScoreRecord {
  userId: string;
  username: string;
  tetrisHighScore: number;
  cookieClicks: number;
}

export interface ChatMessageCountRecord {
  userId: string;
  username: string;
  count: number;
}

// Reserved usernames that cannot be claimed by regular users
const RESERVED_USERNAMES = [
  'webcreator1117',
  'creator',
  'admin',
  'owner',
  'system',
  'staff',
  'moderator',
  'support'
];

// Initial default accounts for existing leaderboard legends
const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_creator_01',
    email: 'webcreator1117@outlook.com',
    username: 'Webcreator1117',
    passwordHash: 'creator_secure_root',
    rank: 'vip',
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr_vipershadow_02',
    email: 'vipershadow@gaming.net',
    username: 'ViperShadow',
    passwordHash: 'viper_pass_123',
    rank: 'vip',
    createdAt: '2026-02-10T12:00:00.000Z',
    lastLogin: '2026-09-10T08:00:00.000Z'
  },
  {
    id: 'usr_minecraftking_03',
    email: 'mck_99@blockmail.com',
    username: 'MinecraftKing_99',
    passwordHash: 'king_pass_99',
    rank: 'sidekick',
    createdAt: '2026-03-01T15:00:00.000Z',
    lastLogin: '2026-09-08T18:00:00.000Z'
  }
];

export const getStoredAccounts = (): UserAccount[] => {
  try {
    const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const accounts = JSON.parse(data);
    return Array.isArray(accounts) ? accounts : INITIAL_ACCOUNTS;
  } catch {
    return INITIAL_ACCOUNTS;
  }
};

export const saveAccounts = (accounts: UserAccount[]) => {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Failed to save accounts to storage', err);
  }
};

export const getActiveUser = (): UserAccount | null => {
  try {
    const data = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data) as UserAccount;
  } catch {
    return null;
  }
};

const getLeaderboardScoreMap = (): Record<string, LeaderboardScoreRecord> => {
  try {
    const data = localStorage.getItem(LEADERBOARD_SCORES_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveLeaderboardScoreMap = (scores: Record<string, LeaderboardScoreRecord>) => {
  try {
    localStorage.setItem(LEADERBOARD_SCORES_STORAGE_KEY, JSON.stringify(scores));
  } catch {
    // Storage may be unavailable in private browsing.
  }
};

export const getLeaderboardScores = (): LeaderboardScoreRecord[] => {
  const activeUser = getActiveUser();
  const scores = getLeaderboardScoreMap();

  if (activeUser && !scores[activeUser.id] && !localStorage.getItem('eaglecraft_leaderboard_migrated_v1')) {
    const migratedScores = {
      userId: activeUser.id,
      username: activeUser.username,
      tetrisHighScore: Number(localStorage.getItem('tetris_high_score') || '0'),
      cookieClicks: Number(localStorage.getItem('cc_clicks') || '0')
    };
    scores[activeUser.id] = migratedScores;
    saveLeaderboardScoreMap(scores);
    localStorage.setItem('eaglecraft_leaderboard_migrated_v1', 'true');
  }

  return Object.values(scores);
};

export const updateLeaderboardScore = (
  game: 'tetrisHighScore' | 'cookieClicks',
  score: number
) => {
  const activeUser = getActiveUser();
  if (!activeUser) return;

  const scores = getLeaderboardScoreMap();
  const current = scores[activeUser.id] || {
    userId: activeUser.id,
    username: activeUser.username,
    tetrisHighScore: 0,
    cookieClicks: 0
  };

  scores[activeUser.id] = {
    ...current,
    username: activeUser.username,
    [game]: Math.max(current[game], score)
  };
  saveLeaderboardScoreMap(scores);
};

export const getChatMessageCounts = (): ChatMessageCountRecord[] => {
  try {
    const data = localStorage.getItem(CHAT_MESSAGE_COUNTS_STORAGE_KEY);
    const counts = data ? JSON.parse(data) : {};
    return Object.values(counts);
  } catch {
    return [];
  }
};

export const recordChatMessage = (username: string) => {
  const activeUser = getActiveUser();
  const userId = activeUser?.id || 'guest';

  try {
    const data = localStorage.getItem(CHAT_MESSAGE_COUNTS_STORAGE_KEY);
    const counts: Record<string, ChatMessageCountRecord> = data ? JSON.parse(data) : {};
    const current = counts[userId] || { userId, username, count: 0 };
    counts[userId] = {
      ...current,
      username: activeUser?.username || username,
      count: current.count + 1
    };
    localStorage.setItem(CHAT_MESSAGE_COUNTS_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Chat remains usable if browser storage is unavailable.
  }
};

export const setActiveUser = (user: UserAccount | null) => {
  try {
    if (user) {
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(ACTIVE_USER_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: user }));
  } catch (err) {
    console.error('Failed to update active user', err);
  }
};

// Check if username is already taken (strictly case-insensitive)
export const isUsernameTaken = (username: string, currentUserId?: string): boolean => {
  const clean = username.trim().toLowerCase();
  
  // Check reserved list
  if (RESERVED_USERNAMES.includes(clean)) {
    // If the active user isn't the owner, block
    const active = getActiveUser();
    if (!active || active.id !== 'usr_creator_01') {
      return true;
    }
  }

  const accounts = getStoredAccounts();
  return accounts.some(acc => {
    if (currentUserId && acc.id === currentUserId) return false;
    return acc.username.trim().toLowerCase() === clean;
  });
};

// Check if email already exists
export const isEmailRegistered = (email: string, currentUserId?: string): boolean => {
  const clean = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  return accounts.some(acc => {
    if (currentUserId && acc.id === currentUserId) return false;
    return acc.email.trim().toLowerCase() === clean;
  });
};

// Register Account (Email, Password, Unique Custom Username)
export const registerAccount = (
  email: string,
  password: string,
  username: string
): { success: boolean; error?: string; user?: UserAccount } => {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  // Basic validations
  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'Custom Username must be at least 3 characters.' };
  }

  if (cleanUsername.length > 20) {
    return { success: false, error: 'Username cannot exceed 20 characters.' };
  }

  // Check unique username constraint
  if (isUsernameTaken(cleanUsername)) {
    return { 
      success: false, 
      error: `The username "${cleanUsername}" is already taken! Please choose a unique name for the leaderboard.` 
    };
  }

  // Check unique email constraint
  if (isEmailRegistered(cleanEmail)) {
    return { 
      success: false, 
      error: 'An account with this email already exists. Try signing in or resetting your password.' 
    };
  }

  const newAccount: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    username: cleanUsername,
    passwordHash: password, // client storage credential
    rank: 'player',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };

  const accounts = getStoredAccounts();
  accounts.push(newAccount);
  saveAccounts(accounts);
  setActiveUser(newAccount);

  return { success: true, user: newAccount };
};

// Sign In (Email or Username + Password)
export const loginAccount = (
  identifier: string,
  password: string
): { success: boolean; error?: string; user?: UserAccount } => {
  const cleanId = identifier.trim().toLowerCase();
  const accounts = getStoredAccounts();

  const found = accounts.find(
    acc => acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId
  );

  if (!found) {
    return { success: false, error: 'No account found with this email or username.' };
  }

  if (found.passwordHash !== password) {
    return { success: false, error: 'Incorrect password. Try again or reset password below.' };
  }

  found.lastLogin = new Date().toISOString();
  saveAccounts(accounts);
  setActiveUser(found);

  return { success: true, user: found };
};

// Direct Password Reset (No verification settings, just Email + New Password as requested)
export const resetPasswordDirect = (
  email: string,
  newPassword: string
): { success: boolean; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { success: false, error: 'Please enter your registered email address.' };
  }

  if (!newPassword || newPassword.length < 4) {
    return { success: false, error: 'New password must be at least 4 characters.' };
  }

  const accounts = getStoredAccounts();
  const index = accounts.findIndex(acc => acc.email.toLowerCase() === cleanEmail);

  if (index === -1) {
    return { success: false, error: 'No account matches this email address.' };
  }

  accounts[index].passwordHash = newPassword;
  saveAccounts(accounts);

  // If current active user was this user, update active user
  const active = getActiveUser();
  if (active && active.id === accounts[index].id) {
    setActiveUser(accounts[index]);
  }

  return { success: true };
};

// Upgrade User Rank (Original, VIP, SideKick, NoLife)
export const upgradeUserRank = (
  rank: 'original' | 'vip' | 'sidekick' | 'nolife'
): boolean => {
  const active = getActiveUser();
  if (!active) return false;

  const accounts = getStoredAccounts();
  const idx = accounts.findIndex(a => a.id === active.id);
  if (idx !== -1) {
    accounts[idx].rank = rank;
    saveAccounts(accounts);
    setActiveUser(accounts[idx]);
    return true;
  }
  return false;
};

// Sign Out
export const logoutAccount = () => {
  setActiveUser(null);
};
