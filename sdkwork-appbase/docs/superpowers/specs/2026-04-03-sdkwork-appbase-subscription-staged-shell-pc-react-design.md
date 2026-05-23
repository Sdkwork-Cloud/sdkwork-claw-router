# SDKWORK Subscription Staged Shell PC React Design

## Goal

Enhance `@sdkwork/subscription-pc-react` with a reusable staged purchase shell that explicitly separates `plans` and `checkout`.
The package should keep Claw Studio's premium purchase rhythm while remaining reusable across future desktop apps that embed subscription checkout.

## Problem

The current subscription page already has:

- a premium hero
- a reusable plan grid
- a coupon-aware checkout panel
- a headless controller and service

What it still lacks is the stage boundary that Claw Studio uses to keep purchase intent clear:

- the plan exploration moment and the payment execution moment are rendered at the same time
- the page has no reusable shell for `plan selection -> locked payment`
- later capabilities such as overlay checkout, Tauri payment bridge, shell-level route entry, and dialog variants have no stable insertion point
- the selected package is not clearly "locked" before entering the final payment stage

Without a staged shell, every app that wants a Claw-grade purchase flow has to rebuild stage switching, locked-summary cards, and back-navigation behavior on top of raw page components.

## Package Boundary

`@sdkwork/subscription-pc-react` should own:

- the reusable subscription stage type
- controller state for staged purchase flow
- a reusable `SubscriptionStageShell` component
- the page integration that turns the current side-by-side layout into a clear two-step flow

It should not own:

- generic checkout-source orchestration from `@sdkwork/checkout-pc-react`
- low-level payment host transport
- invoice editing
- wallet or points entry ownership

## Architecture

The staged flow should remain lightweight and package-local:

1. `subscription.ts`
   adds a `SdkworkSubscriptionStage` union with `plans | checkout`.
2. `subscription-controller.ts`
   tracks `activeStage` alongside the existing action, selection, and checkout state.
   The controller keeps `plans` as the safe default and only allows `checkout` when a plan exists.
3. `components/subscription-stage-shell.tsx`
   becomes the reusable view shell.
   It renders:
   - stage indicator
   - plan-stage summary rail with a "continue to checkout" action
   - checkout-stage locked package panel with a back action
   - slot-based content areas so the existing plan grid and checkout panel stay independently reusable
   - a detailed locked package card on the left while the checkout panel on the right keeps its compact synchronized payment summary for standalone reuse
4. `pages/SubscriptionPage.tsx`
   composes the new shell with the existing hero, plan grid, checkout panel, and VIP level section.

## UX Direction

The reference is Claw Studio's plan-to-payment rhythm:

- `plans` is for comparison, selection, and confidence-building
- `checkout` is a focused locked-payment surface
- the selected package must feel committed but reversible
- the stage shell should make it obvious that coupons and payment method belong to the chosen package, not to an unstable global form

For `plans`:

- keep the free-vs-premium comparison grid
- show a right-side "ready to continue" card with selected package, current membership posture, and next-step CTA

For `checkout`:

- show a back affordance to return to plans
- show a locked package detail card with price, duration, points, tags, and action posture
- keep the payment UI isolated in the checkout panel
- keep the checkout panel's compact synchronized plan summary and locked-state hint so the panel still works when embedded without the stage shell

## State Rules

- Default stage: `plans`
- If no plan is selected, force stage back to `plans`
- Changing the selected plan does not auto-advance
- Entering checkout requires a selected plan
- Refreshing dashboard data preserves the current stage unless the selected plan disappears
- Successful submit keeps the user in the checkout stage while refreshed data rehydrates

## Testing Strategy

Use TDD across:

- controller stage transitions and safety guards
- stage-shell component rendering for both `plans` and `checkout`
- page-level interaction from plan stage into checkout stage

## Review Outcome

This change does not add a new business domain.
It hardens the existing subscription package into the missing reusable Claw-style purchase shell that future desktop apps and future runtime bridges can compose around.
