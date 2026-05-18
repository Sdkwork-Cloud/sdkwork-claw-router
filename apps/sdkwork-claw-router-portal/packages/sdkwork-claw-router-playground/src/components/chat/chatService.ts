import { getClawRouterAiSdkClient } from 'sdkwork-claw-router-commons/runtime';
import { createChatAssistantMessage } from './chatSession';
import type { ChatMessage, ChatSendInput, ChatSendResult, ChatSessionSummary } from './chatTypes';

type OpenChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ProviderMetadata = Record<string, unknown>;
type StoredChatItem = {
  id: string;
  content?: unknown;
  created?: number;
  created_at?: number;
  metadata?: ProviderMetadata;
  model?: string;
  output?: unknown;
};
type StoredChatMessageItem = {
  id?: string;
  role?: string;
  content?: unknown;
  created?: number;
  created_at?: number;
  model?: string;
};

const CHAT_METADATA_SCOPE = 'playground';
const CHAT_METADATA_KIND = 'chat';

export class ChatService {
  static async fetchSessions(input: { apiKey: string }): Promise<ChatSessionSummary[]> {
    const client = getClawRouterAiSdkClient({ apiKey: input.apiKey });
    const response = await client.chat.completions.list({
      limit: 100,
      order: 'desc',
    });
    const sessions = new Map<string, ChatSessionSummary>();

    response.data.forEach((value) => {
      const item = readStoredChatItem(value);
      if (!item) {
        return;
      }
      const metadata = item.metadata as ProviderMetadata | undefined;
      if (readMetadataString(metadata, CHAT_METADATA_SCOPE) !== CHAT_METADATA_KIND) {
        return;
      }
      const sessionId = readMetadataString(metadata, 'sessionId') || item.id;
      const createdAt = unixSecondsToIso(item.created ?? item.created_at);
      const content = readMessageContent(item.content || item.output);
      const prompt = readMetadataString(metadata, 'prompt');
      const title = readMetadataString(metadata, 'title') || readSessionTitle(prompt || content, sessionId);
      const existing = sessions.get(sessionId);
      const isLatestCompletion = !existing || Date.parse(createdAt) >= Date.parse(existing.updatedAt);

      sessions.set(sessionId, {
        id: sessionId,
        latestCompletionId: isLatestCompletion ? item.id : existing.latestCompletionId,
        title: isLatestCompletion ? title : existing.title,
        modelName: isLatestCompletion ? item.model : existing.modelName,
        createdAt: existing ? minIsoDate(existing.createdAt, createdAt) : createdAt,
        updatedAt: maxIsoDate(existing?.updatedAt, createdAt),
        preview: isLatestCompletion ? content : existing.preview,
        messageCount: (existing?.messageCount ?? 0) + 1,
      });
    });

    return [...sessions.values()].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)).slice(0, 30);
  }

  static async fetchMessages(input: { apiKey: string; completionId: string }): Promise<ChatMessage[]> {
    const client = getClawRouterAiSdkClient({ apiKey: input.apiKey });
    const response = await client.chat.completions.messages.list(input.completionId, {
      limit: 100,
      order: 'asc',
    });
    return response.data
      .map(readStoredChatMessageItem)
      .filter((message): message is StoredChatMessageItem => Boolean(message && (message.role === 'user' || message.role === 'assistant')))
      .map((message, index) => ({
        id: message.id || `${input.completionId}-message-${index}`,
        role: message.role as 'user' | 'assistant',
        content: readMessageContent(message.content),
        createdAt: unixSecondsToIso(message.created ?? message.created_at),
        status: 'complete',
        modelName: message.model,
      }));
  }

  static async sendMessage(input: ChatSendInput): Promise<ChatSendResult> {
    const client = getClawRouterAiSdkClient({ apiKey: input.apiKey });
    const messages: OpenChatMessage[] = [
      ...toOpenChatHistory(input.messages),
      { role: 'user', content: input.prompt },
    ];

    const response = await client.chat.completions.create({
      model: input.selectedModel.id,
      messages,
      store: true,
      metadata: {
        [CHAT_METADATA_SCOPE]: CHAT_METADATA_KIND,
        sessionId: input.sessionId ?? '',
        title: readSessionTitle(input.messages[0]?.content || input.prompt, ''),
        prompt: input.prompt,
      },
    });
    const content = readMessageContent(response.choices[0]?.message.content);
    if (!content) {
      throw new Error('playground.chat.errors.emptyResponse');
    }

    const sessionId = input.sessionId || response.id;

    return {
      assistantMessage: createChatAssistantMessage({
        content,
        modelName: input.selectedModel.name || response.model,
        vendorName: input.selectedModel.vendorName,
        createdAt: new Date(response.created * 1000),
      }),
      session: {
        id: sessionId,
        latestCompletionId: response.id,
        title: readSessionTitle(input.messages[0]?.content || input.prompt, response.id),
        modelName: response.model,
        vendorName: input.selectedModel.vendorName,
        createdAt: unixSecondsToIso(response.created),
        updatedAt: unixSecondsToIso(response.created),
        preview: content,
      },
    };
  }
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
      if (typeof record.text === 'string') {
        return record.text;
      }
      if (typeof record.output_text === 'string') {
        return record.output_text;
      }
      if (typeof record.refusal === 'string') {
        return record.refusal;
      }
      return readMessageContent(record.content);
    })
    .join('\n')
    .trim();
}

function readSessionTitle(value: unknown, fallback: string): string {
  const content = readMessageContent(value);
  if (!content) {
    return fallback;
  }
  return content.length > 60 ? `${content.slice(0, 57).trimEnd()}...` : content;
}

function unixSecondsToIso(value: number | undefined): string {
  const date = new Date((value ?? Date.now() / 1000) * 1000);
  return Number.isFinite(date.getTime()) ? date.toISOString() : new Date().toISOString();
}

function readMetadataString(metadata: ProviderMetadata | undefined, key: string): string {
  const value = metadata?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

function toOpenChatHistory(messages: ChatMessage[]): OpenChatMessage[] {
  return messages
    .filter((message) => (
      (message.role === 'user' || message.role === 'assistant')
      && (message.status === 'sent' || message.status === 'complete')
      && message.content.trim().length > 0
    ))
    .map((message): OpenChatMessage => ({ role: message.role, content: message.content }));
}

function readStoredChatItem(value: unknown): StoredChatItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const record = value as Record<string, unknown>;
  const id = readRecordString(record, 'id');
  if (!id) {
    return null;
  }
  return {
    id,
    content: record.content,
    created: readRecordNumber(record, 'created'),
    created_at: readRecordNumber(record, 'created_at'),
    metadata: readRecordObject(record, 'metadata'),
    model: readRecordString(record, 'model') || undefined,
    output: record.output,
  };
}

function readStoredChatMessageItem(value: unknown): StoredChatMessageItem | null {
  if (!value || typeof value !== 'object') {
    return null;
  }
  const record = value as Record<string, unknown>;
  return {
    id: readRecordString(record, 'id') || undefined,
    role: readRecordString(record, 'role') || undefined,
    content: record.content,
    created: readRecordNumber(record, 'created'),
    created_at: readRecordNumber(record, 'created_at'),
    model: readRecordString(record, 'model') || undefined,
  };
}

function readRecordString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readRecordNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readRecordObject(record: Record<string, unknown>, key: string): ProviderMetadata | undefined {
  const value = record[key];
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as ProviderMetadata;
}

function minIsoDate(left: string, right: string): string {
  return Date.parse(left) <= Date.parse(right) ? left : right;
}

function maxIsoDate(left: string | undefined, right: string): string {
  if (!left) {
    return right;
  }
  return Date.parse(left) >= Date.parse(right) ? left : right;
}
