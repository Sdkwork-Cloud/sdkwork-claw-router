import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiKeyService } from 'sdkwork-claw-router-console-api-keys';
import { PlaygroundService } from '../../playgroundService';
import { loadStoredChatMessages, mergeChatSessions, saveStoredChatConversation } from './chatLocalStore';
import { SimpleChatInput } from './SimpleChatInput';
import { ChatMessageList } from './ChatMessageList';
import { ChatSessionList } from './ChatSessionList';
import { createChatUserMessage, createFailedAssistantMessage, createPendingAssistantMessage } from './chatSession';
import { ChatService } from './chatService';
import type { ChatApiKeyOption, ChatMessage, ChatSessionSummary, SimpleChatInputSubmit } from './chatTypes';
import type { PlaygroundModelGroup, PlaygroundModelOption } from '../../playgroundTypes';

export function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [messagesBySessionId, setMessagesBySessionId] = useState<Record<string, ChatMessage[]>>({});
  const [modelGroups, setModelGroups] = useState<PlaygroundModelGroup[]>([]);
  const [apiKeys, setApiKeys] = useState<ChatApiKeyOption[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedApiKeyId, setSelectedApiKeyId] = useState('');
  const [loadingApiKeys, setLoadingApiKeys] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isNewChatDraft, setIsNewChatDraft] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [composerHeightPx, setComposerHeightPx] = useState(224);
  const sessionsRef = useRef<ChatSessionSummary[]>([]);
  const messagesRef = useRef<ChatMessage[]>([]);
  const messagesBySessionIdRef = useRef<Record<string, ChatMessage[]>>({});
  const selectedApiKeyIdRef = useRef('');
  const selectedSessionIdRef = useRef('');
  const isNewChatDraftRef = useRef(false);

  const beginNewChatDraft = useCallback(() => {
    isNewChatDraftRef.current = true;
    setIsNewChatDraft(true);
  }, []);

  const clearNewChatDraft = useCallback(() => {
    isNewChatDraftRef.current = false;
    setIsNewChatDraft(false);
  }, []);

  const resetActiveConversationView = useCallback(({ clearSessions = false }: { clearSessions?: boolean } = {}) => {
    setSelectedSessionId('');
    setMessages([]);
    setSessionError(null);
    setMessageError(null);
    setLoadingMessages(false);
    setLoadingSessions(false);
    if (clearSessions) {
      setSessions([]);
      setMessagesBySessionId({});
    }
  }, []);

  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesBySessionIdRef.current = messagesBySessionId;
  }, [messagesBySessionId]);

  useEffect(() => {
    selectedApiKeyIdRef.current = selectedApiKeyId;
  }, [selectedApiKeyId]);

  useEffect(() => {
    selectedSessionIdRef.current = selectedSessionId;
  }, [selectedSessionId]);

  useEffect(() => {
    isNewChatDraftRef.current = isNewChatDraft;
  }, [isNewChatDraft]);

  useEffect(() => {
    let cancelled = false;

    PlaygroundService.fetchModelGroups()
      .then((groups) => {
        if (cancelled) {
          return;
        }
        setModelGroups(groups);
        setSelectedModelId((current) => current || firstChatModel(groups)?.id || '');
      })
      .catch(() => {
        if (!cancelled) {
          setModelGroups([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingApiKeys(true);
    setApiKeyError(null);

    ApiKeyService.fetchKeys()
      .then((data) => {
        if (cancelled) {
          return;
        }
        const keys = data.map((key) => ({
          id: key.id,
          name: key.name,
          displayName: key.displayName,
          maskedKey: key.maskedKey,
          copyableKey: key.copyableKey,
          group: key.group,
          groupName: key.groupName,
          status: key.status,
        }));
        const enabledKeys = keys.filter((key) => key.status === 'enabled');
        setApiKeys(enabledKeys);
        setSelectedApiKeyId((current) => (
          enabledKeys.some((key) => key.id === current) ? current : enabledKeys[0]?.id ?? ''
        ));
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }
        setApiKeys([]);
        setSelectedApiKeyId('');
        setApiKeyError(error instanceof Error ? error.message : t('playground.chat.apiKey.loadFailed'));
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingApiKeys(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [t]);

  const selectedApiKey = useMemo(
    () => apiKeys.find((key) => key.id === selectedApiKeyId) || apiKeys[0],
    [apiKeys, selectedApiKeyId],
  );
  const selectedSession = useMemo(
    () => sessions.find((session) => session.id === selectedSessionId) || null,
    [sessions, selectedSessionId],
  );

  const selectedChatModel = useMemo(
    () => findChatModel(modelGroups, selectedModelId),
    [modelGroups, selectedModelId],
  );

  useEffect(() => {
    let cancelled = false;
    clearNewChatDraft();
    resetActiveConversationView();
    if (!selectedApiKey?.copyableKey) {
      setSessions([]);
      setMessagesBySessionId({});
      sessionsRef.current = [];
      messagesRef.current = [];
      messagesBySessionIdRef.current = {};
      setLoadingSessions(false);
      return undefined;
    }

    const localConversation = mergeChatSessions(selectedApiKey.id, [], {});
    sessionsRef.current = localConversation.sessions;
    messagesBySessionIdRef.current = localConversation.messagesBySessionId;
    setSessions(localConversation.sessions);
    setMessagesBySessionId(localConversation.messagesBySessionId);
    setSelectedSessionId((current) => {
      if (isNewChatDraftRef.current) {
        return '';
      }
      if (current && localConversation.sessions.some((session) => session.id === current)) {
        return current;
      }
      return localConversation.sessions[0]?.id ?? '';
    });

    setLoadingSessions(true);
    ChatService.fetchSessions({ apiKey: selectedApiKey.copyableKey })
      .then((items) => {
        if (!cancelled) {
          const merged = mergeChatSessions(selectedApiKey.id, items, localConversation.messagesBySessionId);
          sessionsRef.current = merged.sessions;
          messagesBySessionIdRef.current = merged.messagesBySessionId;
          setSessions(merged.sessions);
          setMessagesBySessionId(merged.messagesBySessionId);
          setSelectedSessionId((current) => {
            if (isNewChatDraftRef.current) {
              return '';
            }
            if (current && merged.sessions.some((item) => item.id === current)) {
              return current;
            }
            return merged.sessions[0]?.id ?? '';
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          sessionsRef.current = localConversation.sessions;
          messagesBySessionIdRef.current = localConversation.messagesBySessionId;
          setSessions(localConversation.sessions);
          setMessagesBySessionId(localConversation.messagesBySessionId);
          setSessionError(error instanceof Error ? error.message : t('playground.chat.sessionsLoadFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingSessions(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [clearNewChatDraft, resetActiveConversationView, selectedApiKey?.copyableKey, selectedApiKey?.id, t]);

  useEffect(() => {
    let cancelled = false;
    if (!selectedApiKey?.copyableKey || !selectedSessionId) {
      setLoadingMessages(false);
      setMessageError(null);
      return undefined;
    }

    const storedMessages = loadStoredChatMessages(selectedApiKey.id, selectedSessionId);
    setMessages(storedMessages);
    setLoadingMessages(true);
    setMessageError(null);
    ChatService.fetchMessages({
      apiKey: selectedApiKey.copyableKey,
      completionId: selectedSession?.latestCompletionId || selectedSessionId,
    })
      .then((items) => {
        if (!cancelled) {
          setMessages(items);
          setMessagesBySessionId((current) => {
            const next = { ...current, [selectedSessionId]: items };
            saveStoredChatConversation(selectedApiKey.id, sessionsRef.current, next);
            return next;
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          if (storedMessages.length === 0) {
            setMessages([]);
          }
          setMessageError(error instanceof Error ? error.message : t('playground.chat.messagesLoadFailed'));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingMessages(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedApiKey?.copyableKey, selectedSession?.latestCompletionId, selectedSessionId, t]);

  const handleSubmit = async (input: SimpleChatInputSubmit): Promise<boolean> => {
    if (!input.apiKey) {
      setMessages((current) => [
        ...current,
        createFailedAssistantMessage(t('playground.chat.errors.missingApiKey')),
      ]);
      return false;
    }
    const selectedModel = findChatModel(modelGroups, input.selectedModelId) || selectedChatModel || firstChatModel(modelGroups);
    if (!selectedModel) {
      setMessages((current) => [
        ...current,
        createFailedAssistantMessage(t('playground.chat.errors.missingModel')),
      ]);
      return false;
    }

    setSubmitting(true);
    setMessageError(null);
    const userMessage = createChatUserMessage(input.prompt);
    const pendingAssistant = createPendingAssistantMessage();
    const priorMessages = messagesRef.current;
    const priorSessions = sessionsRef.current;
    const priorMessagesBySessionId = messagesBySessionIdRef.current;
    const selectedApiKeySnapshot = selectedApiKey;
    const selectedSessionIdSnapshot = selectedSessionId;
    setMessages((current) => [...current, userMessage, pendingAssistant]);

    try {
      const result = await ChatService.sendMessage({
        apiKey: input.apiKey,
        messages: priorMessages,
        prompt: input.prompt,
        selectedModel,
        sessionId: selectedSessionIdSnapshot || undefined,
      });
      const sessionId = selectedSessionIdSnapshot || result.session.id;
      const nextMessages = [
        ...normalizeChatHistoryMessages(priorMessages),
        userMessage,
        result.assistantMessage,
      ];
      const activeSessions = selectedApiKeySnapshot.id === selectedApiKeyIdRef.current
        ? sessionsRef.current
        : priorSessions;
      const nextSessions = [result.session, ...activeSessions.filter((session) => session.id !== result.session.id)];
      const nextMessagesBySessionId = {
        ...priorMessagesBySessionId,
        [sessionId]: nextMessages,
      };
      const apiKeyChanged = selectedApiKeySnapshot.id !== selectedApiKeyIdRef.current;
      const sessionChanged = selectedSessionIdSnapshot !== selectedSessionIdRef.current;
      if (apiKeyChanged || sessionChanged) {
        saveStoredChatConversation(selectedApiKeySnapshot.id, nextSessions, nextMessagesBySessionId);
        return false;
      }
      sessionsRef.current = nextSessions;
      messagesRef.current = nextMessages;
      messagesBySessionIdRef.current = nextMessagesBySessionId;
      setMessages((current) => current.map((message) => (
        message.id === pendingAssistant.id ? result.assistantMessage : message
      )));
      setSessions(nextSessions);
      setMessagesBySessionId(nextMessagesBySessionId);
      saveStoredChatConversation(selectedApiKeySnapshot.id, nextSessions, nextMessagesBySessionId);
      clearNewChatDraft();
      setSelectedSessionId(sessionId);
      return true;
    } catch (error) {
      const apiKeyChanged = selectedApiKeySnapshot.id !== selectedApiKeyIdRef.current;
      const sessionChanged = selectedSessionIdSnapshot !== selectedSessionIdRef.current;
      if (apiKeyChanged || sessionChanged) {
        return false;
      }
      const message = error instanceof Error && error.message.startsWith('playground.')
        ? t(error.message)
        : error instanceof Error
          ? error.message
          : t('playground.chat.errors.emptyResponse');
      setMessages(priorMessages);
      setMessageError(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#111] text-white lg:flex-row">
      <ChatSessionList
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        loading={loadingSessions}
        error={sessionError}
        disabled={submitting}
        onSelectSession={(sessionId) => {
          clearNewChatDraft();
          setSelectedSessionId(sessionId);
        }}
        onNewChat={() => {
          beginNewChatDraft();
          resetActiveConversationView();
        }}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
          <ChatMessageList
            messages={messages}
            loading={loadingMessages}
            error={messageError || sessionError}
            bottomPaddingPx={composerHeightPx}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6">
          <div className="pointer-events-auto w-full max-w-5xl">
            <SimpleChatInput
              modelGroups={modelGroups}
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
              apiKeys={apiKeys}
              selectedApiKeyId={selectedApiKeyId}
              onSelectApiKey={(apiKeyId) => {
                if (submitting) {
                  return;
                }
                if (apiKeyId === selectedApiKeyIdRef.current) {
                  return;
                }
                clearNewChatDraft();
                resetActiveConversationView({ clearSessions: true });
                setSelectedApiKeyId(apiKeyId);
                setLoadingSessions(true);
              }}
              loadingApiKeys={loadingApiKeys}
              apiKeyError={apiKeyError}
              loadingHistory={loadingSessions || loadingMessages}
              onSubmit={handleSubmit}
              submitting={submitting}
              onHeightChange={setComposerHeightPx}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function findChatModel(groups: PlaygroundModelGroup[], modelId: string): PlaygroundModelOption | null {
  for (const group of groups) {
    const model = group.llms.find((item) => item.id === modelId);
    if (model) {
      return model;
    }
  }
  return null;
}

function firstChatModel(groups: PlaygroundModelGroup[]): PlaygroundModelOption | null {
  for (const group of groups) {
    const model = group.llms[0];
    if (model) {
      return model;
    }
  }
  return null;
}

function normalizeChatHistoryMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => (
    (message.role === 'user' || message.role === 'assistant')
    && (message.status === 'sent' || message.status === 'complete')
    && message.content.trim().length > 0
  ));
}
