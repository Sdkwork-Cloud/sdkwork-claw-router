import {
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readRequiredNonNegativeNumber,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { AccountSummaryResponse as SdkAccountSummaryResponse } from '@sdkwork/clawrouter-app-sdk';

export interface AccountStats {
  id: SdkAccountSummaryResponse['id'];
  name: SdkAccountSummaryResponse['name'];
  email: SdkAccountSummaryResponse['email'];
  isVerified: SdkAccountSummaryResponse['isVerified'];
  tier: SdkAccountSummaryResponse['tier'];
  organization: SdkAccountSummaryResponse['organization'];
  availableCredits: SdkAccountSummaryResponse['availableCredits'];
  estDaysRemaining: SdkAccountSummaryResponse['estDaysRemaining'];
  monthlyConsumption: SdkAccountSummaryResponse['monthlyConsumption'];
  consumptionByService: {
    name: SdkAccountSummaryResponse['consumptionByService'][number]['name'];
    value: SdkAccountSummaryResponse['consumptionByService'][number]['value'];
    color: SdkAccountSummaryResponse['consumptionByService'][number]['color'];
    percentage: SdkAccountSummaryResponse['consumptionByService'][number]['percentage'];
  }[];
  invoiceSettings: {
    orgFull: SdkAccountSummaryResponse['invoiceSettings']['orgFull'];
    taxId: SdkAccountSummaryResponse['invoiceSettings']['taxId'];
    paymentMethod: SdkAccountSummaryResponse['invoiceSettings']['paymentMethod'];
    invoiceType: SdkAccountSummaryResponse['invoiceSettings']['invoiceType'];
  };
  security: {
    mfaEnabled: SdkAccountSummaryResponse['security']['mfaEnabled'];
    qpsLimit: SdkAccountSummaryResponse['security']['qpsLimit'];
    ipWhitelistCount: SdkAccountSummaryResponse['security']['ipWhitelistCount'];
  };
  loginLogs: {
    ip: SdkAccountSummaryResponse['loginLogs'][number]['ip'];
    location: SdkAccountSummaryResponse['loginLogs'][number]['location'];
    device: SdkAccountSummaryResponse['loginLogs'][number]['device'];
    time: SdkAccountSummaryResponse['loginLogs'][number]['time'];
    status: SdkAccountSummaryResponse['loginLogs'][number]['status'];
  }[];
}

export class AccountService {
  static async fetchAccountDetails(): Promise<AccountStats> {
    const result = await getClawRouterAppSdkClient().billing.account.summary.retrieve();
    ensurePlusApiSuccess(result, 'console.account.states.loadErrorFallback');
    return normalizeAccountStats(readApiRecord(result));
  }
}

function normalizeAccountStats(data: ApiRecord): AccountStats {
  return {
    id: readRequiredString(data, 'id', 'Account summary response missing data'),
    name: readRequiredString(data, 'name', 'Account name is required'),
    email: readRequiredString(data, 'email', 'Account summary response missing data'),
    isVerified: readRequiredBoolean(data, 'isVerified', 'Account verification status is required'),
    tier: readRequiredString(data, 'tier', 'Account tier is required'),
    organization: readRequiredString(data, 'organization', 'Account organization is required'),
    availableCredits: readRequiredNonNegativeNumber(data, 'availableCredits', 'Account available credits are required'),
    estDaysRemaining: readRequiredNonNegativeNumber(data, 'estDaysRemaining', 'Account estimated days remaining is required'),
    monthlyConsumption: readRequiredNonNegativeNumber(data, 'monthlyConsumption', 'Account monthly consumption is required'),
    consumptionByService: readRequiredRecordArray(data, 'consumptionByService', 'Account consumption record is required').map(normalizeConsumptionItem),
    invoiceSettings: normalizeInvoiceSettings(data.invoiceSettings),
    security: normalizeSecuritySummary(data.security),
    loginLogs: readRequiredRecordArray(data, 'loginLogs', 'Account login log record is required').map(normalizeLoginLog),
  };
}

function normalizeConsumptionItem(value: unknown): AccountStats['consumptionByService'][number] {
  const item = readRequiredRecord(value, 'Account consumption record is required');
  return {
    name: readRequiredString(item, 'name', 'Account consumption service name is required'),
    value: readRequiredNonNegativeNumber(item, 'value', 'Account consumption value is required'),
    color: readRequiredString(item, 'color', 'Account consumption color is required'),
    percentage: readRequiredNonNegativeNumber(item, 'percentage', 'Account consumption percentage is required'),
  };
}

function normalizeInvoiceSettings(value: unknown): AccountStats['invoiceSettings'] {
  const record = readRequiredRecord(value, 'Account invoice settings are required');
  return {
    orgFull: readRequiredString(record, 'orgFull', 'Account invoice organization is required'),
    taxId: readRequiredString(record, 'taxId', 'Account invoice tax id is required'),
    paymentMethod: readRequiredString(record, 'paymentMethod', 'Account invoice payment method is required'),
    invoiceType: readRequiredString(record, 'invoiceType', 'Account invoice type is required'),
  };
}

function normalizeSecuritySummary(value: unknown): AccountStats['security'] {
  const record = readRequiredRecord(value, 'Account security summary is required');
  return {
    mfaEnabled: readRequiredBoolean(record, 'mfaEnabled', 'Account security MFA status is required'),
    qpsLimit: readRequiredNonNegativeNumber(record, 'qpsLimit', 'Account security QPS limit is required'),
    ipWhitelistCount: readRequiredNonNegativeNumber(record, 'ipWhitelistCount', 'Account security IP whitelist count is required'),
  };
}

function normalizeLoginLog(value: unknown): AccountStats['loginLogs'][number] {
  const item = readRequiredRecord(value, 'Account login log record is required');
  const status = readLoginStatus(item.status);
  return {
    ip: readRequiredString(item, 'ip', 'Account login IP is required'),
    location: readRequiredString(item, 'location', 'Account login location is required'),
    device: readRequiredString(item, 'device', 'Account login device is required'),
    time: readRequiredString(item, 'time', 'Account login time is required'),
    status,
  };
}

function readRequiredRecordArray(record: ApiRecord, key: string, itemMessage: string): ApiRecord[] {
  const value = record[key];
  if (!Array.isArray(value)) {
    throw new Error(`${key} is required`);
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

function readLoginStatus(value: unknown): AccountStats['loginLogs'][number]['status'] {
  const status = typeof value === 'string' ? value.trim() : '';
  if (status === 'success' || status === 'warning') {
    return status;
  }
  throw new Error(status ? `Unsupported account login status: ${status}` : 'Account login status is required');
}
