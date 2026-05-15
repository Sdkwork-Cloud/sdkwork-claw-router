import {
  createRequestParams,
  ensurePlusApiSuccess,
  getClawRouterAppSdkClient,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readRequiredNonNegativeNumber,
  readRequiredString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { RechargePackagesResponse as SdkRechargePackagesResponse } from '@sdkwork/clawrouter-app-sdk';

export interface RechargePackage {
  id: SdkRechargePackagesResponse[number]['id'];
  rmb: string & SdkRechargePackagesResponse[number]['rmb'];
  bonus: SdkRechargePackagesResponse[number]['bonus'];
  points: SdkRechargePackagesResponse[number]['points'];
}

export class RechargeService {
  static async fetchPackages(): Promise<RechargePackage[]> {
    const result = await getClawRouterAppSdkClient().billing.account.points.recharges.packages.list();
    ensurePlusApiSuccess(result, 'Failed to fetch recharge packages');
    return readRequiredApiItems(result, 'Failed to fetch recharge packages')
      .map(normalizeRechargePackage);
  }

  static async submitRecharge(amount: string, method: string): Promise<{ success: boolean; orderNo: string }> {
    const result = await getClawRouterAppSdkClient().billing.account.points.recharges.create({
      amount: moneyAmount(amount, 'amount'),
      method: requiredText(method, 'method'),
    }, createRequestParams('commerce-points-recharge'));
    ensurePlusApiSuccess(result, 'Failed to submit recharge');
    const data = readApiRecord(result);
    const success = readRequiredBoolean(data, 'success', 'Recharge success flag is required');
    if (!success) {
      throw new Error('Recharge submission was not accepted');
    }
    readRequiredMoneyString(data, 'amount', 'Recharge amount is required', 'Recharge amount must be a money string');
    readRequiredString(data, 'paymentMethod', 'Recharge payment method is required');
    readRequiredNonNegativeNumber(data, 'points', 'Recharge points are required');
    readRequiredString(data, 'status', 'Recharge status is required');
    return {
      success,
      orderNo: readRequiredString(data, 'orderNo', 'Recharge order number is required'),
    };
  }
}

function normalizeRechargePackage(value: unknown): RechargePackage {
  const item = readRequiredRecord(value, 'Recharge package record is required');
  return {
    id: readRequiredString(item, 'id', 'Recharge package id is required'),
    rmb: readRequiredMoneyString(
      item,
      'rmb',
      'Recharge package money amount is required',
      'Recharge package money amount must be a money string',
    ),
    bonus: readRequiredNonNegativeNumber(item, 'bonus', 'Recharge package bonus is required'),
    points: readRequiredNonNegativeNumber(item, 'points', 'Recharge package points are required'),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function moneyAmount(value: string, fieldName: string): string {
  const normalized = requiredText(value, fieldName).replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive money amount`);
  }
  if (!isPositiveMoneyString(normalized)) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return formatMoneyString(normalized);
}

function isPositiveMoneyString(value: string): boolean {
  return /[1-9]/.test(value.replace('.', ''));
}

function readRequiredMoneyString(
  item: ApiRecord,
  key: string,
  missingMessage: string,
  invalidMessage: string,
): string {
  const value = readRequiredString(item, key, missingMessage);
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    throw new Error(invalidMessage);
  }
  return formatMoneyString(value);
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

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
