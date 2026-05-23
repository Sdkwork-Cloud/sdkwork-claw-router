# SDKWORK Subscription Payment Contract Componentization Design

## Context

`packages/pc-react/commerce/sdkwork-subscription-pc-react` already implements a Claw-style staged `plans -> checkout` flow, but the checkout panel still has two structural problems:

1. Payment methods are hardcoded inside the view as local string literals.
2. The checkout panel owns too many unrelated responsibilities in one file.

This makes the subscription package harder to reuse as a foundation commerce module and prevents the payment boundary from converging with the rest of the commerce stack.

## Design Goals

- Replace view-local payment constants with a subscription payment-method contract sourced from the commerce payment runtime.
- Keep the subscription package independent from `checkout` package UI dependencies to avoid circular coupling.
- Preserve a narrow backend mutation adapter for subscription submit flows while exposing richer selector data to the UI.
- Split the checkout panel into focused reusable components that can be composed elsewhere.
- Keep the overall interaction aligned with Claw Studio: premium copy, explicit selected states, and a locked checkout summary rail.

## Contract Design

The subscription package keeps the existing backend submit enum:

- `SdkworkSubscriptionPaymentMethod = "ALIPAY" | "WECHAT"`

That enum remains the mutation boundary only.

The public UI-facing contract becomes a richer option model:

- `SdkworkSubscriptionPaymentMethodOption`
  - `id`
  - `code`
  - `label`
  - `available`
  - `recommended`
  - `kind`
  - `description`
  - `productTypes`
  - `recommendedProductType`
  - `paymentMethod`

`SdkworkSubscriptionDashboardData` will expose `paymentMethods`, and checkout estimate state will track `selectedPaymentMethodId` and `selectedPaymentMethodCode` instead of only the submit enum.

## Data Flow

1. `subscription-service` requests VIP dashboard and coupons as before.
2. `subscription-service` also requests payment dashboard methods from `@sdkwork/payment-pc-react`.
3. Payment methods are mapped once into subscription-local option objects.
4. Unsupported methods for subscription submit are filtered out at the subscription boundary.
5. A default subscription payment option set is used as fallback if runtime payment methods are missing.
6. Controller state stores only the selected option id.
7. On submit, the selected option is mapped back to the narrow subscription mutation enum.

## Component Boundaries

`subscription-checkout-panel.tsx` remains the orchestrator but delegates rendering to smaller units:

- `subscription-selected-plan-card.tsx`
- `subscription-coupon-list.tsx`
- `subscription-payment-methods.tsx`
- `subscription-price-summary.tsx`

These components stay presentation-focused. Controller and service keep selection and mutation logic.

## Interaction Notes

- The payment panel should keep a clear locked/secured tone, but avoid too many stacked notice boxes.
- Selected payment methods should use icon + label + state copy, not color alone.
- Recommended/default method should be explicit.
- Empty runtime methods should degrade gracefully to a clear empty/fallback state, not a broken checkout.

## Verification

- Add failing tests first for service mapping, payment-method rendering, and checkout panel composition.
- Run package typecheck.
- Run subscription package tests.
- Run commerce-wide tests.
- Run structure review.
