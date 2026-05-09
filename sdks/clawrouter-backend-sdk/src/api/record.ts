import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { OperationRequest, PlusApiResult } from '../types';


export class RecordApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** List logs */
  async fetchLogs(body?: OperationRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/record/list`), body, undefined, undefined, 'application/json');
  }
}

export function createRecordApi(client: HttpClient): RecordApi {
  return new RecordApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
