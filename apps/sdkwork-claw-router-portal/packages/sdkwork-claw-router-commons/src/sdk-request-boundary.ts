export const SAFE_PATH_SEGMENT_PATTERN = /^[A-Za-z0-9._~-]{1,128}$/u;

export function requiredSafePathSegment(value: string, fieldName: string): string {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
  if (!SAFE_PATH_SEGMENT_PATTERN.test(value)) {
    throw new Error(`${fieldName} must be a safe path segment`);
  }
  return value;
}

export function optionalBoundedPositiveInteger(value: unknown, fieldName: string, maxValue: number): number | undefined {
  let numberValue: number | undefined;
  try {
    numberValue = optionalInteger(value, fieldName);
  } catch {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  if (numberValue === undefined) {
    return undefined;
  }
  if (numberValue < 1 || numberValue > maxValue) {
    throw new Error(`${fieldName} must be between 1 and ${maxValue}`);
  }
  return numberValue;
}

export function optionalPositiveInteger(value: unknown, fieldName: string): number | undefined {
  let numberValue: number | undefined;
  try {
    numberValue = optionalInteger(value, fieldName);
  } catch {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  if (numberValue === undefined) {
    return undefined;
  }
  if (numberValue < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return numberValue;
}

export function optionalInteger(value: unknown, fieldName: string): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = typeof value === 'string' ? value.trim() : value;
  if (normalized === '') {
    return undefined;
  }
  if (typeof normalized !== 'number' && typeof normalized !== 'string') {
    throw new Error(`${fieldName} must be an integer`);
  }
  const textValue = typeof normalized === 'string' ? normalized : String(normalized);
  if (!/^-?\d+$/u.test(textValue)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  const numberValue = Number(textValue);
  if (!Number.isSafeInteger(numberValue)) {
    throw new Error(`${fieldName} must be an integer`);
  }
  return numberValue;
}

export function optionalText(value: unknown, fieldName: string, maxLength: number): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }
  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  return normalized;
}

export function pruneUndefinedQueryParams<T extends Record<string, unknown>>(value: T): Record<string, string | number> {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as Record<string, string | number>;
}

export type StandardListQueryArguments = [
  pageNo?: number,
  pageSize?: number,
  keyword?: string,
  status?: string,
  startTime?: string,
  endTime?: string,
];

export function standardListQueryArguments(
  params: Record<string, string | number>,
): StandardListQueryArguments {
  return [
    optionalQueryNumber(params.pageNo),
    optionalQueryNumber(params.pageSize),
    optionalQueryString(params.keyword),
    optionalQueryString(params.status),
    optionalQueryString(params.startTime),
    optionalQueryString(params.endTime),
  ];
}

function optionalQueryNumber(value: string | number | undefined): number | undefined {
  return typeof value === 'number' ? value : undefined;
}

function optionalQueryString(value: string | number | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
