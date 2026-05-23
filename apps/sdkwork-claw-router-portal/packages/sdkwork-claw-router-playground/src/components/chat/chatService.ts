import {
  ensureSdkworkApiSuccess,
  isRecord,
  readApiRecord,
  readNullableString,
  readRequiredApiItems,
  emptyRuntimeUsageSnapshot,
  mergeRuntimeUsageSnapshots,
  readRuntimeUsageSnapshot,
  type RuntimeUsageSnapshot,
} from 'sdkwork-claw-router-commons/runtime';
import { createChatAssistantMessage } from './chatSession.ts';
import { readRuntimeTextDelta } from '../../runtimeStream.ts';
import {
  completeChatTurnResponse,
  completeRuntimeInvocation as completeRuntimeInvocationOperation,
  createChatConversation,
  createChatTurn,
  createRuntimeInvocation as createRuntimeInvocationOperation,
  listChatConversations,
  listChatMessages,
  retrieveChatConversation,
  streamRuntimeEvents,
} from '../../appRuntimeApiOperations.ts';
import type { ChatMessage, ChatSendInput, ChatSendResult, ChatSessionSummary } from './chatTypes';

const CHAT_SOURCE_SURFACE = 'playground';
const RUNTIME_ADAPTER = 'openai_compatible';
const RUNTIME_ENDPOINT = 'chat.stream';

type RuntimeStreamingCallbacks = {
  onDelta?: (delta: string) => void;
};

interface RuntimeFailure {
  errorCode: string;
  errorMessageMasked: string;
}

interface ChatConversationItem {
  createdAt?: string | null;
  defaultModel?: string | null;
  defaultProvider?: string | null;
  id: string;
  lastMessagePreview?: string | null;
  messageCount: number;
  title?: string | null;
  updatedAt?: string | null;
}

interface ChatMessageItem {
  content: string;
  createdAt?: string | null;
  id: string;
  model?: string | null;
  provider?: string | null;
  role: 'system' | 'user' | 'assistant' | 'tool' | 'developer';
  status: 'pending' | 'streaming' | 'completed' | 'failed' | 'cancelled' | 'deleted';
}

interface ChatTurnCreateResponse {
  messages: ChatMessageItem[];
  turn: {
    id: string;
  };
}

interface RuntimeInvocationItem {
  completedAt?: string | null;
  createdAt?: string | null;
  id: string;
  model?: string | null;
  provider?: string | null;
  runtime: string;
}

export class ChatService {
  static async fetchSessions(_input: { apiKey?: string } = {}): Promise<ChatSessionSummary[]> {
    const result = await listChatConversations({ pageSize: 100 });
    ensureSdkworkApiSuccess(result, 'Failed to fetch chat conversations');
    return readRequiredApiItems(result, 'Chat conversations response missing items')
      .filter(isRecord)
      .map((item) => mapConversationToSession(item as unknown as ChatConversationItem))
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  }

  static async fetchMessages(input: { apiKey?: string; completionId: string }): Promise<ChatMessage[]> {
    const result = await listChatMessages(input.completionId, {
      limit: 100,
      order: 'asc',
    });
    ensureSdkworkApiSuccess(result, 'Failed to fetch chat messages');
    return readRequiredApiItems(result, 'Chat messages response missing items')
      .filter(isRecord)
      .map((item) => mapChatMessage(item as unknown as ChatMessageItem))
      .filter((message): message is ChatMessage => message !== null);
  }

  static async sendMessage(input: ChatSendInput): Promise<ChatSendResult> {
    const conversation = input.sessionId
      ? await retrieveConversation(input.sessionId)
      : await createConversation(input);

    const turn = await createTurn(conversation.id, input);
    const runtimeInvocation = await createChatRuntimeInvocation({
      conversation,
      input,
      turn,
    });

    let content = '';
    let usage = emptyRuntimeUsageSnapshot();
    try {
      const events = await streamRuntimeEvents(runtimeInvocation.id);
      for await (const event of events) {
        const textDelta = readRuntimeTextDelta(event);
        if (textDelta) {
          content += textDelta;
          emitTextDelta(input, textDelta);
        }
        usage = mergeRuntimeUsageSnapshots(usage, readRuntimeUsageSnapshot(event));
      }
    } catch {
      const failure = {
        errorCode: 'runtime_stream_failed',
        errorMessageMasked: 'Runtime stream failed before completion',
      };
      await failRuntimeInvocation(runtimeInvocation.id, failure);
      await failTurnResponse({
        conversationId: conversation.id,
        failure,
        input,
        invocation: runtimeInvocation,
        turnId: turn.turn.id,
        usage,
      });
      throw new Error('playground.chat.errors.runtimeFailed');
    }

    if (!content.trim()) {
      const failure = {
        errorCode: 'runtime_stream_empty',
        errorMessageMasked: 'Runtime stream completed without assistant output',
      };
      await failRuntimeInvocation(runtimeInvocation.id, failure);
      await failTurnResponse({
        conversationId: conversation.id,
        failure,
        input,
        invocation: runtimeInvocation,
        turnId: turn.turn.id,
        usage,
      });
      throw new Error('playground.chat.errors.runtimeUnavailable');
    }

    const completedInvocation = await completeRuntimeInvocation(runtimeInvocation.id, content, usage);
    const completedUsage = mergeRuntimeUsageSnapshots(usage, readRuntimeUsageSnapshot(completedInvocation));
    const completedTurn = await completeTurnResponse({
      content,
      conversationId: conversation.id,
      input,
      invocation: completedInvocation,
      turnId: turn.turn.id,
      usage: completedUsage,
    });
    const assistantMessage = findTurnMessage(completedTurn, 'assistant');
    const createdAt = parseDate(assistantMessage?.createdAt || completedInvocation.completedAt || completedInvocation.createdAt);

    return {
      assistantMessage: createChatAssistantMessage({
        content,
        modelName: input.selectedModel.name || completedInvocation.model || input.selectedModel.model,
        vendorName: input.selectedModel.vendorName || completedInvocation.provider || undefined,
        createdAt,
      }),
      session: {
        id: conversation.id,
        latestCompletionId: conversation.id,
        title: conversation.title || readSessionTitle(input.messages[0]?.content || input.prompt, conversation.id),
        modelName: input.selectedModel.name || completedInvocation.model || conversation.defaultModel || undefined,
        vendorName: input.selectedModel.vendorName || completedInvocation.provider || conversation.defaultProvider || undefined,
        createdAt: normalizeIsoDate(conversation.createdAt),
        updatedAt: new Date().toISOString(),
        preview: content,
        messageCount: Math.max(conversation.messageCount + 2, input.messages.length + 2),
      },
    };
  }
}

function emitTextDelta(callbacks: RuntimeStreamingCallbacks, textDelta: string): void {
  callbacks.onDelta?.(textDelta);
}

async function createConversation(input: ChatSendInput): Promise<ChatConversationItem> {
  const result = await createChatConversation({
    defaultModel: input.selectedModel.model || input.selectedModel.id,
    defaultProvider: input.selectedModel.vendorCode || input.selectedModel.vendorName,
    metadata: {
      modelCatalogKey: input.selectedModel.catalogKey || input.selectedModel.id,
    },
    sourceSurface: CHAT_SOURCE_SURFACE,
    title: readSessionTitle(input.messages[0]?.content || input.prompt, ''),
  });
  ensureSdkworkApiSuccess(result, 'Failed to create chat conversation');
  const data = readApiRecord(result);
  const item = isRecord(data.item) ? data.item : data;
  if (!isRecord(item) || !readNullableString(item, 'id')) {
    throw new Error('Chat conversation response missing item');
  }
  return item as unknown as ChatConversationItem;
}

async function retrieveConversation(conversationId: string): Promise<ChatConversationItem> {
  const result = await retrieveChatConversation(conversationId);
  ensureSdkworkApiSuccess(result, 'Failed to retrieve chat conversation');
  const data = readApiRecord(result);
  const item = isRecord(data.item) ? data.item : data;
  if (!isRecord(item) || !readNullableString(item, 'id')) {
    throw new Error('Chat conversation response missing item');
  }
  return item as unknown as ChatConversationItem;
}

async function createTurn(
  conversationId: string,
  input: ChatSendInput,
): Promise<ChatTurnCreateResponse> {
  const result = await createChatTurn(
    conversationId,
    {
      message: input.prompt,
      metadata: compactJsonObject({
        routeKeyId: readOptionalInteger(input.selectedApiKeyId),
      }),
      mode: 'chat',
      model: input.selectedModel.model || input.selectedModel.id,
      provider: input.selectedModel.vendorCode || input.selectedModel.vendorName,
    },
  );
  ensureSdkworkApiSuccess(result, 'Failed to create chat turn');
  const data = readApiRecord(result);
  if (!isRecord(data.turn)) {
    throw new Error('Chat turn response missing turn');
  }
  return data as unknown as ChatTurnCreateResponse;
}

async function createChatRuntimeInvocation(
  {
    conversation,
    input,
    turn,
  }: {
    conversation: ChatConversationItem;
    input: ChatSendInput;
    turn: ChatTurnCreateResponse;
  },
): Promise<RuntimeInvocationItem> {
  const routeKeyId = readOptionalInteger(input.selectedApiKeyId);
  const result = await createRuntimeInvocationOperation({
    chatTurnId: turn.turn.id,
    conversationId: conversation.id,
    endpoint: RUNTIME_ENDPOINT,
    invocationType: 'chat_response',
    metadata: compactJsonObject({
      surface: CHAT_SOURCE_SURFACE,
      supportsStreaming: input.selectedModel.supportsStreaming,
    }),
    model: input.selectedModel.model || input.selectedModel.id,
    provider: input.selectedModel.vendorCode || input.selectedModel.vendorName,
    requestJson: {
      messages: toRuntimeMessages(input.messages, input.prompt),
      prompt: input.prompt,
      ...(routeKeyId ? { routeKeyId } : {}),
      selectedModel: input.selectedModel.id,
    },
    runtime: RUNTIME_ADAPTER,
    status: 'streaming',
    streaming: true,
  });
  ensureSdkworkApiSuccess(result, 'Failed to create runtime invocation');
  const data = readApiRecord(result);
  const item = isRecord(data.item) ? data.item : data;
  if (!isRecord(item) || !readNullableString(item, 'id')) {
    throw new Error('Runtime invocation response missing item');
  }
  return item as unknown as RuntimeInvocationItem;
}

async function completeRuntimeInvocation(
  invocationId: string,
  content: string,
  usage: RuntimeUsageSnapshot,
): Promise<RuntimeInvocationItem> {
  const result = await completeRuntimeInvocationOperation(
    invocationId,
    {
      finishReason: 'stop',
      responseJson: { outputText: content },
      status: 'completed',
      usageJson: usage,
    },
  );
  ensureSdkworkApiSuccess(result, 'Failed to complete runtime invocation');
  const data = readApiRecord(result);
  const item = isRecord(data.item) ? data.item : data;
  if (!isRecord(item) || !readNullableString(item, 'id')) {
    throw new Error('Runtime invocation completion response missing item');
  }
  return item as unknown as RuntimeInvocationItem;
}

async function failRuntimeInvocation(
  invocationId: string,
  failure: RuntimeFailure,
): Promise<void> {
  const result = await completeRuntimeInvocationOperation(
    invocationId,
    {
      errorCode: failure.errorCode,
      errorMessageMasked: failure.errorMessageMasked,
      errorType: 'runtime_unavailable',
      status: 'failed',
    },
  );
  ensureSdkworkApiSuccess(result, 'Failed to mark runtime invocation failed');
}

async function failTurnResponse(
  {
    conversationId,
    failure,
    input,
    invocation,
    turnId,
    usage,
  }: {
    conversationId: string;
    failure: RuntimeFailure;
    input: ChatSendInput;
    invocation: RuntimeInvocationItem;
    turnId: string;
    usage: RuntimeUsageSnapshot;
  },
): Promise<void> {
  const result = await completeChatTurnResponse(
    conversationId,
    turnId,
    {
      message: failure.errorMessageMasked,
      metadata: compactJsonObject({
        errorCode: failure.errorCode,
        errorType: 'runtime_unavailable',
        surface: CHAT_SOURCE_SURFACE,
      }),
      model: invocation.model || input.selectedModel.model || input.selectedModel.id,
      provider: invocation.provider || input.selectedModel.vendorCode || input.selectedModel.vendorName,
      runtime: invocation.runtime,
      runtimeInvocationId: invocation.id,
      status: 'failed',
      usage: { ...usage },
    },
    { idempotencyPrefix: 'chat-turn-response-failed' },
  );
  ensureSdkworkApiSuccess(result, 'Failed to mark chat turn response failed');
}

async function completeTurnResponse(
  {
    content,
    conversationId,
    input,
    invocation,
    turnId,
    usage,
  }: {
    content: string;
    conversationId: string;
    input: ChatSendInput;
    invocation: RuntimeInvocationItem;
    turnId: string;
    usage: RuntimeUsageSnapshot;
  },
): Promise<ChatTurnCreateResponse> {
  const result = await completeChatTurnResponse(
    conversationId,
    turnId,
    {
      message: content,
      metadata: {
        surface: CHAT_SOURCE_SURFACE,
      },
      model: invocation.model || input.selectedModel.model || input.selectedModel.id,
      provider: invocation.provider || input.selectedModel.vendorCode || input.selectedModel.vendorName,
      runtime: invocation.runtime,
      runtimeInvocationId: invocation.id,
      status: 'completed',
      usage: { ...usage },
    },
  );
  ensureSdkworkApiSuccess(result, 'Failed to complete chat turn response');
  const data = readApiRecord(result);
  if (!isRecord(data.turn)) {
    throw new Error('Chat turn completion response missing turn');
  }
  return data as unknown as ChatTurnCreateResponse;
}

function mapConversationToSession(item: ChatConversationItem): ChatSessionSummary {
  return {
    id: item.id,
    latestCompletionId: item.id,
    title: item.title || item.id,
    modelName: item.defaultModel || undefined,
    vendorName: item.defaultProvider || undefined,
    createdAt: normalizeIsoDate(item.createdAt),
    updatedAt: normalizeIsoDate(item.updatedAt),
    preview: item.lastMessagePreview || undefined,
    messageCount: item.messageCount,
  };
}

function mapChatMessage(item: ChatMessageItem): ChatMessage | null {
  if (item.role !== 'user' && item.role !== 'assistant') {
    return null;
  }
  return {
    id: item.id,
    role: item.role,
    content: item.content,
    createdAt: normalizeIsoDate(item.createdAt),
    status: mapChatMessageStatus(item.status),
    modelName: item.model || undefined,
    vendorName: item.provider || undefined,
  };
}

function mapChatMessageStatus(status: ChatMessageItem['status']): ChatMessage['status'] {
  switch (status) {
    case 'pending':
    case 'streaming':
      return 'responding';
    case 'failed':
    case 'cancelled':
    case 'deleted':
      return 'failed';
    case 'completed':
    default:
      return 'complete';
  }
}

function findTurnMessage(
  turn: ChatTurnCreateResponse,
  role: 'user' | 'assistant',
): ChatMessageItem | null {
  return turn.messages.find((message) => message.role === role) ?? null;
}

function toRuntimeMessages(messages: ChatMessage[], prompt: string): { role: 'user' | 'assistant'; content: string }[] {
  return [
    ...messages
      .filter((message) => (
        (message.role === 'user' || message.role === 'assistant')
        && (message.status === 'sent' || message.status === 'complete')
        && message.content.trim().length > 0
      ))
      .map((message) => ({ role: message.role, content: message.content })),
    { role: 'user' as const, content: prompt },
  ];
}

function readSessionTitle(value: unknown, fallback: string): string {
  const content = readMessageContent(value);
  if (!content) {
    return fallback || 'New chat';
  }
  return content.length > 60 ? `${content.slice(0, 57).trimEnd()}...` : content;
}

function readMessageContent(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (!Array.isArray(value)) {
    if (!value || typeof value !== 'object') {
      return '';
    }
    const record = value as Record<string, unknown>;
    return readMessageContent(record.text || record.content || record.output_text || record.refusal);
  }
  return value
    .map((part) => {
      if (!part || typeof part !== 'object') {
        return '';
      }
      const record = part as Record<string, unknown>;
      return readMessageContent(record.text || record.output_text || record.refusal || record.content);
    })
    .join('\n')
    .trim();
}

function normalizeIsoDate(value: string | undefined | null): string {
  return parseDate(value).toISOString();
}

function parseDate(value: string | undefined | null): Date {
  const date = new Date(value || Date.now());
  return Number.isFinite(date.getTime()) ? date : new Date();
}

function compactJsonObject(record: Record<string, unknown>): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => (
      typeof value === 'string'
        ? value.trim().length > 0
        : typeof value === 'number' || typeof value === 'boolean'
    )),
  ) as Record<string, string | number | boolean>;
}

function readOptionalInteger(value: string | number | undefined): number | undefined {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : undefined;
  }
  const parsed = Number(String(value ?? '').trim());
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}
