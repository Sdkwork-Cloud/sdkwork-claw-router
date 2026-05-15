import {
  createRequestParams,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readRequiredNumber,
  readRequiredString,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type {
  BillingRechargeHistoryResponse as SdkBillingRechargeHistoryResponse,
  BillingRedeemHistoryResponse as SdkBillingRedeemHistoryResponse,
  RedeemCodeRequest,
  RedeemCodeResponse as SdkRedeemCodeResponse,
} from '@sdkwork/clawrouter-app-sdk';

export interface BillingHistoryItem {
  id: number;
  amount: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
}

export interface RedeemHistoryItem extends BillingHistoryItem {
  id: SdkBillingRedeemHistoryResponse[number]['id'];
  code: SdkBillingRedeemHistoryResponse[number]['code'];
  amount: string & SdkBillingRedeemHistoryResponse[number]['amount'];
  date: SdkBillingRedeemHistoryResponse[number]['date'];
  status: SdkBillingRedeemHistoryResponse[number]['status'];
}

export interface RechargeHistoryItem extends BillingHistoryItem {
  id: SdkBillingRechargeHistoryResponse[number]['id'];
  orderNo: SdkBillingRechargeHistoryResponse[number]['orderNo'];
  method: SdkBillingRechargeHistoryResponse[number]['method'];
  amount: string & SdkBillingRechargeHistoryResponse[number]['amount'];
  date: SdkBillingRechargeHistoryResponse[number]['date'];
  status: SdkBillingRechargeHistoryResponse[number]['status'];
}

type RedeemCodeServiceResult = {
  success: boolean;
  message: string;
  amount?: string;
} & {
  amount?: SdkRedeemCodeResponse['amount'];
};

export class BillingService {
  static async fetchRedeemHistory(): Promise<RedeemHistoryItem[]> {
    const result = await getClawRouterAppSdkClient().billing.users.current.coupons.list();
    ensurePlusApiSuccess(result, 'Failed to fetch redeem history');
    return readRequiredApiItems(result, 'Failed to fetch redeem history')
      .map(normalizeRedeemHistoryItem);
  }

  static async fetchRechargeHistory(): Promise<RechargeHistoryItem[]> {
    const result = await getClawRouterAppSdkClient().billing.payments.records.list();
    ensurePlusApiSuccess(result, 'Failed to fetch recharge history');
    return readRequiredApiItems(result, 'Failed to fetch recharge history')
      .map(normalizeRechargeHistoryItem);
  }

  static async redeemCode(code: string): Promise<RedeemCodeServiceResult> {
    try {
      const request: RedeemCodeRequest = { code: requiredText(code, 'code') };
      const result = await getClawRouterAppSdkClient().billing.coupons.redeem.create(
        request,
        createRequestParams('commerce-coupon-redeem'),
      );
      ensurePlusApiSuccess(result, 'Failed to redeem code');
      const response = isRecord(result) ? result : {};
      const data = readApiRecord(result);
      const message =
        readString(response, 'msg') ||
        readString(response, 'message') ||
        readString(data, 'msg') ||
        readString(data, 'message') ||
        'Redeemed successfully';
      const amount = readOptionalMoneyString(data, 'amount', 'Redeem amount must be a money string');
      return {
        success: true,
        message,
        ...(amount === undefined ? {} : { amount }),
      };
    } catch (error) {
      return {
        success: false,
        message: getRedeemErrorMessage(error),
      };
    }
  }
}

function getRedeemErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return 'Failed to redeem code';
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function normalizeRedeemHistoryItem(value: unknown): RedeemHistoryItem {
  const item = readRequiredRecord(value, 'Redeem history record is required');
  return {
    id: readRequiredNumber(item, 'id', 'Redeem history id is required'),
    code: readRequiredString(item, 'code', 'Redeem history code is required'),
    amount: readRequiredMoneyString(
      item,
      'amount',
      'Redeem history amount is required',
      'Redeem history amount must be a money string',
    ),
    date: readRequiredString(item, 'date', 'Redeem history date is required'),
    status: readBillingStatus(item, 'Redeem history status is required'),
  };
}

function normalizeRechargeHistoryItem(value: unknown): RechargeHistoryItem {
  const item = readRequiredRecord(value, 'Recharge history record is required');
  return {
    id: readRequiredNumber(item, 'id', 'Recharge history id is required'),
    orderNo: readRequiredString(item, 'orderNo', 'Recharge history order number is required'),
    method: readRequiredString(item, 'method', 'Recharge history payment method is required'),
    amount: readRequiredMoneyString(
      item,
      'amount',
      'Recharge history amount is required',
      'Recharge history amount must be a money string',
    ),
    date: readRequiredString(item, 'date', 'Recharge history date is required'),
    status: readBillingStatus(item, 'Recharge history status is required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function readBillingStatus(item: ApiRecord, missingMessage: string): 'success' | 'pending' | 'failed' {
  const status = readRequiredString(item, 'status', missingMessage).toLowerCase();
  if (status === 'success' || status === 'pending' || status === 'failed') {
    return status;
  }
  throw new Error(`Unsupported billing status: ${status}`);
}

function readOptionalMoneyString(item: ApiRecord, key: string, invalidMessage: string): string | undefined {
  if (!(key in item)) {
    return undefined;
  }
  const value = readString(item, key).trim();
  if (!value) {
    return undefined;
  }
  if (!/^-?\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
}

function readRequiredMoneyString(
  item: ApiRecord,
  key: string,
  missingMessage: string,
  invalidMessage: string,
): string {
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
