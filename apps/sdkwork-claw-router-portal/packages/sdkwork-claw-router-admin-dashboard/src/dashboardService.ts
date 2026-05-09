import {
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readApiRecord,
  readDecimalString,
  readRequiredNonNegativeNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { InstallationStatusResponse } from '@sdkwork/clawrouter-backend-sdk';

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface TrafficData {
  time: string;
  tokens: number;
  requests: number;
  cost: number;
}

export interface RecentUsageTrace {
  id: string;
  user: string;
  isApiUser: boolean;
  model: string;
  type: string;
  billingMode: string;
  usageIn?: number;
  usageOut?: number;
  usageCount?: number;
  time: string;
  status: string;
  cost: string;
}

export class AdminDashboardService {
  static generateTrafficData(timeRange: string, granularity: string): TrafficData[] {
    const data: TrafficData[] = [];
    const pointCount = granularity === '按分钟' ? 24 : granularity === '按小时' ? 24 : granularity === '按周' ? 12 : 30;
    const base = timeRange === '今日' || timeRange === '昨日' ? 1 : timeRange === '本周' ? 4 : timeRange === '本月' ? 12 : 24;

    for (let index = 0; index < pointCount; index += 1) {
      const wave = Math.sin(index * 0.7) * 0.25 + Math.cos(index * 0.21) * 0.15 + 1;
      const tokens = Math.max(10, Math.floor(12000 * base * wave * (1 + index / (pointCount * 2))));
      data.push({
        time: formatTrafficLabel(index, granularity),
        tokens,
        requests: Math.max(1, Math.floor(tokens / 100)),
        cost: Number(((tokens / 1000) * 0.012).toFixed(2)),
      });
    }

    return data.length > 0 ? data : [{ time: 'N/A', tokens: 0, requests: 0, cost: 0 }];
  }

  static async fetchDashboardData(): Promise<{
    userConsumption: PieChartData[];
    multimodal: PieChartData[];
    traffic: TrafficData[];
    modelDistribution: PieChartData[];
    recentUsage: RecentUsageTrace[];
  }> {
    const result = await getClawRouterBackendSdkClient().dashboard.fetchDashboardData();
    ensurePlusApiSuccess(result, 'Failed to fetch admin dashboard');
    const data = readApiRecord(result);
    return {
      userConsumption: readOptionalRecordArray(data, 'userConsumption', 'Dashboard pie chart record is required').map(normalizePieChartData),
      multimodal: readOptionalRecordArray(data, 'multimodal', 'Dashboard pie chart record is required').map(normalizePieChartData),
      traffic: readOptionalRecordArray(data, 'traffic', 'Dashboard traffic record is required').map(normalizeTrafficData),
      modelDistribution: readOptionalRecordArray(data, 'modelDistribution', 'Dashboard pie chart record is required').map(normalizePieChartData),
      recentUsage: readOptionalRecordArray(data, 'recentUsage', 'Recent usage trace record is required').map(normalizeRecentUsageTrace),
    };
  }

  static async fetchInstallationStatus(): Promise<InstallationStatusResponse> {
    const result = await getClawRouterBackendSdkClient().system.fetchInstallationStatus();
    ensurePlusApiSuccess(result, 'Failed to fetch installation status');
    return normalizeInstallationStatus(readApiRecord(result));
  }
}

function formatTrafficLabel(index: number, granularity: string): string {
  if (granularity === '按分钟') {
    const minutes = index * 15;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  }
  if (granularity === '按小时') {
    return `${String(index).padStart(2, '0')}:00`;
  }
  if (granularity === '按周') {
    return `W${index + 1}`;
  }
  if (granularity === '按月') {
    return `${index + 1}月`;
  }
  return `${String(index + 1).padStart(2, '0')}`;
}

function normalizePieChartData(value: unknown): PieChartData {
  const item = readRequiredRecord(value, 'Dashboard pie chart record is required');
  return {
    name: readRequiredString(item, 'name', 'Dashboard pie chart name is required'),
    value: readRequiredNonNegativeNumber(item, 'value', 'Dashboard pie chart value is required'),
    color: readString(item, 'color', '#64748b'),
  };
}

function normalizeTrafficData(value: unknown): TrafficData {
  const item = readRequiredRecord(value, 'Dashboard traffic record is required');
  return {
    time: readRequiredString(item, 'time', 'Dashboard traffic time is required'),
    tokens: readRequiredNonNegativeNumber(item, 'tokens', 'Dashboard traffic tokens are required'),
    requests: readRequiredNonNegativeNumber(item, 'requests', 'Dashboard traffic requests are required'),
    cost: readRequiredNonNegativeNumber(item, 'cost', 'Dashboard traffic cost is required'),
  };
}

function normalizeRecentUsageTrace(value: unknown): RecentUsageTrace {
  const item = readRequiredRecord(value, 'Recent usage trace record is required');
  return {
    id: readRequiredString(item, 'id', 'Recent usage trace id is required'),
    user: readRequiredString(item, 'user', 'Recent usage trace user is required'),
    isApiUser: readRequiredBoolean(item, 'isApiUser', 'Recent usage trace API user flag is required'),
    model: readRequiredString(item, 'model', 'Recent usage trace model is required'),
    type: readRequiredString(item, 'type', 'Recent usage trace type is required'),
    billingMode: readRequiredString(item, 'billingMode', 'Recent usage trace billing mode is required'),
    usageIn: optionalNumber(item, 'usageIn', 'Recent usage trace input usage is invalid'),
    usageOut: optionalNumber(item, 'usageOut', 'Recent usage trace output usage is invalid'),
    usageCount: optionalNumber(item, 'usageCount', 'Recent usage trace usage count is invalid'),
    time: readRequiredString(item, 'time', 'Recent usage trace time is required'),
    status: readRequiredString(item, 'status', 'Recent usage trace status is required'),
    cost: readRequiredDecimalString(
      item,
      'cost',
      'Recent usage trace cost is required',
      'Recent usage trace cost must be a decimal string',
    ),
  };
}

function optionalNumber(item: ApiRecord, key: string, message: string): number | undefined {
  const value = item[key];
  return value === undefined || value === null || value === ''
    ? undefined
    : readRequiredNonNegativeNumber(item, key, message);
}

function readOptionalRecordArray(record: ApiRecord, key: string, itemMessage: string): ApiRecord[] {
  const value = record[key];
  if (value === undefined || value === null) {
    return [];
  }
  if (!Array.isArray(value)) {
    throw new Error(`${key} must be an array`);
  }
  return value.map((item) => readRequiredRecord(item, itemMessage));
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredBoolean(record: ApiRecord, key: string, message: string): boolean {
  const value = record[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  throw new Error(message);
}

function normalizeInstallationStatus(record: ApiRecord): InstallationStatusResponse {
  const status = readRequiredString(record, 'status', 'Installation status is required');
  if (!['not_installed', 'installed', 'upgrade_required', 'incomplete', 'corrupt'].includes(status)) {
    throw new Error('Installation status is invalid');
  }
  return {
    status: status as InstallationStatusResponse['status'],
    schemaVersion: readRequiredString(record, 'schemaVersion', 'Installation schema version is required'),
    catalogVersion: readRequiredString(record, 'catalogVersion', 'Installation catalog version is required'),
    catalogSource: readRequiredString(record, 'catalogSource', 'Installation catalog source is required'),
    externalCatalog: readRequiredBoolean(record, 'externalCatalog', 'Installation external catalog flag is required'),
    lastCatalogRefreshStatus: readInstallationRefreshStatus(record),
    environment: readRequiredString(record, 'environment', 'Installation environment is required'),
    seedProfile: readRequiredString(record, 'seedProfile', 'Installation seed profile is required'),
    changed: readRequiredBoolean(record, 'changed', 'Installation changed flag is required'),
  };
}

function readInstallationRefreshStatus(record: ApiRecord): InstallationStatusResponse['lastCatalogRefreshStatus'] {
  const status = readRequiredString(record, 'lastCatalogRefreshStatus', 'Installation catalog refresh status is required');
  if (!['not_run', 'success', 'dry_run', 'failed'].includes(status)) {
    throw new Error('Installation catalog refresh status is invalid');
  }
  return status as InstallationStatusResponse['lastCatalogRefreshStatus'];
}

function readRequiredDecimalString(
  record: ApiRecord,
  key: string,
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = record[key];
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(missingMessage);
  }
  const normalized = String(value).trim();
  if (!normalized) {
    throw new Error(missingMessage);
  }
  if (!/^-?\d+(?:\.\d{1,6})?$/.test(normalized)) {
    throw new Error(invalidMessage);
  }
  return readDecimalString(record, key);
}
