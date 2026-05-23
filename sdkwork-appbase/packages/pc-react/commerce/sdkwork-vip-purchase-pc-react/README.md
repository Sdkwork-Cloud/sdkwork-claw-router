# @sdkwork/vip-purchase-pc-react

## Purpose

VIP package purchase entry points for top-header menus, package selection, renewal, and upgrade submission.

## Placement

- Architecture: `pc-react`
- Domain: `commerce`
- Capability: `vip-purchase`
- Status: `ready`

## Depends on

- `@sdkwork/ui-pc-react` for shared UI primitives and patterns
- `@sdkwork/vip-pc-react` for VIP dashboard types and membership mutation mapping
- `@sdkwork/commerce-service` for generated app SDK boundaries, session checks, and response normalization
- Lower-level appbase packages only

## Ownership

This package owns purchase-specific header and menu contracts. VIP dashboard display remains in `@sdkwork/vip-pc-react`, and admin VIP management remains in `@sdkwork/vip-admin-pc-react`.

The purchase flow is intentionally service-first:

- `createSdkworkVipPurchaseService()` is the package-level submission boundary.
- `SdkworkVipPurchaseMenu` always submits through the purchase service, then refreshes the injected VIP controller.
- Hosts can inject a custom purchase service for composition, but the default path still resolves to the shared commerce service boundary.

## Runtime Boundary

Remote purchase, renew, and upgrade calls are routed through `@sdkwork/commerce-service` and `billing.vip.purchase.*` via the reusable VIP service. This package does not create raw HTTP clients, mutate browser location, or own wallet state.

## Verification

Use the package `typecheck` script and focused Vitest coverage for route intents, purchase service behavior, header integration, duplicate-submit protection, and failure display.
