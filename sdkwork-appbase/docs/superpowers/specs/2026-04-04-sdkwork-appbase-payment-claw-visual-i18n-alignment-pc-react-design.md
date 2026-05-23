# SDKWORK Payment Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/payment-pc-react` already owns the functional payment domain:

- payment method discovery
- payment creation and QR material generation
- payment detail inspection
- payment status refresh, reconcile, and close flows
- payment statistics and order-related attempt history

The remaining gap is quality alignment with `claw-studio`.

Current package issues:

- exported page, dialog, drawer, and stat grid surfaces are still hardcoded in English
- page-level timestamp formatting is locked to `en-US`
- the hero, method rail, record list, create dialog, and detail drawer still read like admin utilities instead of Claw-grade purchase surfaces
- there is no package-local i18n seam for host shells
- visual state colors are partly hardcoded instead of being resolved from shell theme semantics and real payment lifecycle state

## Goal

Turn `@sdkwork/payment-pc-react` into the next commerce package that fully aligns with `claw-studio` on:

- product visual hierarchy
- theme color semantics
- package-local internationalization handling
- host-overridable copy
- reusable payment creation, QR, and payment-history flows

This package should become the payment reference implementation for `checkout`, `subscription`, and future billing-facing packages.

## Scope

This iteration covers the full exported payment package UI surface:

- `SdkworkPaymentPage`
- `payment-create-dialog`
- `payment-detail-drawer`
- `payment-stat-grid`

It also covers the package entrypoint for copy/context exports and package README updates.

This iteration does not change payment backend contracts or controller/service business logic beyond user-facing copy, locale-safe formatting helpers, and visual-state presentation helpers.
It does not change controller state machine semantics or add new backend mutation categories.

## Claw Studio Reference Standard

The package should mirror the observable `claw-studio` standards from the points and mall purchase surfaces:

- strong page hero with one clear payment focus
- layered panels with large radii and soft but deliberate shadows
- semantic color use:
  - `sky` for active selection and QR-ready surfaces
  - `emerald` for successful settlement semantics
  - `amber` for pending or polling states
  - `rose` for failed or closed payment risk states
- status surfaces must still resolve from the actual payment lifecycle, not from whether the card lives in the hero, list, or drawer
- compact uppercase pills and summary rails instead of flat admin chips
- copy and formatting driven through a localization layer instead of inline literals

The implementation boundary is local to the payment package:

- keep using `@sdkwork/ui-pc-react` primitives and existing shell/theme CSS variables
- compose Claw-like payment surfaces locally in the payment package
- do not introduce new shared appbase-level design tokens in this iteration
- do not expand scope into design-system refactors

## Architecture

### 1. Package-local payment internationalization layer

Add a package-local payment copy system instead of waiting for a workspace-wide i18n runtime.

The package should expose:

- a normalized locale resolver
- built-in dictionaries for `en-US` and `zh-CN`
- a payment intl provider and hook
- host-overridable format templates for value-bearing strings such as polling descriptions and related-payment timestamps
- locale-aware formatting helpers for:
  - timestamps and dates
  - CNY values
  - payment status labels
  - product-type labels
  - QR polling descriptions

This keeps the package reusable now and still leaves room for a future workspace-level bridge.

The override contract is explicit:

- `SdkworkPaymentPage` accepts optional `locale?: string | null` and `messages?: SdkworkPaymentMessagesOverrides`
- `SdkworkPaymentIntlProvider` accepts the same contract
- locale resolution normalizes any host locale to the nearest supported built-in dictionary
- message precedence is:
  1. built-in `en-US` fallback if no provider exists
  2. built-in dictionary selected by normalized locale
  3. host-supplied `messages` deep-merged over that normalized dictionary
- standalone exported components must render with built-in English copy even when no provider exists

### 2. Claw-aligned page composition

The payment page should be re-composed around a Claw-style payment rhythm:

- hero introducing payment operations and payment state at a glance
- method rail that feels like a selectable purchase lane rather than a plain settings list
- payment operations digest with clearer relationship between pending, successful, failed, and actionable attempts
- record workbench that feels like a premium transaction center instead of a flat audit table

The page should not repeat the same story in the hero and stat grid.
Hero, digest, and record list must each answer a different user question.

### 3. Create dialog refinement

The create dialog should move closer to Claw modal quality:

- larger surface geometry
- clearer eyebrow / title / description hierarchy
- a summary panel explaining the selected payment lane and product type
- locale-safe wording for method selection, product type, and submit state

### 4. Detail drawer refinement

The detail drawer should move closer to Claw side-panel quality:

- top summary emphasizing status, amount, and QR readiness
- locale-safe timestamps, product-type wording, and polling descriptions
- layered QR and payment-link presentation
- related payment history that reads like a cohesive retry narrative instead of raw log rows

### 5. Locale-safe operational copy

The package should stop stitching English phrases directly in TSX.

Operational strings such as:

- hero labels and descriptions
- method-rail labels
- filter labels
- create-dialog actions and field copy
- drawer section labels
- loading and error notices
- polling and QR descriptions

must all flow through the payment copy layer.

## State And Data Rules

- no payment API contract changes
- no change to route intent or manifest contracts
- no new mutation categories
- controller state machine stays stable unless a view-facing selection or detail behavior needs correction
- order-related history remains controller-backed and read-only in this iteration

## Testing Scope

Tests should lock:

- built-in Chinese rendering through the page provider seam
- host `messages` overrides deep-merged over localized payment dictionaries
- safe English fallback for standalone exported components
- localized create-dialog coverage for copy, method/product wording, and submit behavior
- localized detail-drawer coverage for timestamps, status tones, QR/polling copy, and action labels
- payment page regression coverage for method selection, create flow, filter flow, and detail flow after visual and copy refactor

## Deliverable

After this change lands, `@sdkwork/payment-pc-react` will:

- look materially aligned with `claw-studio`
- stop depending on exported-component English literals
- expose a reusable payment localization boundary
- serve as the baseline payment reference for the remaining commerce packages
