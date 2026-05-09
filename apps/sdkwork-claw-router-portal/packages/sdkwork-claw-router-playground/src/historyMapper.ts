import type { GenerationHistoryItem } from '@sdkwork/clawrouter-app-sdk';
import {
  isRecord,
  readRequiredString,
  readStringArray,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';
import type { PlaygroundHistoryItem, PlaygroundMedia } from './playgroundService';

export function mapGenerationHistoryItems(
  items: unknown[],
): PlaygroundHistoryItem[] {
  return items.map(mapGenerationHistoryItem);
}

function mapGenerationHistoryItem(value: unknown): PlaygroundHistoryItem {
  const item = readRequiredRecord(value, 'Playground history record is required');
  const itemType = readHistoryType(item.type);
  const createdAt = normalizeTimestamp(item.createdAt);
  const updatedAt = normalizeTimestamp(item.updatedAt);
  const date = normalizeHistoryDate(item.date) ?? readDatePrefix(createdAt);
  if (!date) {
    throw new Error('Playground history date is required');
  }

  return {
    id: readRequiredString(item, 'id', 'Playground history id is required'),
    date,
    prompt: readRequiredString(item, 'prompt', 'Playground history prompt is required'),
    type: itemType,
    modelInfo: normalizeOptionalString(item.modelInfo),
    url: normalizeOptionalString(item.url),
    images: normalizeStringArray(item.images),
    videos: normalizeVideoArray(item.videos),
    status: normalizeOptionalString(item.status),
    createdAt,
    updatedAt,
  };
}

function readHistoryType(
  value: unknown,
): PlaygroundHistoryItem['type'] {
  switch (value) {
    case 'images':
    case 'image':
      return 'images';
    case 'video':
    case 'music':
    case 'audio':
    case 'sfx':
      return value;
    default:
      throw new Error('Playground history type is required');
  }
}

function normalizeStringArray(values: unknown): string[] | undefined {
  const result = readStringArray({ values }, 'values')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
  return result.length > 0 ? result : undefined;
}

function normalizeVideoArray(values: unknown): PlaygroundMedia[] | undefined {
  if (values === undefined) {
    return undefined;
  }
  if (!Array.isArray(values)) {
    throw new Error('Playground history videos must be an array');
  }
  const result = values.map((value): PlaygroundMedia => {
    const item = readRequiredRecord(value, 'Playground history video record is required');
    const url = readRequiredString(item, 'url', 'Playground history video URL is required');
    const thumb = normalizeOptionalString(item.thumb);
    return thumb ? { url, thumb } : { url };
  });
  return result.length > 0 ? result : undefined;
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = String(value ?? '').trim();
  return normalized ? normalized : undefined;
}

function normalizeHistoryDate(value: unknown): string | undefined {
  const normalized = normalizeOptionalString(value);
  return normalized && /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : undefined;
}

function normalizeTimestamp(value: unknown): string | undefined {
  const normalized = normalizeOptionalString(value);
  if (!normalized) {
    return undefined;
  }
  const match = normalized.match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d+)?(?:\s*(Z|[+-]\d{2}(?::?\d{2})?))?$/i,
  );
  if (!match) {
    return undefined;
  }

  const [, date, time, rawOffset] = match;
  const offset = normalizeTimezoneOffset(rawOffset);
  if (!offset) {
    return undefined;
  }
  if (offset === 'Z') {
    return `${date}T${time}Z`;
  }

  const timestamp = new Date(`${date}T${time}${offset}`);
  if (Number.isNaN(timestamp.getTime())) {
    return undefined;
  }
  return timestamp.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function normalizeTimezoneOffset(value: string | undefined): string | undefined {
  if (!value || value.toUpperCase() === 'Z') {
    return 'Z';
  }
  if (/^[+-]\d{2}$/.test(value)) {
    return `${value}:00`;
  }
  if (/^[+-]\d{4}$/.test(value)) {
    return `${value.slice(0, 3)}:${value.slice(3)}`;
  }
  return /^[+-]\d{2}:\d{2}$/.test(value) ? value : undefined;
}

function readDatePrefix(value: unknown): string | undefined {
  return normalizeOptionalString(value)?.slice(0, 10);
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}
