import { Fragment, createElement, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
} from '../../packages/sdkwork-claw-router-commons/src/portal-auth.ts';

export const PROTECTED_PORTAL_ROUTE_PREFIXES = ['/console', '/admin'] as const;

export interface ProtectedPortalLocationLike {
  hash?: string;
  pathname: string;
  search?: string;
}

export type ProtectedPortalAccessDecision =
  | { allowed: true }
  | { allowed: false; reason: 'login-required'; redirectTo: string };

export function isProtectedPortalPath(pathname: string): boolean {
  return PROTECTED_PORTAL_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function buildProtectedPortalLoginRedirect(location: ProtectedPortalLocationLike): string {
  return buildPortalAuthLoginRedirect(location);
}

export function resolveProtectedPortalAccess({
  hasSession,
  location,
}: {
  hasSession: boolean;
  location: ProtectedPortalLocationLike;
}): ProtectedPortalAccessDecision {
  if (!isProtectedPortalPath(location.pathname) || hasSession) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'login-required',
    redirectTo: buildProtectedPortalLoginRedirect(location),
  };
}

export function RequirePortalSession({ children }: { children: ReactNode }) {
  const location = useLocation();
  const decision = resolveProtectedPortalAccess({
    hasSession: hasStoredPortalSession(),
    location,
  });

  if ('redirectTo' in decision) {
    return createElement(Navigate, { replace: true, to: decision.redirectTo });
  }

  return createElement(Fragment, null, children);
}
