import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SdkworkCheckoutPage } from '@sdkwork/commerce-pc-checkout';
import { SdkworkMembershipPage } from '@sdkwork/commerce-pc-membership';
import {
  createSdkworkPaymentController,
  SdkworkPaymentPage,
} from '@sdkwork/commerce-pc-payment';

const CONSOLE_COMMERCE_PREFIX = '/console';

export function mapCommerceRouteToConsole(route: string): string {
  if (route.startsWith(`${CONSOLE_COMMERCE_PREFIX}/`) || route === CONSOLE_COMMERCE_PREFIX) {
    return route;
  }

  try {
    const url = new URL(route, 'https://sdkwork.local');
    const pathname = url.pathname;
    const suffix = `${url.search}${url.hash}`;

    if (pathname.startsWith('/app/')) {
      return `${CONSOLE_COMMERCE_PREFIX}${pathname.slice('/app'.length)}${suffix}`;
    }

    if (pathname === '/checkout' || pathname.startsWith('/checkout/')) {
      return `${CONSOLE_COMMERCE_PREFIX}${pathname}${suffix}`;
    }

    if (pathname === '/payments' || pathname.startsWith('/payments/')) {
      const paymentPath = pathname === '/payments'
        ? '/payment'
        : `/payment${pathname.slice('/payments'.length)}`;
      return `${CONSOLE_COMMERCE_PREFIX}${paymentPath}${suffix}`;
    }

    if (pathname.startsWith('/memberships')) {
      return `${CONSOLE_COMMERCE_PREFIX}/memberships${suffix}`;
    }

    if (pathname.startsWith('/wallet')) {
      return `${CONSOLE_COMMERCE_PREFIX}/wallet${suffix}`;
    }

    if (pathname.startsWith('/')) {
      return `${CONSOLE_COMMERCE_PREFIX}${pathname}${suffix}`;
    }
  } catch {
    return route;
  }

  return route.startsWith('/') ? `${CONSOLE_COMMERCE_PREFIX}${route}` : route;
}

export function ConsoleCheckoutView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(mapCommerceRouteToConsole(route));
    },
    [navigate],
  );

  return (
    <SdkworkCheckoutPage
      onNavigate={handleNavigate}
      routeSearchParams={searchParams}
    />
  );
}

export function ConsoleMembershipView() {
  const navigate = useNavigate();
  const handleNavigate = useCallback(
    (route: string) => {
      navigate(mapCommerceRouteToConsole(route));
    },
    [navigate],
  );

  return (
    <SdkworkMembershipPage
      checkoutBasePath="/console/checkout"
      onNavigate={handleNavigate}
    />
  );
}

export function ConsolePaymentView() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId') ?? undefined;

  return <ConsolePaymentViewContent paymentId={paymentId} />;
}

function ConsolePaymentViewContent({ paymentId }: { paymentId?: string }) {
  const controller = useMemo(() => createSdkworkPaymentController(), []);

  useEffect(() => {
    let cancelled = false;

    void controller.bootstrap().then(() => {
      if (cancelled || !paymentId) {
        return;
      }

      void controller.openDetail(paymentId);
    });

    return () => {
      cancelled = true;
    };
  }, [controller, paymentId]);

  return <SdkworkPaymentPage controller={controller} />;
}
