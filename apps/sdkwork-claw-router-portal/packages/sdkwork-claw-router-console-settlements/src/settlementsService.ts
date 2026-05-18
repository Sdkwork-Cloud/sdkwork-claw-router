import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readDecimalString,
  readRequiredApiItems,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { SettlementDashboardResponse as SdkSettlementDashboardResponse } from '@sdkwork/clawrouter-app-sdk';

const MIN_SETTLEMENT_DASHBOARD_YEAR = 2000;
const MAX_SETTLEMENT_DASHBOARD_YEAR = 2100;

type SettlementBillSdkContract = {
  breakdown: SdkSettlementDashboardResponse['bills'][number]['breakdown'];
};

export interface SettlementChartData {
  day: SdkSettlementDashboardResponse['chartData'][number]['day'];
  text: string & SdkSettlementDashboardResponse['chartData'][number]['text'];
  image: string & SdkSettlementDashboardResponse['chartData'][number]['image'];
  video: string & SdkSettlementDashboardResponse['chartData'][number]['video'];
  audio: string & SdkSettlementDashboardResponse['chartData'][number]['audio'];
  music: string & SdkSettlementDashboardResponse['chartData'][number]['music'];
}

export interface BillBreakdownItem {
  cost: string & SdkSettlementDashboardResponse['bills'][number]['breakdown']['text']['cost'];
  usage: SdkSettlementDashboardResponse['bills'][number]['breakdown']['text']['usage'];
  models: SdkSettlementDashboardResponse['bills'][number]['breakdown']['text']['models'];
}

export interface Bill {
  id: SdkSettlementDashboardResponse['bills'][number]['id'];
  period: SdkSettlementDashboardResponse['bills'][number]['period'];
  startDate: SdkSettlementDashboardResponse['bills'][number]['startDate'];
  endDate: SdkSettlementDashboardResponse['bills'][number]['endDate'];
  totalTokens: SdkSettlementDashboardResponse['bills'][number]['totalTokens'];
  totalCost: string & SdkSettlementDashboardResponse['bills'][number]['totalCost'];
  status: SdkSettlementDashboardResponse['bills'][number]['status'];
  breakdown: {
    text: BillBreakdownItem;
    image: BillBreakdownItem;
    video: BillBreakdownItem;
    audio: BillBreakdownItem;
    music: BillBreakdownItem;
  } & SettlementBillSdkContract['breakdown'];
}

type SettlementDashboardData = {
  chartData: SettlementChartData[];
  bills: Bill[];
};

export class SettlementsService {
  static async fetchDashboardData(params?: Record<string, unknown>): Promise<SettlementDashboardData> {
    const result = await getClawRouterAppSdkClient().billing.settlements.dashboard.list(
      toSettlementDashboardQueryParams(params),
    );
    ensurePlusApiSuccess(result, 'console.settlements.states.loadErrorFallback');
    const data = readApiRecord(result);
    return {
      chartData: readRequiredApiItems(data, 'Settlement chart data is required', ['chartData'])
        .map(normalizeSettlementChartData),
      bills: readRequiredApiItems(data, 'Settlement bills are required', ['bills'])
        .map(normalizeBill),
    };
  }
}

function toSettlementDashboardQueryParams(params: Record<string, unknown> = {}): { year?: number } {
  return {
    year: optionalSettlementDashboardYear(params.year),
  };
}

function optionalSettlementDashboardYear(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = typeof value === 'string' ? value.trim() : value;
  if (normalized === '') {
    return undefined;
  }
  if (typeof normalized !== 'number' && typeof normalized !== 'string') {
    throw new Error('year must be an integer');
  }
  const year = Number(normalized);
  if (!Number.isInteger(year)) {
    throw new Error('year must be an integer');
  }
  if (year < MIN_SETTLEMENT_DASHBOARD_YEAR || year > MAX_SETTLEMENT_DASHBOARD_YEAR) {
    throw new Error(`year must be between ${MIN_SETTLEMENT_DASHBOARD_YEAR} and ${MAX_SETTLEMENT_DASHBOARD_YEAR}`);
  }
  return year;
}

function normalizeSettlementChartData(value: unknown): SettlementChartData {
  const item = readRequiredRecord(value, 'Settlement chart record is required');
  return {
    day: readRequiredString(item, 'day', 'Settlement chart day is required'),
    text: readRequiredDecimalString(
      item,
      'text',
      'Settlement chart text is required',
      'Settlement chart text must be a decimal string',
    ),
    image: readRequiredDecimalString(
      item,
      'image',
      'Settlement chart image is required',
      'Settlement chart image must be a decimal string',
    ),
    video: readRequiredDecimalString(
      item,
      'video',
      'Settlement chart video is required',
      'Settlement chart video must be a decimal string',
    ),
    audio: readRequiredDecimalString(
      item,
      'audio',
      'Settlement chart audio is required',
      'Settlement chart audio must be a decimal string',
    ),
    music: readRequiredDecimalString(
      item,
      'music',
      'Settlement chart music is required',
      'Settlement chart music must be a decimal string',
    ),
  };
}

function normalizeBill(value: unknown): Bill {
  const item = readRequiredRecord(value, 'Settlement bill record is required');
  const breakdown = readRequiredRecord(item.breakdown, 'Settlement bill breakdown is required');
  return {
    id: readRequiredString(item, 'id', 'Settlement bill id is required'),
    period: readRequiredString(item, 'period', 'Settlement bill period is required'),
    startDate: readRequiredString(item, 'startDate', 'Settlement bill start date is required'),
    endDate: readRequiredString(item, 'endDate', 'Settlement bill end date is required'),
    totalTokens: readRequiredString(item, 'totalTokens', 'Settlement bill total tokens are required'),
    totalCost: readRequiredDecimalString(
      item,
      'totalCost',
      'Settlement bill total cost is required',
      'Settlement bill total cost must be a decimal string',
    ),
    status: readRequiredString(item, 'status', 'Settlement bill status is required'),
    breakdown: {
      text: normalizeBreakdown(breakdown.text, 'text'),
      image: normalizeBreakdown(breakdown.image, 'image'),
      video: normalizeBreakdown(breakdown.video, 'video'),
      audio: normalizeBreakdown(breakdown.audio, 'audio'),
      music: normalizeBreakdown(breakdown.music, 'music'),
    },
  };
}

function normalizeBreakdown(value: unknown, label: string): BillBreakdownItem {
  const item = readRequiredRecord(value, `Settlement ${label} breakdown is required`);
  return {
    cost: readRequiredDecimalString(
      item,
      'cost',
      `Settlement ${label} breakdown cost is required`,
      `Settlement ${label} breakdown cost must be a decimal string`,
    ),
    usage: readRequiredString(item, 'usage', `Settlement ${label} breakdown usage is required`),
    models: readRequiredStringArray(item, 'models', 'Settlement breakdown models must be strings'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredStringArray(record: ApiRecord, key: string, message: string): string[] {
  const value = record[key];
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new Error(message);
  }
  return [...value];
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
