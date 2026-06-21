import {
  ensureSdkworkApiSuccess,
  getSdkworkCommerceAppSdkClient,
  isRecord,
  readApiRecord,
  readBoolean,
  readNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from '@sdkwork/clawrouter-pc-commons/runtime';

export interface AccountConsumptionItem {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface AccountInvoiceSettings {
  orgFull: string;
  taxId: string;
  paymentMethod: string;
  invoiceType: string;
}

export interface AccountSecuritySettings {
  mfaEnabled: boolean;
  qpsLimit: number;
  ipWhitelistCount: number;
}

export interface AccountLoginLog {
  ip: string;
  location: string;
  device: string;
  time: string;
  status: string;
}

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
  consumptionByService: AccountConsumptionItem[];
  invoiceSettings: AccountInvoiceSettings;
  security: AccountSecuritySettings;
  loginLogs: AccountLoginLog[];
}

export class AccountService {
  static async fetchAccountDetails(): Promise<AccountStats> {
    const result = await getSdkworkCommerceAppSdkClient().accounts.current.summary.retrieve();
    ensureSdkworkApiSuccess(result, 'Failed to load account summary');
    return normalizeAccountStats(readAccountSummaryRecord(result));
  }
}

function readAccountSummaryRecord(result: unknown): ApiRecord {
  let record = readApiRecord(result);
  if (isRecord(record.data)) {
    record = record.data;
  }
  if (isRecord(record.summary)) {
    record = record.summary;
  }
  return record;
}

function readNestedRecord(value: unknown): ApiRecord {
  return isRecord(value) ? value : {};
}

function normalizeAccountStats(data: ApiRecord): AccountStats {
  return {
    id: readRequiredString(data, 'id', 'Account summary id is required'),
    name: readRequiredString(data, 'name', 'Account summary name is required'),
    email: readRequiredString(data, 'email', 'Account summary email is required'),
    isVerified: readBoolean(data, 'isVerified', false),
    tier: readRequiredString(data, 'tier', 'Account summary tier is required'),
    organization: readRequiredString(data, 'organization', 'Account summary organization is required'),
    availableCredits: readNumber(data, 'availableCredits', 0),
    estDaysRemaining: readNumber(data, 'estDaysRemaining', 0),
    monthlyConsumption: readNumber(data, 'monthlyConsumption', 0),
    consumptionByService: readConsumptionByService(data.consumptionByService),
    invoiceSettings: readInvoiceSettings(readNestedRecord(data.invoiceSettings ?? data.invoice_settings)),
    security: readSecuritySettings(readNestedRecord(data.security)),
    loginLogs: readLoginLogs(data.loginLogs),
  };
}

function readConsumptionByService(value: unknown): AccountConsumptionItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter(isRecord)
    .map((item) => ({
      name: readRequiredString(item, 'name', 'Account consumption item name is required'),
      value: readNumber(item, 'value', 0),
      color: readRequiredString(item, 'color', 'Account consumption item color is required'),
      percentage: readNumber(item, 'percentage', 0),
    }));
}

function readInvoiceSettings(data: ApiRecord): AccountInvoiceSettings {
  return {
    orgFull: readRequiredString(data, 'orgFull', 'Account invoice org is required'),
    taxId: readRequiredString(data, 'taxId', 'Account invoice tax id is required'),
    paymentMethod: readRequiredString(data, 'paymentMethod', 'Account invoice payment method is required'),
    invoiceType: readRequiredString(data, 'invoiceType', 'Account invoice type is required'),
  };
}

function readSecuritySettings(data: ApiRecord): AccountSecuritySettings {
  return {
    mfaEnabled: readBoolean(data, 'mfaEnabled', false),
    qpsLimit: readNumber(data, 'qpsLimit', 0),
    ipWhitelistCount: readNumber(data, 'ipWhitelistCount', 0),
  };
}

function readLoginLogs(value: unknown): AccountLoginLog[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter(isRecord)
    .map((item) => ({
      ip: readRequiredString(item, 'ip', 'Account login log ip is required'),
      location: readRequiredString(item, 'location', 'Account login log location is required'),
      device: readRequiredString(item, 'device', 'Account login log device is required'),
      time: readRequiredString(item, 'time', 'Account login log time is required'),
      status: readRequiredString(item, 'status', 'Account login log status is required'),
    }));
}
