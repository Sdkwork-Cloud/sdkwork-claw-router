# SDKWORK Subscription Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/subscription-pc-react` already has the core subscription flow:

- staged `plans -> checkout`
- reusable VIP plan and level surfaces
- coupon-aware checkout
- runtime payment-method mapping

The remaining gap is quality alignment with `claw-studio`.

Current package issues:

- most component copy is hardcoded in English
- formatting is not locale-aware at the component boundary
- the visual hierarchy is cleaner than a scaffold, but still flatter and less expressive than Claw Studio's premium purchase surfaces
- the package has no reusable localization seam for host shells

## Goal

Turn `@sdkwork/subscription-pc-react` into the first commerce package that fully aligns with `claw-studio` on:

- product visual rhythm
- theme color semantics
- package-local internationalization handling
- host-overridable copy

This package should become the baseline pattern that other implemented commerce packages follow next.

## Scope

This iteration covers the entire subscription package export surface:

- `SubscriptionPage`
- `subscription-stage-shell`
- `subscription-hero`
- `subscription-plan-grid`
- `subscription-level-grid`
- `subscription-selected-plan-card`
- `subscription-coupon-list`
- `subscription-payment-methods`
- `subscription-price-summary`
- `subscription-checkout-panel`

It does not yet attempt to refactor every other commerce package in the same pass.
Those packages will reuse the same alignment pattern after this package is complete.

## Claw Studio Reference Standard

The package should mirror the observable `claw-studio` standards:

- strong hero and purchase-stage hierarchy
- rose/lobster-forward premium accents while still respecting shell theme color state
- larger radii, more layered cards, and stronger focused purchase rails
- copy fully driven through a localization layer instead of inline strings
- locale-aware numeric and currency formatting
- fallback-safe behavior when no host localization provider exists

## Architecture

### 1. Package-local internationalization layer

Add a package-local subscription copy system instead of waiting for a workspace-wide i18n runtime.

The package should expose:

- a normalized locale resolver
- built-in dictionaries for `en-US` and `zh-CN`
- a context/provider for subscription copy and formatting
- a hook that components can consume without prop drilling

This keeps the package reusable now and still allows a future `react-i18next` bridge at the host shell level.

### 2. Host override seam

`SubscriptionPage` should accept optional localization inputs and install the provider for all child components.

Standalone exported components should also work when wrapped with the same provider.
Without a provider, they must degrade to built-in English defaults instead of rendering keys or failing.

### 3. Claw-aligned visual treatment

The premium purchase surfaces should be restyled to use:

- stronger radial and layered gradients
- more deliberate surface contrast
- accent chips and badges consistent with Claw purchase dialogs
- selected-state treatment that reads as committed but reversible
- summary cards that feel like premium purchase control points, not generic admin tables

The package should also expose a local appearance seam so these visual decisions can be reused consistently by page and standalone component entrypoints:

- `createSdkworkSubscriptionToneStyle`
- `createSdkworkSubscriptionPanelStyle`
- `createSdkworkSubscriptionBackdropStyle`
- `createSdkworkSubscriptionHeroStyle`

The implementation should stay on `sdkwork-ui` primitives and theme variables, but the composition and visual hierarchy should move much closer to `claw-studio`.

## State And Data Rules

- No business logic changes to checkout calculations
- No backend contract changes
- No new mutation flows
- Localization must not alter controller state behavior
- Visual changes must preserve current component contracts wherever practical

## Testing Scope

Tests should lock:

- built-in locale fallback behavior
- Chinese copy rendering through the new provider/page seam
- continued default English rendering
- package regressions for plan stage and checkout stage after the visual and copy refactor

## Deliverable

After this change lands, `@sdkwork/subscription-pc-react` will be the first commerce package that:

- looks materially aligned with `claw-studio`
- no longer depends on view-local English literals
- exposes a reusable package-local localization boundary
- can act as the reference implementation for the remaining implemented commerce packages
