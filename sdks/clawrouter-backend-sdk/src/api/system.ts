import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { FetchInstallationStatusResult } from '../types';


export class SystemApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** List installation status */
  async fetchInstallationStatus(): Promise<FetchInstallationStatusResult> {
    return this.client.get<FetchInstallationStatusResult>(backendApiPath(`/system/installation/status`));
  }
}

export function createSystemApi(client: HttpClient): SystemApi {
  return new SystemApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
