import {
  getStoredAppSessionAccessToken,
  getStoredAppSessionAuthToken,
} from './app-session-token.ts';

export interface PortalAuthLocationLike {
  hash?: string;
  pathname: string;
  search?: string;
}

export type PortalLoginRequiredActionDecision =
  | { allowed: true }
  | { allowed: false; redirectTo: string };

export function buildPortalAuthLoginRedirect(location: PortalAuthLocationLike): string {
  const returnPath = `${normalizePortalPathname(location.pathname)}${location.search ?? ''}${location.hash ?? ''}`;
  return `/auth/login?redirect=${encodeURIComponent(returnPath)}`;
}

export function resolvePortalLoginRequiredAction({
  hasSession,
  location,
}: {
  hasSession: boolean;
  location: PortalAuthLocationLike;
}): PortalLoginRequiredActionDecision {
  if (hasSession) {
    return { allowed: true };
  }

  return {
    allowed: false,
    redirectTo: buildPortalAuthLoginRedirect(location),
  };
}

export function hasStoredPortalSession(): boolean {
  return Boolean(getStoredAppSessionAuthToken() || getStoredAppSessionAccessToken());
}

function normalizePortalPathname(pathname: string): string {
  const normalized = pathname.trim();
  if (!normalized) {
    return '/';
  }
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}
