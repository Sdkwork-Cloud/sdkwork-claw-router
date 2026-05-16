import { Fragment, createElement, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  buildPortalAuthLoginRedirect,
  hasStoredPortalSession,
} from '../../packages/sdkwork-claw-router-commons/src/portal-auth.ts';
import {
  verifyCurrentPortalAdminAccess,
  type PortalAdminAccessState,
} from '../../packages/sdkwork-claw-router-commons/src/portal-session.ts';

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

export function RequireAdminSession({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [adminAccessState, setAdminAccessState] = useState<PortalAdminAccessState>('checking');
  const loginDecision = resolveProtectedPortalAccess({
    hasSession: hasStoredPortalSession(),
    location,
  });

  useEffect(() => {
    let active = true;
    setAdminAccessState('checking');
    verifyCurrentPortalAdminAccess()
      .then((state) => {
        if (active) {
          setAdminAccessState(state);
        }
      })
      .catch(() => {
        if (active) {
          setAdminAccessState('error');
        }
      });
    return () => {
      active = false;
    };
  }, [location.pathname]);

  if ('redirectTo' in loginDecision) {
    return createElement(Navigate, { replace: true, to: loginDecision.redirectTo });
  }

  if (adminAccessState === 'checking') {
    return createElement(
      'div',
      {
        className:
          'min-h-screen bg-slate-50 px-6 py-24 text-sm font-medium text-slate-600 dark:bg-[#0a0a0a] dark:text-slate-300',
      },
      'Checking admin access...',
    );
  }

  if (adminAccessState === 'anonymous') {
    return createElement(Navigate, {
      replace: true,
      to: buildProtectedPortalLoginRedirect(location),
    });
  }

  if (adminAccessState === 'forbidden') {
    return createElement(Navigate, { replace: true, to: '/console/dashboard' });
  }

  if (adminAccessState === 'error') {
    return createElement(
      'div',
      {
        className:
          'min-h-screen bg-slate-50 px-6 py-24 text-sm font-medium text-red-600 dark:bg-[#0a0a0a] dark:text-red-400',
        role: 'alert',
      },
      'Unable to verify admin access.',
    );
  }

  return createElement(Fragment, null, children);
}
