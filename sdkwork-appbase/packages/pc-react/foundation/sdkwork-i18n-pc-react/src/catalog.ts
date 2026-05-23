export type SdkworkLocale = "en-US" | "zh-CN";

export type SdkworkDeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends readonly unknown[]
      ? T[K]
      : T[K] extends object
        ? SdkworkDeepPartial<T[K]>
        : T[K];
};

export type SdkworkMessageTree = object;

export interface CreateSdkworkMessageCatalogOptions<TMessages extends SdkworkMessageTree> {
  defaultLocale?: SdkworkLocale;
  locales: Record<SdkworkLocale, TMessages>;
  namespace: string;
  overrides?: Partial<Record<SdkworkLocale, SdkworkDeepPartial<TMessages>>>;
}

export interface SdkworkMessageCatalog<TMessages extends SdkworkMessageTree = SdkworkMessageTree> {
  defaultLocale: SdkworkLocale;
  locales: Record<SdkworkLocale, TMessages>;
  namespace: string;
  resolveMessages(locale?: string | null): TMessages;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeSdkworkLocale(locale?: string | null): SdkworkLocale {
  const normalized = String(locale || "").trim().toLowerCase().replace(/_/gu, "-");
  if (normalized === "zh" || normalized.startsWith("zh-")) {
    return "zh-CN";
  }

  return "en-US";
}

export function mergeSdkworkMessages<T>(base: T, overrides?: SdkworkDeepPartial<T>): T {
  if (!overrides) {
    return cloneSdkworkMessageTree(base);
  }

  if (!isRecord(base) || !isRecord(overrides)) {
    return cloneSdkworkMessageTree(overrides as T);
  }

  const output: Record<string, unknown> = {
    ...base,
  };

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      continue;
    }

    const baseValue = output[key];
    output[key] = isRecord(baseValue) && isRecord(value)
      ? mergeSdkworkMessages(baseValue, value)
      : cloneSdkworkMessageTree(value);
  }

  return output as T;
}

export function cloneSdkworkMessageTree<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }

  if (!isRecord(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      cloneSdkworkMessageTree(entry),
    ]),
  ) as T;
}

export function createSdkworkMessageCatalog<TMessages extends SdkworkMessageTree>({
  defaultLocale = "en-US",
  locales,
  namespace,
  overrides,
}: CreateSdkworkMessageCatalogOptions<TMessages>): SdkworkMessageCatalog<TMessages> {
  const mergedLocales = (Object.keys(locales) as SdkworkLocale[]).reduce(
    (accumulator, locale) => {
      accumulator[locale] = mergeSdkworkMessages(locales[locale], overrides?.[locale]);
      return accumulator;
    },
    {} as Record<SdkworkLocale, TMessages>,
  );

  return {
    defaultLocale,
    locales: mergedLocales,
    namespace,
    resolveMessages(locale) {
      return cloneSdkworkMessageTree(
        mergedLocales[normalizeSdkworkLocale(locale)] ?? mergedLocales[defaultLocale],
      );
    },
  };
}

function collectMessageKeys(value: unknown, prefix = ""): string[] {
  if (!isRecord(value)) {
    return [prefix];
  }

  return Object.entries(value).flatMap(([key, entry]) =>
    collectMessageKeys(entry, prefix ? `${prefix}.${key}` : key),
  );
}

export function assertSdkworkCatalogLocaleParity(
  catalog: SdkworkMessageCatalog,
): void {
  const expectedKeys = new Set(
    collectMessageKeys(catalog.locales[catalog.defaultLocale]).filter(Boolean),
  );

  for (const locale of Object.keys(catalog.locales) as SdkworkLocale[]) {
    const localeKeys = new Set(collectMessageKeys(catalog.locales[locale]).filter(Boolean));
    for (const key of expectedKeys) {
      if (!localeKeys.has(key)) {
        throw new Error(
          `${catalog.namespace}: locale ${locale} is missing message key ${key}`,
        );
      }
    }

    for (const key of localeKeys) {
      if (!expectedKeys.has(key)) {
        throw new Error(
          `${catalog.namespace}: locale ${locale} defines unknown message key ${key}`,
        );
      }
    }
  }
}
