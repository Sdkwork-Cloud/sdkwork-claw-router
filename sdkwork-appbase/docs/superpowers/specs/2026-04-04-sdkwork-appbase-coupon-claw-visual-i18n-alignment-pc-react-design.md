# SDKWORK Coupon Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/coupon-pc-react` already owns the functional coupon domain:

- catalog coupon discovery
- owned coupon inventory
- redeem, receive, points exchange, rollback, use, and cancel-use flows
- coupon detail drawer
- coupon statistics and digest summaries

The remaining gap is quality alignment with `claw-studio`.

Current package issues:

- exported view components are still heavily hardcoded in English
- dates, money, and status labels are not consistently locale-aware
- the hero, inventory cards, redeem dialog, and drawer use flatter admin styling than Claw purchase and points surfaces
- there is no package-local i18n seam for host shells
- the page mixes discovery, operations, and detail affordances without a strong Claw-style visual rhythm

## Goal

Turn `@sdkwork/coupon-pc-react` into the second commerce package that fully aligns with `claw-studio` on:

- product visual hierarchy
- theme color semantics
- package-local internationalization handling
- host-overridable copy
- reusable coupon inventory and redeem flows

This package should become the coupon reference implementation for the rest of the commerce surface after subscription.

## Scope

This iteration covers the full exported coupon package UI surface:

- `SdkworkCouponPage`
- `coupon-redeem-dialog`
- `coupon-detail-drawer`
- `coupon-stat-grid`

It also covers the package entrypoint for copy/context exports and package README updates.

This iteration does not change coupon backend contracts or controller/service business logic beyond user-facing copy or locale-safe formatting helpers.
It does not add new tabs or new coupon workflow categories.
The existing `discover`, `my`, and `history` surfaces remain the only page states; this iteration only reorganizes their composition and presentation quality.

## Claw Studio Reference Standard

The package should mirror the observable `claw-studio` standards from the points and product surfaces:

- strong page hero with one clear commercial focus
- layered panels with large radii and soft but deliberate shadows
- semantic color use:
  - `rose` for commercial savings and premium emphasis
  - `sky` for ready, redeem, or active selection states
  - `emerald` for claimable/available/success semantics
  - `amber` for coupon/offer emphasis and warning-adjacent availability states
- status surfaces must still resolve from the actual coupon lifecycle, not from whether the card is in catalog vs owned history
- compact uppercase pills for status and scope labels
- copy and formatting driven through a localization layer instead of inline literals

The implementation boundary is local to the coupon package:

- keep using `@sdkwork/ui-pc-react` primitives and existing shell/theme CSS variables
- compose Claw-like surfaces locally in the coupon package
- do not introduce new shared appbase-level design tokens in this iteration
- do not expand scope into design-system refactors

## Architecture

### 1. Package-local coupon internationalization layer

Add a package-local coupon copy system instead of waiting for a workspace-wide i18n runtime.

The package should expose:

- a normalized locale resolver
- built-in dictionaries for `en-US` and `zh-CN`
- a coupon intl provider and hook
- host-overridable format templates for value-bearing strings such as point cost and remaining days
- locale-aware formatting helpers for:
  - dates and timestamps
  - CNY values
  - point cost
  - coupon offer labels
- status labels
- yes/no style operational labels

This keeps the package reusable now and still leaves room for a future workspace-level bridge.

The override contract is explicit:

- `SdkworkCouponPage` accepts optional `locale?: string | null` and `messages?: SdkworkCouponMessagesOverrides`
- `SdkworkCouponIntlProvider` accepts the same contract
- locale resolution normalizes any host locale to the nearest supported built-in dictionary
- message precedence is:
  1. built-in `en-US` fallback if no provider exists
  2. built-in dictionary selected by normalized locale
  3. host-supplied `messages` deep-merged over that normalized dictionary
- standalone exported components must render with built-in English copy even when no provider exists

### 2. Host override seam

`SdkworkCouponPage` should accept optional localization inputs and install the provider for all child components.

Standalone exported components should also work when wrapped with the same provider.
Without a provider, they must degrade to built-in English defaults.

Existing exports must remain stable.
This iteration may add optional localization props and new intl exports, but it must not break existing named exports or existing required props for the current coupon page and subcomponents.

### 3. Claw-aligned page composition

The coupon page should be re-composed around a Claw-style commercial rhythm:

- hero introducing coupon inventory and redeem flows
- digest/stat section with stronger semantics and less dashboard flatness
- inventory workbench with clearer stage separation between discover / owned / history
- detail drawer and redeem dialog that feel like premium operational surfaces instead of generic form dialogs

The page should not become a single noisy surface.
Discovery, redeem, and detail actions should remain visible, but each should read as a distinct control point.
The `discover / my / history` workbench refers to the current controller-backed tabs only; it is a visual and information-architecture refinement, not a new state model.

### 4. Locale-safe operational copy

The package should stop stitching English phrases directly in TSX.
Operational strings such as:

- redeem titles and descriptions
- inventory tab labels
- detail section labels
- claim / exchange / rollback / cancel-use buttons
- loading and error notices

must all flow through the coupon copy layer.

### 5. Drawer and dialog refinement

The redeem dialog and detail drawer should move closer to Claw modal and side-panel quality:

- larger surface geometry
- clearer eyebrow / title / description hierarchy
- compact metrics and operational sections
- locale-safe timestamps via `Intl.DateTimeFormat`
- semantic pills for status and availability

## State And Data Rules

- no coupon API contract changes
- no change to route intent or manifest contracts
- no changes to remote normalization semantics unless needed for user-facing formatting safety
- no new mutation categories
- controller state machine stays stable unless a view-facing selection or detail behavior needs correction

## Testing Scope

Tests should lock:

- built-in Chinese rendering through the page provider seam
- host `messages` overrides deep-merged over localized coupon dictionaries
- safe English fallback for standalone exported components
- dedicated redeem dialog coverage for localized copy, error states, and trimmed submit behavior
- locale-aware drawer formatting for timestamps and status copy
- dedicated drawer coverage for localized operational labels across owned and catalog coupon states
- coupon page regression coverage for discover / redeem / detail flows after visual and copy refactor

## Deliverable

After this change lands, `@sdkwork/coupon-pc-react` will:

- look materially aligned with `claw-studio`
- stop depending on exported-component English literals
- expose a reusable coupon localization boundary
- serve as the baseline coupon reference for the remaining commerce packages
