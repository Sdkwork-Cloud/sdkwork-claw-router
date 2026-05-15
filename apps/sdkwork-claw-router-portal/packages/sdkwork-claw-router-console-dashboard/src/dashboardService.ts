import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readRequiredNonNegativeNumber,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { DashboardOverviewResponse as SdkDashboardOverviewResponse } from '@sdkwork/clawrouter-app-sdk';

export type DashboardTimeRange = 'hourly' | 'daily' | 'monthly' | 'yearly';

export interface DashboardData {
  time: SdkDashboardOverviewResponse['chartData'][number]['time'];
  'llm (Text)': SdkDashboardOverviewResponse['chartData'][number]['llm (Text)'];
  'image (Midjourney/DALL-E)': SdkDashboardOverviewResponse['chartData'][number]['image (Midjourney/DALL-E)'];
  'video (Runway/Sora)': SdkDashboardOverviewResponse['chartData'][number]['video (Runway/Sora)'];
  'audio (Whisper)': SdkDashboardOverviewResponse['chartData'][number]['audio (Whisper)'];
  'music (Suno)': SdkDashboardOverviewResponse['chartData'][number]['music (Suno)'];
}

export interface ModelUsage {
  rank: SdkDashboardOverviewResponse['topModels'][number]['rank'];
  name: SdkDashboardOverviewResponse['topModels'][number]['name'];
  supplier: SdkDashboardOverviewResponse['topModels'][number]['supplier'];
  modality: SdkDashboardOverviewResponse['topModels'][number]['modality'];
  requests: SdkDashboardOverviewResponse['topModels'][number]['requests'];
  cost: SdkDashboardOverviewResponse['topModels'][number]['cost'];
  trend: SdkDashboardOverviewResponse['topModels'][number]['trend'];
  isUp: SdkDashboardOverviewResponse['topModels'][number]['isUp'];
}

type DashboardAnnouncementContract = SdkDashboardOverviewResponse['announcements'][number];
type DashboardAnnouncementTypeContract = {
  type: 'success' | 'info' | 'warning' | 'error' | 'unknown';
};
type DashboardAnnouncementType = DashboardAnnouncementContract['type'] & DashboardAnnouncementTypeContract['type'];

export interface Announcement {
  id: DashboardAnnouncementContract['id'];
  text: DashboardAnnouncementContract['text'];
  time: DashboardAnnouncementContract['time'];
  type: DashboardAnnouncementType;
}

interface DashboardSnapshot {
  summary: SdkDashboardOverviewResponse['summary'];
  requestSparkline: SdkDashboardOverviewResponse['requestSparkline'];
  multimodalSparkline: SdkDashboardOverviewResponse['multimodalSparkline'];
  performanceSparkline: SdkDashboardOverviewResponse['performanceSparkline'];
  chartData: DashboardData[];
  topModels: SdkDashboardOverviewResponse['topModels'];
  announcements: Announcement[];
  warnings: SdkDashboardOverviewResponse['warnings'];
}

const MODALITY_KEYS = {
  text: 'llm (Text)',
  image: 'image (Midjourney/DALL-E)',
  video: 'video (Runway/Sora)',
  audio: 'audio (Whisper)',
  music: 'music (Suno)',
} as const;

const EMPTY_SUMMARY: SdkDashboardOverviewResponse['summary'] = {
  availableCredits: 0,
  usedCredits: 0,
  requestCount: 0,
  errorCount: 0,
  imageRequests: 0,
  videoRequests: 0,
  audioRequests: 0,
  musicRequests: 0,
  rpm: 0,
  tpm: 0,
};

export class DashboardService {
  static emptyDashboardSnapshot(): DashboardSnapshot {
    return {
      summary: { ...EMPTY_SUMMARY },
      requestSparkline: [],
      multimodalSparkline: [],
      performanceSparkline: [],
      chartData: [],
      topModels: [],
      announcements: [],
      warnings: [],
    };
  }

  static async fetchDashboardOverview(timeRange: DashboardTimeRange): Promise<DashboardSnapshot> {
    const client = getClawRouterAppSdkClient();
    const params = buildTimeRangeParams(timeRange);
    const result = await client.ai.dashboard.overview.retrieve(params);

    ensurePlusApiSuccess(result, 'Failed to fetch dashboard overview');
    return normalizeDashboardSnapshot(readApiRecord(result));
  }
}

function buildTimeRangeParams(timeRange: DashboardTimeRange): Record<string, string> {
  const end = new Date();
  const start = new Date(end);
  if (timeRange === 'hourly') {
    start.setHours(end.getHours() - 24);
  } else if (timeRange === 'daily') {
    start.setDate(end.getDate() - 30);
  } else if (timeRange === 'monthly') {
    start.setMonth(end.getMonth() - 12);
  } else {
    start.setFullYear(end.getFullYear() - 3);
  }
  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    timeRange,
  };
}

function normalizeDashboardSnapshot(record: ApiRecord): DashboardSnapshot {
  const chartData = normalizeChartData(record);
  const topModels = normalizeTopModels(record);
  const announcements = normalizeAnnouncements(record);

  return {
    summary: normalizeSummary(recordValue(record, 'summary'), chartData, topModels),
    requestSparkline: normalizeSparkline(record, 'requestSparkline', 'request', chartData, (item) => totalModalityValue(item)),
    multimodalSparkline: normalizeSparkline(record, 'multimodalSparkline', 'multimodal', chartData, (item) => {
      return item[MODALITY_KEYS.image] + item[MODALITY_KEYS.video] + item[MODALITY_KEYS.audio] + item[MODALITY_KEYS.music];
    }),
    performanceSparkline: normalizeSparkline(record, 'performanceSparkline', 'performance', [], () => 0),
    chartData,
    topModels,
    announcements,
    warnings: normalizeWarnings(record),
  };
}

function normalizeChartData(record: ApiRecord): DashboardData[] {
  return readOptionalRecordArray(record, 'chartData', 'Dashboard overview chart record is required')
    .map((value) => {
      const item = readRequiredRecord(value, 'Dashboard overview chart record is required');
      return {
        time: readRequiredFirstString(item, ['time', 'day', 'date', 'period'], 'Dashboard overview chart time is required'),
        [MODALITY_KEYS.text]: readRequiredFirstNumber(item, ['llm (Text)', 'text', 'textRequests', 'request_count'], 'Dashboard overview text requests are required'),
        [MODALITY_KEYS.image]: readRequiredFirstNumber(item, ['image (Midjourney/DALL-E)', 'image', 'imageRequests'], 'Dashboard overview image requests are required'),
        [MODALITY_KEYS.video]: readRequiredFirstNumber(item, ['video (Runway/Sora)', 'video', 'videoRequests'], 'Dashboard overview video requests are required'),
        [MODALITY_KEYS.audio]: readRequiredFirstNumber(item, ['audio (Whisper)', 'audio', 'audioRequests'], 'Dashboard overview audio requests are required'),
        [MODALITY_KEYS.music]: readRequiredFirstNumber(item, ['music (Suno)', 'music', 'musicRequests'], 'Dashboard overview music requests are required'),
      };
    });
}

function normalizeTopModels(record: ApiRecord): ModelUsage[] {
  return readOptionalRecordArray(record, 'topModels', 'Dashboard top model record is required')
    .map((item, index) => {
      const trend = readRequiredFirstString(item, ['trend', 'change'], 'Dashboard top model trend is required');
      return {
        rank: readOptionalFirstNumber(item, ['rank', 'rankNo'], index + 1),
        name: readRequiredFirstString(item, ['name', 'model'], 'Dashboard top model name is required'),
        supplier: readRequiredFirstString(item, ['supplier', 'vendor', 'vendorCode'], 'Dashboard top model supplier is required'),
        modality: normalizeModality(readRequiredFirstString(item, ['modality', 'type'], 'Dashboard top model modality is required')),
        requests: readRequiredFirstNumber(item, ['requests', 'requestCount', 'request_count'], 'Dashboard top model request count is required'),
        cost: readRequiredFirstNumber(item, ['cost', 'costAmount', 'cost_amount'], 'Dashboard top model cost is required'),
        trend,
        isUp: readOptionalBoolean(item, 'isUp', !trend.trim().startsWith('-')),
      };
    })
    .sort((left, right) => right.requests - left.requests)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function normalizeAnnouncements(record: ApiRecord): Announcement[] {
  return readOptionalRecordArray(record, 'announcements', 'Dashboard announcement record is required')
    .map((item) => ({
      id: readRequiredFirstNumber(item, ['id', 'messageId', 'message_id'], 'Dashboard announcement id is required'),
      text: readRequiredFirstString(item, ['text', 'title', 'summary', 'content'], 'Dashboard announcement text is required'),
      time: readRequiredFirstString(item, ['time', 'publishedAt', 'published_at', 'createdAt', 'created_at'], 'Dashboard announcement time is required'),
      type: normalizeAnnouncementType(readRequiredFirstString(item, ['type', 'announcementType', 'messageType', 'message_type'], 'Dashboard announcement type is required')),
    }));
}

function normalizeSummary(
  summaryRecord: ApiRecord,
  chartData: DashboardData[],
  topModels: ModelUsage[],
): SdkDashboardOverviewResponse['summary'] {
  const requestCount =
    readOptionalFirstNumber(summaryRecord, ['requestCount', 'requests', 'totalRequests'], 0) ||
    topModels.reduce((sum, item) => sum + item.requests, 0) ||
    chartData.reduce((sum, item) => sum + totalModalityValue(item), 0);

  return {
    availableCredits: readOptionalFirstNumber(summaryRecord, ['availableCredits', 'balance', 'credits'], 0),
    usedCredits:
      readOptionalFirstNumber(summaryRecord, ['usedCredits', 'cost', 'costAmount'], 0) ||
      chartData.reduce((sum, item) => sum + totalModalityValue(item), 0),
    requestCount,
    errorCount: readOptionalFirstNumber(summaryRecord, ['errorCount', 'errors', 'failedRequests'], 0),
    imageRequests: readOptionalFirstNumber(summaryRecord, ['imageRequests'], 0) || sumChartValue(chartData, MODALITY_KEYS.image),
    videoRequests: readOptionalFirstNumber(summaryRecord, ['videoRequests'], 0) || sumChartValue(chartData, MODALITY_KEYS.video),
    audioRequests: readOptionalFirstNumber(summaryRecord, ['audioRequests'], 0) || sumChartValue(chartData, MODALITY_KEYS.audio),
    musicRequests: readOptionalFirstNumber(summaryRecord, ['musicRequests'], 0) || sumChartValue(chartData, MODALITY_KEYS.music),
    rpm: readOptionalFirstNumber(summaryRecord, ['rpm', 'requestsPerMinute'], 0),
    tpm: readOptionalFirstNumber(summaryRecord, ['tpm', 'tokensPerMinute', 'totalTokens'], 0),
  };
}

function normalizeSparkline(
  record: ApiRecord,
  key: string,
  label: string,
  fallbackItems: DashboardData[],
  fallbackSelector: (item: DashboardData) => number,
): SdkDashboardOverviewResponse['requestSparkline'] {
  const explicit = readOptionalRecordArray(record, key, `Dashboard ${label} sparkline record is required`)
    .map((item) => ({ value: readRequiredNonNegativeNumber(item, 'value', `Dashboard ${label} sparkline value is required`) }));
  if (explicit.length > 0) {
    return explicit;
  }

  return fallbackItems
    .slice(-10)
    .map((item) => ({ value: fallbackSelector(item) }))
    .filter((item) => Number.isFinite(item.value));
}

function normalizeWarnings(record: ApiRecord): string[] {
  const value = record.warnings;
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === 'string' ? item : null))
    .filter((item): item is string => item !== null && item.trim() !== '');
}

function recordValue(record: ApiRecord, key: string): ApiRecord {
  const value = record[key];
  return isRecord(value) ? value : {};
}

function readOptionalFirstNumber(record: ApiRecord, keys: string[], fallback: number): number {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return readRequiredNonNegativeNumber(record, key, `${key} must be a non-negative number`);
    }
  }
  return fallback;
}

function readRequiredFirstString(record: ApiRecord, keys: string[], message: string): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }
  }
  throw new Error(message);
}

function readRequiredFirstNumber(record: ApiRecord, keys: string[], message: string): number {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && record[key] !== '') {
      return readRequiredNonNegativeNumber(record, key, message);
    }
  }
  throw new Error(message);
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

function readOptionalBoolean(record: ApiRecord, key: string, fallback: boolean): boolean {
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
  return fallback;
}

function totalModalityValue(item: DashboardData): number {
  return (
    item[MODALITY_KEYS.text] +
    item[MODALITY_KEYS.image] +
    item[MODALITY_KEYS.video] +
    item[MODALITY_KEYS.audio] +
    item[MODALITY_KEYS.music]
  );
}

function sumChartValue(items: DashboardData[], key: keyof DashboardData): number {
  return items.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

function normalizeModality(value: string): ModelUsage['modality'] {
  const normalized = value.toLowerCase();
  if (normalized === 'unknown') {
    return 'unknown';
  }
  if (normalized === 'image' || normalized.includes('image')) {
    return 'image';
  }
  if (normalized === 'video' || normalized.includes('video')) {
    return 'video';
  }
  if (normalized === 'audio' || normalized.includes('audio') || normalized.includes('speech') || normalized.includes('whisper')) {
    return 'audio';
  }
  if (normalized === 'music' || normalized.includes('music') || normalized.includes('suno')) {
    return 'music';
  }
  if (normalized === 'text' || normalized.includes('text') || normalized.includes('llm')) {
    return 'text';
  }
  return 'unknown';
}

function normalizeAnnouncementType(value: string): Announcement['type'] {
  const normalized = value.toLowerCase();
  if (normalized === 'unknown') {
    return 'unknown';
  }
  if (normalized === 'error' || normalized.includes('error') || normalized.includes('danger')) {
    return 'error';
  }
  if (normalized === 'warning' || normalized.includes('warn')) {
    return 'warning';
  }
  if (normalized === 'success' || normalized.includes('success')) {
    return 'success';
  }
  if (normalized === 'info' || normalized.includes('info')) {
    return 'info';
  }
  return 'unknown';
}
