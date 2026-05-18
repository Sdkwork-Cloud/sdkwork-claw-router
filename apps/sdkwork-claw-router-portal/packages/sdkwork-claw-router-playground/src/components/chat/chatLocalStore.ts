import type { ChatMessage, ChatSessionSummary } from './chatTypes';

const CHAT_LOCAL_STORE_PREFIX = 'sdkwork-claw-router.playground.chat';

interface StoredChatConversation {
  sessions: ChatSessionSummary[];
  messagesBySessionId: Record<string, ChatMessage[]>;
  updatedAt: string;
}

function readStorage(): Storage | null {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function storageKey(apiKeyId: string): string {
  return `${CHAT_LOCAL_STORE_PREFIX}.${apiKeyId}`;
}

export function loadStoredChatSessions(apiKeyId: string): ChatSessionSummary[] {
  const store = readStorage();
  if (!store) {
    return [];
  }
  const raw = store.getItem(storageKey(apiKeyId));
  if (!raw) {
    return [];
  }
  try {
    const conversation = JSON.parse(raw) as StoredChatConversation;
    if (!conversation || !Array.isArray(conversation.sessions)) {
      return [];
    }
    return conversation.sessions.filter(isChatSessionSummary);
  } catch {
    return [];
  }
}

export function loadStoredChatMessages(apiKeyId: string, sessionId: string): ChatMessage[] {
  const store = readStorage();
  if (!store) {
    return [];
  }
  const raw = store.getItem(storageKey(apiKeyId));
  if (!raw) {
    return [];
  }
  try {
    const conversation = JSON.parse(raw) as StoredChatConversation;
    const messages = conversation.messagesBySessionId?.[sessionId];
    return Array.isArray(messages) ? messages.filter(isChatMessage) : [];
  } catch {
    return [];
  }
}

export function saveStoredChatConversation(
  apiKeyId: string,
  sessions: ChatSessionSummary[],
  messagesBySessionId: Record<string, ChatMessage[]>,
): void {
  const store = readStorage();
  if (!store) {
    return;
  }
  const conversation: StoredChatConversation = {
    sessions: sessions.filter(isChatSessionSummary),
    messagesBySessionId: Object.fromEntries(
      Object.entries(messagesBySessionId).map(([sessionId, messages]) => [
        sessionId,
        messages.filter(isChatMessage),
      ]),
    ),
    updatedAt: new Date().toISOString(),
  };
  try {
    store.setItem(storageKey(apiKeyId), JSON.stringify(conversation));
  } catch {
    // Ignore local storage quota or serialization failures.
  }
}

export function mergeChatSessions(
  apiKeyId: string,
  remoteSessions: ChatSessionSummary[],
  remoteMessagesBySessionId: Record<string, ChatMessage[]>,
): {
  sessions: ChatSessionSummary[];
  messagesBySessionId: Record<string, ChatMessage[]>;
} {
  const storedSessions = loadStoredChatSessions(apiKeyId);
  const sessionsById = new Map<string, ChatSessionSummary>();
  for (const session of [...storedSessions, ...remoteSessions]) {
    const current = sessionsById.get(session.id);
    if (!current || Date.parse(session.updatedAt) >= Date.parse(current.updatedAt)) {
      sessionsById.set(session.id, session);
    }
  }

  const messagesBySessionId: Record<string, ChatMessage[]> = {};
  const storedConversationMessages = loadStoredChatMessagesMap(apiKeyId);
  for (const [sessionId, messages] of Object.entries(storedConversationMessages)) {
    messagesBySessionId[sessionId] = messages;
  }
  for (const [sessionId, messages] of Object.entries(remoteMessagesBySessionId)) {
    messagesBySessionId[sessionId] = messages;
  }

  return {
    sessions: [...sessionsById.values()].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    messagesBySessionId,
  };
}

function loadStoredChatMessagesMap(apiKeyId: string): Record<string, ChatMessage[]> {
  const store = readStorage();
  if (!store) {
    return {};
  }
  const raw = store.getItem(storageKey(apiKeyId));
  if (!raw) {
    return {};
  }
  try {
    const conversation = JSON.parse(raw) as StoredChatConversation;
    if (!conversation || !conversation.messagesBySessionId) {
      return {};
    }
    const result: Record<string, ChatMessage[]> = {};
    for (const [sessionId, messages] of Object.entries(conversation.messagesBySessionId)) {
      if (Array.isArray(messages)) {
        result[sessionId] = messages.filter(isChatMessage);
      }
    }
    return result;
  } catch {
    return {};
  }
}

function isChatSessionSummary(value: unknown): value is ChatSessionSummary {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string'
    && typeof record.latestCompletionId === 'string'
    && typeof record.title === 'string'
    && typeof record.createdAt === 'string'
    && typeof record.updatedAt === 'string';
}

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string'
    && (record.role === 'user' || record.role === 'assistant')
    && typeof record.content === 'string'
    && typeof record.createdAt === 'string'
    && typeof record.status === 'string';
}
