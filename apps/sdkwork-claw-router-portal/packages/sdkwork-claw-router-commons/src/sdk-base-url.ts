function normalizePrefix(prefix: string): string {
  const normalized = prefix.trim().replace(/^\/+|\/+$/g, '');
  return normalized ? `/${normalized}` : '';
}

function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/g, '');
}

export function normalizeGeneratedSdkBaseUrl(baseUrl: string, apiPrefix: string): string {
  const trimmedBaseUrl = baseUrl.trim();
  const normalizedPrefix = normalizePrefix(apiPrefix);
  if (!trimmedBaseUrl || !normalizedPrefix) {
    return trimmedBaseUrl;
  }

  const withoutTrailingSlash = stripTrailingSlash(trimmedBaseUrl);
  if (withoutTrailingSlash === normalizedPrefix) {
    return '';
  }
  if (withoutTrailingSlash.endsWith(normalizedPrefix)) {
    return stripTrailingSlash(withoutTrailingSlash.slice(0, -normalizedPrefix.length));
  }
  return withoutTrailingSlash;
}
