import {
  ensurePlusApiSuccess,
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItems,
  readRequiredNonNegativeNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface TransactionRecord {
  id: string;
  time: string;
  userId: string;
  type: 'recharge' | 'refund' | 'consume';
  amount: string;
  balance: string;
  description: string;
  status: 'success' | 'failed' | 'pending';
}

export interface BillingRecord {
  id: string;
  userId: string;
  period: string;
  totalTokens: number;
  totalCost: string;
  status: 'paid' | 'unpaid' | 'overdue';
  dueDate: string;
}

export class FinanceService {
  static async fetchTransactions(): Promise<TransactionRecord[]> {
    const result = await getClawRouterBackendSdkClient().finance.fetchTransactions();
    ensurePlusApiSuccess(result, 'Failed to fetch transactions');
    return readRequiredApiItems(result, 'Failed to fetch transactions')
      .map(normalizeTransaction);
  }

  static async fetchBilling(): Promise<BillingRecord[]> {
    const result = await getClawRouterBackendSdkClient().router.fetchBilling();
    ensurePlusApiSuccess(result, 'Failed to fetch billing records');
    return readRequiredApiItems(result, 'Failed to fetch billing records')
      .map(normalizeBillingRecord);
  }
}

function normalizeTransaction(value: unknown): TransactionRecord {
  const item = readRequiredRecord(value, 'Transaction record is required');
  return {
    id: readRequiredString(item, 'id', 'Transaction id is required'),
    time: readRequiredString(item, 'time', 'Transaction time is required'),
    userId: readRequiredString(item, 'userId', 'Transaction user id is required'),
    type: readTransactionType(item),
    amount: readMoneyString(
      item,
      'amount',
      'Transaction amount is required',
      'Transaction amount must be a money string',
    ),
    balance: readMoneyString(
      item,
      'balance',
      'Transaction balance is required',
      'Transaction balance must be a money string',
    ),
    description: readRequiredString(item, 'description', 'Transaction description is required'),
    status: readTransactionStatus(item),
  };
}

function normalizeBillingRecord(value: unknown): BillingRecord {
  const item = readRequiredRecord(value, 'Billing record is required');
  return {
    id: readRequiredString(item, 'id', 'Billing record id is required'),
    userId: readRequiredString(item, 'userId', 'Billing user id is required'),
    period: readRequiredString(item, 'period', 'Billing period is required'),
    totalTokens: readRequiredNonNegativeNumber(item, 'totalTokens', 'Billing total tokens are required'),
    totalCost: readMoneyString(
      item,
      'totalCost',
      'Billing total cost is required',
      'Billing total cost must be a money string',
    ),
    status: readBillingStatus(item),
    dueDate: readRequiredString(item, 'dueDate', 'Billing due date is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readTransactionType(item: ApiRecord): 'recharge' | 'refund' | 'consume' {
  const type = readString(item, 'type');
  if (type === 'recharge' || type === 'refund' || type === 'consume') {
    return type;
  }
  throw new Error(type ? `Unsupported transaction type: ${type}` : 'Transaction type is required');
}

function readTransactionStatus(item: ApiRecord): 'success' | 'failed' | 'pending' {
  const status = readRequiredString(item, 'status', 'Transaction status is required');
  if (status === 'success' || status === 'failed' || status === 'pending') {
    return status;
  }
  throw new Error(`Unsupported transaction status: ${status}`);
}

function readBillingStatus(item: ApiRecord): 'paid' | 'unpaid' | 'overdue' {
  const status = readRequiredString(item, 'status', 'Billing status is required');
  if (status === 'paid' || status === 'unpaid' || status === 'overdue') {
    return status;
  }
  throw new Error(`Unsupported billing status: ${status}`);
}

function readMoneyString(item: ApiRecord, key: string, missingMessage: string, invalidMessage: string): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function formatMoneyString(value: string): string {
  const sign = value.startsWith('-') ? '-' : '';
  const unsigned = sign ? value.slice(1) : value;
  const [whole, fraction = ''] = unsigned.split('.');
  return `${sign}${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
