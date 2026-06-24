const AUTH_PROJECTION_QUERY_KEYS = new Set([
  'tenantId',
  'tenant_id',
  'userId',
  'user_id',
  'appId',
  'app_id',
  'organizationId',
  'organization_id',
  'operatorId',
  'operator_id',
  'subjectType',
  'subject_type',
  'subjectId',
  'subject_id',
  'sessionId',
  'session_id',
]);

const AUTH_PROJECTION_BODY_KEYS = AUTH_PROJECTION_QUERY_KEYS;

export function omitAuthProjectionQuery(
  query?: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> | undefined {
  if (!query) {
    return undefined;
  }

  const next: Record<string, string | number | boolean | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    if (!AUTH_PROJECTION_QUERY_KEYS.has(key)) {
      next[key] = value;
    }
  }
  return Object.keys(next).length > 0 ? next : undefined;
}

export function omitAuthProjectionBody(body: unknown): unknown {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return body;
  }

  const record = body as Record<string, unknown>;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!AUTH_PROJECTION_BODY_KEYS.has(key)) {
      next[key] = value;
    }
  }
  return next;
}

export function requiresClientContextSelectorSanitization(path: string): boolean {
  const normalized = path.split('?')[0]?.toLowerCase() ?? '';
  if (normalized.includes('/backend/v3/api')) {
    return false;
  }
  return (
    normalized.includes('/app/v3/api')
    || normalized.startsWith('/v1')
    || normalized.includes('/open/v3/api')
    || normalized.includes('/mem/v3/api')
    || normalized.includes('/agent/v3/api')
  );
}

export function sanitizeSdkHttpRequestOptions(path: string, options: unknown): unknown {
  if (!requiresClientContextSelectorSanitization(path) || typeof options !== 'object' || options === null) {
    return options;
  }

  const requestOptions = options as Record<string, unknown>;
  const next: Record<string, unknown> = { ...requestOptions };

  if ('params' in requestOptions) {
    const params = omitAuthProjectionQuery(
      requestOptions.params as Record<string, string | number | boolean | undefined> | undefined,
    );
    if (params) {
      next.params = params;
    } else {
      delete next.params;
    }
  }

  if ('body' in requestOptions) {
    next.body = omitAuthProjectionBody(requestOptions.body);
  }

  return next;
}
