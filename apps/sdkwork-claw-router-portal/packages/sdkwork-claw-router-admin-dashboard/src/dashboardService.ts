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

export type AdminDashboardTranslator = (key: string, fallback: string, options?: Record<string, unknown>) => string;

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

export interface DashboardSummaryCard {
  label: string;
  value: string;
  detail: string;
}

export class AdminDashboardService {
  static async fetchDashboardData(t: AdminDashboardTranslator): Promise<{
    summaryCards: DashboardSummaryCard[];
    userConsumption: PieChartData[];
    multimodal: PieChartData[];
    traffic: TrafficData[];
    modelDistribution: PieChartData[];
    recentUsage: RecentUsageTrace[];
  }> {
    const result = await getClawRouterBackendSdkClient().system.dashboard.admin.overview.retrieve();
    ensurePlusApiSuccess(result, 'Failed to fetch admin dashboard');
    const data = readApiRecord(result);
    const userConsumption = readRequiredRecordArray(data, 'userConsumption', 'Dashboard userConsumption is required', 'Dashboard pie chart record is required')
      .map(normalizePieChartData);
    const multimodal = readRequiredRecordArray(data, 'multimodal', 'Dashboard multimodal is required', 'Dashboard pie chart record is required')
      .map(normalizePieChartData);
    const traffic = readRequiredRecordArray(data, 'traffic', 'Dashboard traffic is required', 'Dashboard traffic record is required')
      .map(normalizeTrafficData);
    const modelDistribution = readRequiredRecordArray(data, 'modelDistribution', 'Dashboard modelDistribution is required', 'Dashboard pie chart record is required')
      .map(normalizePieChartData);
    const recentUsage = readRequiredRecordArray(data, 'recentUsage', 'Dashboard recentUsage is required', 'Recent usage trace record is required')
      .map(normalizeRecentUsageTrace);
    return {
      summaryCards: createSummaryCards({
        userConsumption,
        multimodal,
        traffic,
        modelDistribution,
        recentUsage,
      }, t),
      userConsumption,
      multimodal,
      traffic,
      modelDistribution,
      recentUsage,
    };
  }

  static async fetchInstallationStatus(): Promise<InstallationStatusResponse> {
    const result = await getClawRouterBackendSdkClient().system.installation.status.retrieve();
    ensurePlusApiSuccess(result, 'Failed to fetch installation status');
    return normalizeInstallationStatus(readApiRecord(result));
  }
}

function normalizePieChartData(value: unknown): PieChartData {
  const item = readRequiredRecord(value, 'Dashboard pie chart record is required');
  return {
    name: readRequiredString(item, 'name', 'Dashboard pie chart name is required'),
    value: readRequiredNonNegativeNumber(item, 'value', 'Dashboard pie chart value is required'),
    color: readRequiredString(item, 'color', 'Dashboard pie chart color is required'),
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

function readRequiredRecordArray(record: ApiRecord, key: string, missingMessage: string, itemMessage: string): ApiRecord[] {
  const value = record[key];
  if (value === undefined || value === null) {
    throw new Error(missingMessage);
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

function createSummaryCards(snapshot: {
  userConsumption: PieChartData[];
  multimodal: PieChartData[];
  traffic: TrafficData[];
  modelDistribution: PieChartData[];
  recentUsage: RecentUsageTrace[];
}, t: AdminDashboardTranslator): DashboardSummaryCard[] {
  const userConsumptionTotal = sumBy(snapshot.userConsumption, (item) => item.value);
  const modelCallTotal = sumBy(snapshot.modelDistribution, (item) => item.value);
  const trafficRequests = sumBy(snapshot.traffic, (item) => item.requests);
  const trafficTokens = sumBy(snapshot.traffic, (item) => item.tokens);
  const trafficCost = sumBy(snapshot.traffic, (item) => item.cost);
  const multimodalTotal = sumBy(snapshot.multimodal, (item) => item.value);
  const successfulUsage = snapshot.recentUsage.filter((item) => item.status.trim().toLowerCase() === 'success').length;
  const failedUsage = snapshot.recentUsage.length - successfulUsage;
  const apiUsage = snapshot.recentUsage.filter((item) => item.isApiUser).length;
  const apiUsageRatio = snapshot.recentUsage.length > 0 ? (apiUsage / snapshot.recentUsage.length) * 100 : 0;
  const averageRequestCost = trafficRequests > 0 ? trafficCost / trafficRequests : 0;

  return [
    {
      label: t('admin.dashboard.summary.activeUsers.label', '活跃用户'),
      value: formatInteger(snapshot.userConsumption.length),
      detail: t('admin.dashboard.summary.activeUsers.detail', '{{amount}} 用户消费', { amount: formatMoney(userConsumptionTotal) }),
    },
    {
      label: t('admin.dashboard.summary.modelCoverage.label', '模型覆盖'),
      value: formatInteger(snapshot.modelDistribution.length),
      detail: t('admin.dashboard.summary.modelCoverage.detail', '{{count}} 次模型调用', { count: formatInteger(modelCallTotal) }),
    },
    {
      label: t('admin.dashboard.summary.totalRequests.label', '总请求'),
      value: formatInteger(trafficRequests),
      detail: t('admin.dashboard.summary.totalRequests.detail', '来自后端 traffic 快照'),
    },
    {
      label: t('admin.dashboard.summary.totalTokens.label', '总 Tokens'),
      value: formatCompactNumber(trafficTokens),
      detail: t('admin.dashboard.summary.totalTokens.detail', '累计计费 {{amount}}', { amount: formatMoney(trafficCost) }),
    },
    {
      label: t('admin.dashboard.summary.modalityCalls.label', '模态调用'),
      value: formatInteger(multimodalTotal),
      detail: t('admin.dashboard.summary.modalityCalls.detail', '{{count}} 个模态', { count: formatInteger(snapshot.multimodal.length) }),
    },
    {
      label: t('admin.dashboard.summary.liveTraces.label', '实时流水'),
      value: formatInteger(snapshot.recentUsage.length),
      detail: t('admin.dashboard.summary.liveTraces.detail', '{{success}} 成功 / {{failed}} 失败', {
        success: formatInteger(successfulUsage),
        failed: formatInteger(failedUsage),
      }),
    },
    {
      label: t('admin.dashboard.summary.recentApiCalls.label', '最近 API 调用'),
      value: formatInteger(apiUsage),
      detail: `${apiUsageRatio.toFixed(1)}% API Key`,
    },
    {
      label: t('admin.dashboard.summary.averageRequestCost.label', '平均单次成本'),
      value: formatMoney(averageRequestCost),
      detail: t('admin.dashboard.summary.averageRequestCost.detail', '按请求数计算'),
    },
  ];
}

function sumBy<T>(items: T[], project: (item: T) => number): number {
  return items.reduce((total, item) => total + project(item), 0);
}

function formatInteger(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatCompactNumber(value: number): string {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) {
    return `${formatCompactUnit(value, 1_000_000_000)}B`;
  }
  if (absolute >= 1_000_000) {
    return `${formatCompactUnit(value, 1_000_000)}M`;
  }
  if (absolute >= 1_000) {
    return `${formatCompactUnit(value, 1_000)}K`;
  }
  return formatInteger(value);
}

function formatCompactUnit(value: number, unit: number): string {
  const normalized = value / unit;
  return Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(1);
}
