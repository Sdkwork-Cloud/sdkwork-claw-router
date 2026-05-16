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
    summary: normalizeSummary(readRequiredRecordProperty(record, 'summary', 'Dashboard overview summary is required')),
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
  return readRequiredRecordArray(record, 'chartData', 'Dashboard overview chartData is required', 'Dashboard overview chart record is required')
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
  return readRequiredRecordArray(record, 'topModels', 'Dashboard overview topModels is required', 'Dashboard top model record is required')
    .map((item) => {
      const trend = readRequiredFirstString(item, ['trend', 'change'], 'Dashboard top model trend is required');
      return {
        rank: readRequiredPositiveRank(item, ['rank', 'rankNo'], 'Dashboard top model rank is required'),
        name: readRequiredFirstString(item, ['name', 'model'], 'Dashboard top model name is required'),
        supplier: readRequiredFirstString(item, ['supplier', 'vendor', 'vendorCode'], 'Dashboard top model supplier is required'),
        modality: normalizeModality(readRequiredFirstString(item, ['modality', 'type'], 'Dashboard top model modality is required')),
        requests: readRequiredFirstNumber(item, ['requests', 'requestCount', 'request_count'], 'Dashboard top model request count is required'),
        cost: readRequiredFirstNumber(item, ['cost', 'costAmount', 'cost_amount'], 'Dashboard top model cost is required'),
        trend,
        isUp: readRequiredBoolean(item, 'isUp', 'Dashboard top model direction flag is required'),
      };
    })
    .sort((left, right) => left.rank - right.rank);
}

function normalizeAnnouncements(record: ApiRecord): Announcement[] {
  return readRequiredRecordArray(record, 'announcements', 'Dashboard overview announcements is required', 'Dashboard announcement record is required')
    .map((item) => ({
      id: readRequiredFirstNumber(item, ['id', 'messageId', 'message_id'], 'Dashboard announcement id is required'),
      text: readRequiredFirstString(item, ['text', 'title', 'summary', 'content'], 'Dashboard announcement text is required'),
      time: readRequiredFirstString(item, ['time', 'publishedAt', 'published_at', 'createdAt', 'created_at'], 'Dashboard announcement time is required'),
      type: normalizeAnnouncementType(readRequiredFirstString(item, ['type', 'announcementType', 'messageType', 'message_type'], 'Dashboard announcement type is required')),
    }));
}

function normalizeSummary(summaryRecord: ApiRecord): SdkDashboardOverviewResponse['summary'] {
  return {
    availableCredits: readRequiredFirstNumber(summaryRecord, ['availableCredits', 'balance', 'credits'], 'Dashboard overview available credits are required'),
    usedCredits: readRequiredFirstNumber(summaryRecord, ['usedCredits', 'cost', 'costAmount'], 'Dashboard overview used credits are required'),
    requestCount: readRequiredFirstNumber(summaryRecord, ['requestCount', 'requests', 'totalRequests'], 'Dashboard overview request count is required'),
    errorCount: readRequiredFirstNumber(summaryRecord, ['errorCount', 'errors', 'failedRequests'], 'Dashboard overview error count is required'),
    imageRequests: readRequiredFirstNumber(summaryRecord, ['imageRequests'], 'Dashboard overview image requests are required'),
    videoRequests: readRequiredFirstNumber(summaryRecord, ['videoRequests'], 'Dashboard overview video requests are required'),
    audioRequests: readRequiredFirstNumber(summaryRecord, ['audioRequests'], 'Dashboard overview audio requests are required'),
    musicRequests: readRequiredFirstNumber(summaryRecord, ['musicRequests'], 'Dashboard overview music requests are required'),
    rpm: readRequiredFirstNumber(summaryRecord, ['rpm', 'requestsPerMinute'], 'Dashboard overview RPM is required'),
    tpm: readRequiredFirstNumber(summaryRecord, ['tpm', 'tokensPerMinute', 'totalTokens'], 'Dashboard overview TPM is required'),
  };
}

function normalizeSparkline(
  record: ApiRecord,
  key: string,
  label: string,
  fallbackItems: DashboardData[],
  fallbackSelector: (item: DashboardData) => number,
): SdkDashboardOverviewResponse['requestSparkline'] {
  const explicit = readRequiredRecordArray(
    record,
    key,
    `Dashboard overview ${key} is required`,
    `Dashboard ${label} sparkline record is required`,
  )
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
    throw new Error('Dashboard overview warnings is required');
  }
  return value
    .map((item) => (typeof item === 'string' ? item : null))
    .filter((item): item is string => item !== null && item.trim() !== '');
}

function readRequiredRecordProperty(record: ApiRecord, key: string, message: string): ApiRecord {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
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

function readRequiredPositiveRank(record: ApiRecord, keys: string[], message: string): number {
  const rank = readRequiredFirstNumber(record, keys, message);
  if (!Number.isSafeInteger(rank) || rank < 1) {
    throw new Error(message);
  }
  return rank;
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

function totalModalityValue(item: DashboardData): number {
  return (
    item[MODALITY_KEYS.text] +
    item[MODALITY_KEYS.image] +
    item[MODALITY_KEYS.video] +
    item[MODALITY_KEYS.audio] +
    item[MODALITY_KEYS.music]
  );
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
