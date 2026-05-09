import { backendApiPath } from './paths';
import type { HttpClient } from '../http/client';

import type { AddCouponResult, AdminCouponCreateRequest, OperationRequest, PlusApiResult } from '../types';


export class CouponApi {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

/** Create coupon */
  async add(body: AdminCouponCreateRequest, xRequestId?: string): Promise<AddCouponResult> {
    const requestHeaders = buildRequestHeaders(
      {
        'X-Request-Id': xRequestId,
      },
      {}
    );
    return this.client.post<AddCouponResult>(backendApiPath(`/coupon`), body, undefined, requestHeaders, 'application/json');
  }

/** List coupons */
  async fetchCoupons(body?: OperationRequest): Promise<PlusApiResult> {
    return this.client.post<PlusApiResult>(backendApiPath(`/coupon/list`), body, undefined, undefined, 'application/json');
  }

/** Delete coupon */
  async deleteCoupon(couponId: string | number): Promise<PlusApiResult> {
    return this.client.delete<PlusApiResult>(backendApiPath(`/coupon/${couponId}`));
  }
}

export function createCouponApi(client: HttpClient): CouponApi {
  return new CouponApi(client);
}

function appendQueryString(path: string, rawQueryString: string): string {
  const query = rawQueryString.replace(/^\?+/, '');
  if (!query) {
    return path;
  }
  return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}


function buildRequestHeaders(
  headers: Record<string, unknown | undefined>,
  cookies: Record<string, unknown | undefined> = {},
): Record<string, string> | undefined {
  const requestHeaders: Record<string, string> = {};

  for (const [name, value] of Object.entries(headers)) {
    const serialized = serializeParameterValue(value);
    if (serialized !== undefined) {
      requestHeaders[name] = serialized;
    }
  }

  const cookieHeader = buildCookieHeader(cookies);
  if (cookieHeader) {
    requestHeaders.Cookie = requestHeaders.Cookie
      ? `${requestHeaders.Cookie}; ${cookieHeader}`
      : cookieHeader;
  }

  return Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined;
}

function buildCookieHeader(cookies: Record<string, unknown | undefined>): string | undefined {
  const pairs: string[] = [];
  for (const [name, value] of Object.entries(cookies)) {
    const serialized = serializeParameterValue(value);
    if (serialized !== undefined) {
      pairs.push(`${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`);
    }
  }
  return pairs.length > 0 ? pairs.join('; ') : undefined;
}

function serializeParameterValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value
      .map((item) => serializeParameterValue(item))
      .filter((item): item is string => item !== undefined)
      .join(',');
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
}
