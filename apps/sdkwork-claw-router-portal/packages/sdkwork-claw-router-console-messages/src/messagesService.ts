import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  readString,
} from 'sdkwork-claw-router-commons/runtime';
import type { Message as SdkMessage } from '@sdkwork/clawrouter-app-sdk';

export interface Message {
  id: SdkMessage['id'];
  title: SdkMessage['title'];
  desc: SdkMessage['desc'];
  content: SdkMessage['content'];
  time: SdkMessage['time'];
  type: SdkMessage['type'];
  read: SdkMessage['read'];
}

export class MessagesService {
  static async fetchMessages(): Promise<Message[]> {
    const result = await getClawRouterAppSdkClient().communication.notifications.list();
    ensurePlusApiSuccess(result, 'Failed to fetch messages');
    return readRequiredApiItems(result, 'Failed to fetch messages').map(readMessage);
  }
}

function readMessage(value: unknown): Message {
  if (!isRecord(value)) {
    throw new Error('Message record is required');
  }

  return {
    id: readRequiredString(value, 'id', 'Message id is required'),
    title: readRequiredString(value, 'title', 'Message title is required'),
    desc: readRequiredString(value, 'desc', 'Message description is required'),
    content: readRequiredString(value, 'content', 'Message content is required'),
    time: readRequiredString(value, 'time', 'Message time is required'),
    type: readMessageType(value.type),
    read: readMessageRead(value.read),
  };
}

function readMessageType(value: unknown): Message['type'] {
  if (value === 'info' || value === 'billing' || value === 'warning' || value === 'alert') {
    return value;
  }
  const messageType = readString({ value }, 'value');
  throw new Error(messageType ? `Unsupported message type: ${messageType}` : 'Message type is required');
}

function readMessageRead(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error('Message read state is required');
}
