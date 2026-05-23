# SDKWORK Points Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/points-pc-react` already had the business baseline:

- points dashboard shaping on top of wallet overview data
- recharge and upgrade dialogs
- page, quick-panel, and header-entry launch surfaces
- filtered transaction history

The gap was package structure and presentation quality.

Before this alignment pass:

- copy was still hardcoded across page, quick panel, dialogs, and transaction list
- `components/points-copy.ts` only held a few formatting helpers instead of a package seam
- there was no package-level locale provider or page-level host override seam
- the package had no reusable appearance contract for Claw-style gradients and tone panels

## Goal

Turn `@sdkwork/points-pc-react` into a reusable commerce reference package that aligns with `claw-studio` on:

- visual rhythm
- theme semantics
- package-local internationalization
- host-overridable copy
- standalone-component fallback safety

## Scope

This iteration covers the full exported points surface:

- `PointsPage`
- `points-header-entry`
- `points-quick-panel`
- `points-recharge-dialog`
- `points-upgrade-dialog`
- `points-transaction-list`

It does not change points controller contracts, wallet-derived data contracts, or generated backend integrations.

## Claw Studio Reference Standard

The points package should align with the observable `claw-studio` standards:

- layered hero and backdrop gradients instead of flat admin cards
- accent and brand chips driven by theme tokens
- stronger purchase and upgrade hierarchy for premium actions
- all user-facing copy routed through a package-local localization seam
- standalone exports that remain usable without a host i18n runtime

## Architecture

### 1. Package-local points copy and intl seam

The points package should expose:

- a normalized locale resolver
- built-in `en-US` and `zh-CN` dictionaries
- a provider/hook pair for points copy and formatting
- locale-aware helpers for current-plan titles, durations, points rates, transaction status, timestamps, and payment methods

This keeps the package reusable now while preserving a clean bridge point for future workspace-wide i18n integration.

### 2. Host override seam

`PointsPage` should accept `locale` and `messages` inputs so hosts can localize or tune hero copy without forking the package.

Standalone components should still degrade to built-in English defaults when no provider is installed.

### 3. Claw-aligned appearance layer

The package should expose reusable visual helpers:

- `createSdkworkPointsToneStyle`
- `createSdkworkPointsPanelStyle`
- `createSdkworkPointsBackdropStyle`
- `createSdkworkPointsHeroStyle`

These helpers should stay on `sdkwork-ui` tokens while moving the composition closer to `claw-studio`:

- darker premium hero gradients
- layered panels for recharge and upgrade summaries
- consistent accent and brand tone treatments for icons and quick actions

## State And Data Rules

- No backend contract changes
- No controller state contract changes
- No service behavior changes outside user-facing formatting and copy wiring
- Localization must not alter dashboard shaping or transaction filtering behavior

## Testing Scope

Tests should lock:

- Chinese rendering through the points page seam
- host copy overrides on top of localized messages
- standalone English fallback for points quick-panel rendering
- exported points appearance helpers
- package regression coverage for existing page and header-entry flows

## Deliverable

After this change, `@sdkwork/points-pc-react` should:

- expose package-local copy, intl, and appearance seams
- render consistently with `claw-studio` premium commerce surfaces
- support host-driven locale and copy overrides
- act as the points reference pattern for the remaining commerce packages
