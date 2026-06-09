import {
  isRecord,
  readRequiredApiItem,
  readRequiredNonNegativeNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getClawRouterAppSdkClient } from 'sdkwork-clawrouter-pc-commons/sdk-clients';

export interface AccountStats {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  tier: string;
  organization: string;
  availableCredits: number;
  estDaysRemaining: number;
  monthlyConsumption: number;
  consumptionByService: {
    name: string;
    value: number;
    color: string;
    percentage: number;
  }[];
  invoiceSettings: {
    orgFull: string;
    taxId: string;
    paymentMethod: string;
    invoiceType: string;
  };
  security: {
    mfaEnabled: boolean;
    qpsLimit: number;
    ipWhitelistCount: number;
  };
  loginLogs: {
    ip: string;
    location: string;
    device: string;
    time: string;
    status: 'success' | 'warning';
  }[];
}

export class AccountService {
  static async fetchAccountDetails(): Promise<AccountStats> {
    const result = await appAccountsCurrentSummaryRetrieve();
    return normalizeAccountStats(readRequiredApiItem(result, 'console.account.states.loadErrorFallback'));
  }
}

export async function appAccountsCurrentSummaryRetrieve() {
  return getClawRouterAppSdkClient().commerce.accounts.current.summary.retrieve();
}

function normalizeAccountStats(value: ApiRecord): AccountStats {
  return {
    id: readRequiredString(value, 'id', 'Account summary id is required'),
    name: readDisplayString(value, 'name', 'Console account'),
    email: readDisplayString(value, 'email', 'No email bound'),
    isVerified: readRequiredBoolean(value, 'isVerified', 'Account verification status is required'),
    tier: readDisplayString(value, 'tier', 'Standard'),
    organization: readDisplayString(value, 'organization', 'Personal workspace'),
    availableCredits: readRequiredNonNegativeNumber(value, 'availableCredits', 'Account available credits are required'),
    estDaysRemaining: readRequiredNonNegativeNumber(value, 'estDaysRemaining', 'Account estimated days remaining is required'),
    monthlyConsumption: readRequiredNonNegativeNumber(value, 'monthlyConsumption', 'Account monthly consumption is required'),
    consumptionByService: readRequiredRecordArray(value, 'consumptionByService', 'Account consumption record is required')
      .map(normalizeConsumptionItem),
    invoiceSettings: normalizeInvoiceSettings(
      readRequiredRecord(value.invoiceSettings, 'Account invoice settings are required'),
    ),
    security: normalizeSecuritySummary(
      readRequiredRecord(value.security, 'Account security summary is required'),
    ),
    loginLogs: readRequiredRecordArray(value, 'loginLogs', 'Account login log record is required')
      .map(normalizeLoginLog),
  };
}

function normalizeConsumptionItem(value: unknown): AccountStats['consumptionByService'][number] {
  const item = readRequiredRecord(value, 'Account consumption record is required');
  return {
    name: readRequiredString(item, 'name', 'Account consumption service name is required'),
    value: readRequiredNonNegativeNumber(item, 'value', 'Account consumption value is required'),
    color: readDisplayString(item, 'color', 'bg-blue-500'),
    percentage: readOptionalNonNegativeNumber(item, 'percentage'),
  };
}

function normalizeInvoiceSettings(item: ApiRecord): AccountStats['invoiceSettings'] {
  return {
    orgFull: readDisplayString(item, 'orgFull', '-'),
    taxId: readDisplayString(item, 'taxId', '-'),
    paymentMethod: readDisplayString(item, 'paymentMethod', '-'),
    invoiceType: readDisplayString(item, 'invoiceType', '-'),
  };
}

function normalizeSecuritySummary(item: ApiRecord): AccountStats['security'] {
  return {
    mfaEnabled: readRequiredBoolean(item, 'mfaEnabled', 'Account security MFA flag is required'),
    qpsLimit: readOptionalNonNegativeNumber(item, 'qpsLimit'),
    ipWhitelistCount: readOptionalNonNegativeNumber(item, 'ipWhitelistCount'),
  };
}

function normalizeLoginLog(value: unknown): AccountStats['loginLogs'][number] {
  const item = readRequiredRecord(value, 'Account login log record is required');
  return {
    ip: readRequiredString(item, 'ip', 'Account login IP is required'),
    location: readDisplayString(item, 'location', '-'),
    device: readDisplayString(item, 'device', '-'),
    time: readDisplayString(item, 'time', '-'),
    status: readAccountLoginStatus(item),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readRequiredRecordArray(record: ApiRecord, key: string, itemMessage: string): ApiRecord[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(itemMessage);
  }
  return value.map((item) => readRequiredRecord(item, itemMessage));
}

function readRequiredBoolean(record: ApiRecord, key: string, message: string): boolean {
  const value = record[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  throw new Error(message);
}

function readDisplayString(record: ApiRecord, key: string, fallback: string): string {
  const value = readString(record, key).trim();
  return value || fallback;
}

function readAccountLoginStatus(item: ApiRecord): AccountStats['loginLogs'][number]['status'] {
  const status = readString(item, 'status').trim();
  if (status === 'success' || status === 'warning') {
    return status;
  }
  throw new Error(status ? `Unsupported account login status: ${status}` : 'Account login status is required');
}

function readOptionalNonNegativeNumber(record: ApiRecord, key: string): number {
  const value = record[key];
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }
  return number;
}
