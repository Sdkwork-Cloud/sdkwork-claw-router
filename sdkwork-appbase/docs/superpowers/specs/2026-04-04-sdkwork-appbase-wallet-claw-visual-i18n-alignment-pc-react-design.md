# SDKWORK Wallet Claw Visual And I18n Alignment PC React Design

## Context

`@sdkwork/wallet-pc-react` already had the wallet business baseline:

- wallet overview and transaction history
- recharge, withdraw, and VIP purchase dialogs
- header entry and quick-panel launch surfaces
- controller and service contracts already wired into shared app SDK flows

The gap was package quality rather than business capability.

Current package issues before this alignment pass:

- several exported wallet surfaces still rendered hardcoded English copy
- the page had no page-level locale/messages seam for host shells
- quick panel, header entry, and dialogs were only partially aligned to `claw-studio` visual rhythm
- the package had no reusable appearance contract for premium wallet hero and panel treatments

## Goal

Turn `@sdkwork/wallet-pc-react` into a reusable commerce reference package that aligns with `claw-studio` on:

- visual hierarchy
- theme semantics
- package-local internationalization
- host-overridable copy
- standalone-component fallback safety

## Scope

This iteration covers the full exported wallet surface:

- `WalletPage`
- `wallet-balance-panel`
- `wallet-summary-cards`
- `wallet-transaction-list`
- `wallet-quick-panel`
- `wallet-header-entry`
- `wallet-recharge-dialog`
- `wallet-membership-dialog`
- `wallet-withdraw-dialog`

It does not change wallet backend contracts, controller state shape, or generated app SDK integration boundaries.

## Claw Studio Reference Standard

The wallet package should match the observable `claw-studio` standards:

- layered hero and backdrop gradients instead of flat commerce cards
- consistent accent and brand chips driven by theme tokens
- larger radii and clearer premium purchase states
- localized copy flowing through a package seam instead of inline literals
- safe standalone rendering without depending on a host i18n runtime

## Architecture

### 1. Package-local wallet copy and intl seam

The wallet package should own its own copy contract now rather than waiting for workspace-wide i18n plumbing.

It should expose:

- a normalized locale resolver
- built-in `en-US` and `zh-CN` dictionaries
- a provider/hook pair for wallet copy and formatting
- locale-aware helpers for membership labels, points rates, transaction status, withdraw remarks, and settlement destinations

This makes the package immediately reusable in any PC React host while keeping a clean bridge point for future global i18n integration.

### 2. Host override seam

`WalletPage` should accept optional `locale` and `messages` inputs so hosts can install localized copy or targeted copy overrides without forking the package.

Standalone wallet exports should also remain safe without a host provider by falling back to built-in English defaults.

### 3. Claw-aligned appearance layer

The package should expose a local visual helper seam so page and standalone entrypoints can share the same premium wallet language:

- `createSdkworkWalletToneStyle`
- `createSdkworkWalletPanelStyle`
- `createSdkworkWalletBackdropStyle`
- `createSdkworkWalletHeroStyle`

These helpers should stay on `sdkwork-ui` tokens and shell theme variables, while moving the composition closer to `claw-studio`:

- darker premium hero gradients
- layered accent panels for wallet highlights
- reusable brand/accent tone chips for icons and action triggers

## State And Data Rules

- No backend contract changes
- No controller state contract changes
- No service behavior changes outside user-facing formatting and copy wiring
- Localization must not leak into service defaults or break guest-safe empty overview behavior

## Testing Scope

Tests should lock:

- Chinese rendering through the wallet page seam
- host copy overrides on top of localized messages
- standalone English fallback for wallet components without a provider
- exported wallet appearance helpers
- package regression coverage for header entry, dialogs, withdraw guardrails, and wallet page flows

## Deliverable

After this iteration, `@sdkwork/wallet-pc-react` should:

- expose package-local copy, intl, and appearance seams
- render consistently with `claw-studio` premium wallet surfaces
- support host-driven locale and copy overrides
- act as the wallet reference pattern for the remaining commerce packages
