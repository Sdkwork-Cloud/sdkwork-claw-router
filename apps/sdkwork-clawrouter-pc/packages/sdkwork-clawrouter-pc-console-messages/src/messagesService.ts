import {
  NotificationService,
  type NotificationItem,
} from 'sdkwork-clawrouter-pc-commons/runtime';

export type Message = NotificationItem;

export class MessagesService {
  static fetchMessages(): Promise<Message[]> {
    return NotificationService.fetchNotifications();
  }

  static acknowledge(messageId: string): Promise<void> {
    return NotificationService.acknowledge(messageId);
  }
}
