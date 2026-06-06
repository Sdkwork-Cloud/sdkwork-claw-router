import { appApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { RechargesSettingsRetrieveResult } from '../types';


export class CommerceRechargesSettingsApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }


/** Recharges Settings Retrieve */
  async retrieve(): Promise<RechargesSettingsRetrieveResult> {
    return this.client.get<RechargesSettingsRetrieveResult>(appApiPath(`/recharges/settings`));
  }
}

export class CommerceRechargesApi {
  private client: HttpClient;
  public readonly settings: CommerceRechargesSettingsApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.settings = new CommerceRechargesSettingsApi(client);
  }

}

export class CommerceApi {
  private client: HttpClient;
  public readonly recharges: CommerceRechargesApi;

  constructor(client: HttpClient) {
    this.client = client;
    this.recharges = new CommerceRechargesApi(client);
  }

}

export function createCommerceApi(client: HttpClient): CommerceApi {
  return new CommerceApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
