import {
  NotificationService,
  type NotificationItem,
} from 'sdkwork-claw-router-commons/runtime';

export type Message = NotificationItem;

export class MessagesService {
  static fetchMessages(): Promise<Message[]> {
    return NotificationService.fetchNotifications();
  }
}
