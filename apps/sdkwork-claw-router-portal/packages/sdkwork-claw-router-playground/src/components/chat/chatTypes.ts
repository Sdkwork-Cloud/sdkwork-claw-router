import type { ApiKey } from 'sdkwork-claw-router-console-api-keys';
import type { PlaygroundModelOption } from '../../playgroundTypes';

export type ChatRole = 'user' | 'assistant';

export type ChatMessageStatus = 'sent' | 'responding' | 'complete' | 'failed';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  status: ChatMessageStatus;
  modelName?: string;
  vendorName?: string;
}

export interface ChatSessionSummary {
  id: string;
  latestCompletionId: string;
  title: string;
  modelName?: string;
  vendorName?: string;
  createdAt: string;
  updatedAt: string;
  preview?: string;
  messageCount?: number;
}

export interface ChatApiKeyOption {
  id: ApiKey['id'];
  name: ApiKey['name'];
  displayName: ApiKey['displayName'];
  maskedKey: ApiKey['maskedKey'];
  copyableKey: ApiKey['copyableKey'];
  group: ApiKey['group'];
  groupName: ApiKey['groupName'];
  status: ApiKey['status'];
}

export interface SimpleChatInputSubmit {
  prompt: string;
  selectedModelId: string;
  selectedApiKeyId: string;
  apiKey: string;
}

export interface ChatSendInput {
  apiKey: string;
  messages: ChatMessage[];
  prompt: string;
  selectedModel: PlaygroundModelOption;
  sessionId?: string;
}

export interface ChatSendResult {
  assistantMessage: ChatMessage;
  session: ChatSessionSummary;
}
