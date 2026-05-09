import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredString,
  readRequiredNumber,
} from 'sdkwork-claw-router-commons/runtime';
import type { GatewayTrace as SdkGatewayTrace } from '@sdkwork/clawrouter-app-sdk';

export interface GatewayTrace {
  id: SdkGatewayTrace['id'];
  time: SdkGatewayTrace['time'];
  ip: SdkGatewayTrace['ip'];
  endpoint: SdkGatewayTrace['endpoint'];
  method: SdkGatewayTrace['method'];
  status: SdkGatewayTrace['status'];
  duration: SdkGatewayTrace['duration'];
  channel: SdkGatewayTrace['channel'];
}

export class GatewayService {
  static async fetchTraces(): Promise<GatewayTrace[]> {
    const result = await getClawRouterAppSdkClient().router.fetchTraces();
    ensurePlusApiSuccess(result, 'Failed to fetch gateway traces');
    return readRequiredApiItems(result, 'Failed to fetch gateway traces').map(readGatewayTrace);
  }
}

function readGatewayTrace(value: unknown): GatewayTrace {
  const item = readRequiredRecord(value, 'Gateway trace record is required');
  return {
    id: readRequiredString(item, 'id', 'Gateway trace id is required'),
    time: readRequiredString(item, 'time', 'Gateway trace time is required'),
    ip: readRequiredString(item, 'ip', 'Gateway trace IP is required'),
    endpoint: readRequiredString(item, 'endpoint', 'Gateway trace endpoint is required'),
    method: readHttpMethod(item.method),
    status: readRequiredNumber(item, 'status', 'Gateway trace status is required'),
    duration: readRequiredString(item, 'duration', 'Gateway trace duration is required'),
    channel: readRequiredString(item, 'channel', 'Gateway trace channel is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readHttpMethod(value: unknown): GatewayTrace['method'] {
  if (
    value === 'GET'
    || value === 'POST'
    || value === 'PUT'
    || value === 'PATCH'
    || value === 'DELETE'
    || value === 'OPTIONS'
    || value === 'HEAD'
  ) {
    return value;
  }
  throw new Error('Gateway trace method is required');
}
