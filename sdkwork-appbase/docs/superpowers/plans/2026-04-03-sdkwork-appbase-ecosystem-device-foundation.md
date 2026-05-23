# SDKWork Appbase Ecosystem + Device Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `market`, `plugin`, `install`, and `distribution` from scaffold packages to real reusable appbase capability modules and register them in the shared capability catalog.

**Architecture:** Each package will follow the mature appbase pattern: headless domain model, service, controller, reusable UI components, and a page surface. Shared registry integration stays centralized so package-local work can proceed independently without conflicts.

**Tech Stack:** TypeScript, React, Vitest, `@sdkwork/ui-pc-react`, `@sdkwork/core-pc-react`

---

### Task 1: Implement `@sdkwork/market-pc-react`

**Files:**
- Modify: `packages/pc-react/ecosystem/sdkwork-market-pc-react/package.json`
- Modify: `packages/pc-react/ecosystem/sdkwork-market-pc-react/README.md`
- Modify: `packages/pc-react/ecosystem/sdkwork-market-pc-react/src/index.ts`
- Create or modify package-local domain, service, controller, component, page, and test files under `packages/pc-react/ecosystem/sdkwork-market-pc-react`

- [ ] Add normalized market item, category, digest, manifest, and route-intent models.
- [ ] Add market service with filtering, ranking, featured selection, and empty-state generation.
- [ ] Add market controller with bootstrap, filters, selected item, and refresh logic.
- [ ] Add reusable market UI composition and page surface.
- [ ] Add focused tests for domain, service, controller, and page behavior.

### Task 2: Implement `@sdkwork/plugin-pc-react`

**Files:**
- Modify: `packages/pc-react/ecosystem/sdkwork-plugin-pc-react/package.json`
- Modify: `packages/pc-react/ecosystem/sdkwork-plugin-pc-react/README.md`
- Modify: `packages/pc-react/ecosystem/sdkwork-plugin-pc-react/src/index.ts`
- Create or modify package-local domain, service, controller, component, page, and test files under `packages/pc-react/ecosystem/sdkwork-plugin-pc-react`

- [ ] Add normalized plugin lifecycle, compatibility, permission, and health models.
- [ ] Add plugin service with source/status filtering and risk summaries.
- [ ] Add plugin controller with bootstrap, selection, search, and source filters.
- [ ] Add reusable plugin UI composition and page surface.
- [ ] Add focused tests for domain, service, controller, and page behavior.

### Task 3: Implement `@sdkwork/install-pc-react`

**Files:**
- Modify: `packages/pc-react/device/sdkwork-install-pc-react/package.json`
- Modify: `packages/pc-react/device/sdkwork-install-pc-react/README.md`
- Modify: `packages/pc-react/device/sdkwork-install-pc-react/src/index.ts`
- Create or modify package-local domain, service, controller, component, page, and test files under `packages/pc-react/device/sdkwork-install-pc-react`

- [ ] Add install target, variant, readiness, steps, and route-intent models.
- [ ] Add install service with variant recommendation, readiness evaluation, and overview generation.
- [ ] Add install controller with bootstrap, selection, and refresh behavior.
- [ ] Add install UI sections for readiness, variants, and guided steps.
- [ ] Add focused tests for domain, service, controller, and page behavior.

### Task 4: Implement `@sdkwork/distribution-pc-react`

**Files:**
- Modify: `packages/pc-react/device/sdkwork-distribution-pc-react/package.json`
- Modify: `packages/pc-react/device/sdkwork-distribution-pc-react/README.md`
- Modify: `packages/pc-react/device/sdkwork-distribution-pc-react/src/index.ts`
- Create or modify package-local domain, service, controller, component, page, and test files under `packages/pc-react/device/sdkwork-distribution-pc-react`

- [ ] Add release, channel, artifact, rollout, and risk models.
- [ ] Add distribution service with overview, artifact coverage, and rollout digest generation.
- [ ] Add distribution controller with bootstrap, selected channel, selected release, and refresh behavior.
- [ ] Add distribution UI sections for channel cards, artifact matrix, and rollout rail.
- [ ] Add focused tests for domain, service, controller, and page behavior.

### Task 5: Register Device + Ecosystem Packages

**Files:**
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/src/catalog.ts`
- Modify: `packages/pc-react/foundation/sdkwork-appbase-pc-react/tests/catalog.test.ts`
- Modify: `scripts/package-catalog.mjs`

- [ ] Add `market`, `plugin`, `install`, and `distribution` to the shared public capability registry.
- [ ] Update registry tests to assert device and ecosystem domains are surfaced.
- [ ] Ensure package catalog metadata stays aligned with upgraded package statuses.

### Task 6: Verify Workspace Health

**Files:**
- No source ownership change; verification only.

- [ ] Run targeted package tests for the new ecosystem and device packages.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm run review:structure`.
