import { readApiRecord } from './api-result.ts';

const APP_SESSION_STORAGE_KEY = 'sdkwork.clawRouter.appSession.v1';
const EXPIRY_SKEW_SECONDS = 30;

export interface StoredAppSessionToken {
  token: string;
  tokenType: 'Bearer';
  expiresAt: number;
  expiresInSeconds?: number;
  storedAt: number;
}

let memoryToken: StoredAppSessionToken | null = null;
let storageLoaded = false;

export function storeAppSessionFromResult(result: unknown): StoredAppSessionToken {
  const data = readAppSessionPayload(result);
  const token = readString(data, 'token');
  const tokenType = readString(data, 'tokenType');
  const expiresAt = readNumber(data, 'expiresAt');
  const expiresInSeconds = readOptionalNumber(data, 'expiresInSeconds');

  if (!token || tokenType.toLowerCase() !== 'bearer' || !Number.isFinite(expiresAt)) {
    throw new Error('App session response is missing valid token data');
  }

  const stored: StoredAppSessionToken = {
    token,
    tokenType: 'Bearer',
    expiresAt,
    expiresInSeconds,
    storedAt: currentUnixSeconds(),
  };

  memoryToken = stored;
  storageLoaded = true;
  writeSessionStorage(stored);
  return stored;
}

export function getStoredAppSessionToken(now = currentUnixSeconds()): string | undefined {
  const token = loadStoredAppSessionToken();
  if (!token) {
    return undefined;
  }
  if (isExpired(token, now)) {
    clearStoredAppSessionToken();
    return undefined;
  }
  return token.token;
}

export function loadStoredAppSessionToken(): StoredAppSessionToken | null {
  if (memoryToken || storageLoaded) {
    return memoryToken;
  }

  storageLoaded = true;
  const raw = readSessionStorage();
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isStoredAppSessionToken(parsed)) {
      clearStoredAppSessionToken();
      return null;
    }
    memoryToken = parsed;
    return parsed;
  } catch {
    clearStoredAppSessionToken();
    return null;
  }
}

export function clearStoredAppSessionToken(): void {
  memoryToken = null;
  storageLoaded = true;
  removeSessionStorage();
}

function readAppSessionPayload(result: unknown): Record<string, unknown> {
  return readApiRecord(result);
}

function isExpired(token: StoredAppSessionToken, now: number): boolean {
  return token.expiresAt <= now + EXPIRY_SKEW_SECONDS;
}

function isStoredAppSessionToken(value: unknown): value is StoredAppSessionToken {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.token === 'string' &&
    value.token.length > 0 &&
    value.tokenType === 'Bearer' &&
    typeof value.expiresAt === 'number' &&
    Number.isFinite(value.expiresAt) &&
    typeof value.storedAt === 'number' &&
    Number.isFinite(value.storedAt) &&
    (value.expiresInSeconds === undefined ||
      (typeof value.expiresInSeconds === 'number' && Number.isFinite(value.expiresInSeconds)))
  );
}

function readString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    return Number(value);
  }
  return Number.NaN;
}

function readOptionalNumber(record: Record<string, unknown>, key: string): number | undefined {
  const value = record[key];
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const parsed = readNumber(record, key);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function currentUnixSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function readSessionStorage(): string | null {
  try {
    return globalThis.sessionStorage?.getItem(APP_SESSION_STORAGE_KEY) ?? null;
  } catch {
    return null;
  }
}

function writeSessionStorage(token: StoredAppSessionToken): void {
  try {
    globalThis.sessionStorage?.setItem(APP_SESSION_STORAGE_KEY, JSON.stringify(token));
  } catch {
    // Memory storage remains available for restrictive browser contexts.
  }
}

function removeSessionStorage(): void {
  try {
    globalThis.sessionStorage?.removeItem(APP_SESSION_STORAGE_KEY);
  } catch {
    // Nothing to clear when storage is unavailable.
  }
}
