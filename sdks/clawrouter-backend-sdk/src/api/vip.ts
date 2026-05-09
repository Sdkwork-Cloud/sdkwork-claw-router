import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { OperationRequest, PlusApiResult } from '../types';


export class VipApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** List recharge records */
  async fetchRechargeRecords(body?: OperationRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/vip/recharge/list`), body, undefined, undefined, 'application/json');
  }
}

export function createVipApi(client: HttpClient): VipApi {
  return new VipApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
