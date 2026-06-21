import {
  createClientOperationToken,
  ensureSdkworkApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiItems,
  readBoolean,
  readRequiredString,
  readString,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface MessageItem {
  actionUrl: string | null;
  appId: string;
  archived: boolean;
  content: string;
  desc: string;
  id: string;
  popupSeen: boolean;
  read: boolean;
  showAsPopup: boolean;
  time: string;
  title: string;
  type: 'info' | 'billing' | 'warning' | 'alert';
}

export class MessagesService {
  static async fetchMessages(): Promise<MessageItem[]> {
    const result = await getClawRouterAppSdkClient().notification.list({
      includeArchived: false,
      page: '1',
      pageSize: '50',
    });
    ensureSdkworkApiSuccess(result, 'Failed to list messages');
    return readApiItems(result).map(readMessage);
  }

  static async acknowledge(messageId: string): Promise<void> {
    const result = await getClawRouterAppSdkClient().notification.acknowledge.create(messageId, {
      idempotencyKey: createClientOperationToken('console-message-acknowledge'),
    });
    if (result === undefined || result === null) {
      return;
    }
    if (isRecord(result) && Object.keys(result).length === 0) {
      return;
    }
    ensureSdkworkApiSuccess(result, 'Failed to acknowledge message');
  }
}

function readMessage(value: unknown): MessageItem {
  if (!isRecord(value)) {
    throw new Error('Message record is required');
  }

  return {
    id: readRequiredString(value, 'id', 'Notification id is required'),
    appId: readRequiredString(value, 'appId', 'Notification app id is required'),
    title: readRequiredString(value, 'title', 'Notification title is required'),
    desc: readRequiredString(value, 'desc', 'Notification description is required'),
    content: readRequiredString(value, 'content', 'Notification content is required'),
    time: readRequiredString(value, 'time', 'Notification time is required'),
    type: readMessageType(value.type),
    read: readMessageRead(value.read),
    showAsPopup: readBoolean(value, 'showAsPopup', false),
    popupSeen: readBoolean(value, 'popupSeen', false),
    archived: readBoolean(value, 'archived', false),
    actionUrl: readString(value, 'actionUrl') || null,
  };
}

function readMessageType(value: unknown): MessageItem['type'] {
  if (value === 'info' || value === 'billing' || value === 'warning' || value === 'alert') {
    return value;
  }
  const messageType = readString({ value }, 'value');
  throw new Error(messageType ? `Unsupported notification type: ${messageType}` : 'Notification type is required');
}

function readMessageRead(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  throw new Error('Notification read state is required');
}
