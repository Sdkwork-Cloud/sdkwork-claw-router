import { SdkworkCommerceHostRoutes as CommerceHostRoutesComponent } from '@sdkwork/commerce-pc-host';

/** Frontend field-contract marker for commerce host route ownership. */
export interface SdkworkCommerceHostRoutes {}

export const CLAWROUTER_CONSOLE_COMMERCE_ROUTE_PREFIX = '/console';

export function ClawRouterConsoleCommerceHostRoutes() {
  return (
    <CommerceHostRoutesComponent routePrefix={CLAWROUTER_CONSOLE_COMMERCE_ROUTE_PREFIX} />
  );
}
