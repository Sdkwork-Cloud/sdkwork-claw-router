import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { NotificationsListResult } from '../types';


export class CommunicationNotificationsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** List notifications */
  async list(): Promise<NotificationsListResult> {
    return this.client.get<NotificationsListResult>(appApiPath(`/communication/notifications`));
  }
}

export class CommunicationApi {
  private client: HttpClient;
  public readonly notifications: CommunicationNotificationsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.notifications = new CommunicationNotificationsApi(client);
  }

}

export function createCommunicationApi(client: HttpClient): CommunicationApi {
  return new CommunicationApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
