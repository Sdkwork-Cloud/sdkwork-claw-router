# SDKWORK Wallet Withdraw Settlement PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend `@sdkwork/wallet-pc-react` withdraw flows with settlement-ready form fields and request-id support while preserving the current package boundary.

**Architecture:** Keep all changes inside the wallet package. Reuse the existing withdraw dialog and controller flow, then extend the public withdraw contract, service mapping, and dialog validation so the feature aligns with generated SDK withdraw form fields.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, `@sdkwork/ui-pc-react`, generated app SDK-backed wallet service

---

### Task 1: Lock settlement-ready withdraw behavior with tests

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.service.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.withdraw-dialog.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.page.test.tsx`

- [x] Step 1: Extend the wallet service test with failing assertions for `accountName`, `accountNo`, `bankName`, and `requestNo` request/result mapping.
- [x] Step 2: Extend the withdraw dialog test with failing assertions for settlement field rendering and invalid `requestNo` guardrails.
- [x] Step 3: Extend page-level withdraw expectations if needed for the enriched form.
- [x] Step 4: Run focused wallet withdraw tests and confirm they fail for the new form details.

### Task 2: Extend wallet withdraw contracts and service mapping

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-service.ts`

- [x] Step 1: Add `requestNo` to the public withdraw input/result contracts.
- [x] Step 2: Keep `accountName`, `accountNo`, and `bankName` in the public contract and normalize them consistently.
- [x] Step 3: Pass the full settlement-ready payload through the generated SDK withdraw method.
- [x] Step 4: Re-run the wallet service test until green.

### Task 3: Enrich the withdraw dialog with settlement fields and validation

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-withdraw-dialog.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.withdraw-dialog.test.tsx`

- [x] Step 1: Add settlement field inputs for `accountName`, `accountNo`, optional `requestNo`, and conditional `bankName`.
- [x] Step 2: Add request number validation aligned with backend-safe format.
- [x] Step 3: Keep the dialog callback-driven and do not add saved-profile or KYC behavior.
- [x] Step 4: Re-run the withdraw dialog test until green.

### Task 4: Verify and document the refined wallet withdraw flow

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-wallet-pc-react/README.md`
- Modify: `docs/superpowers/specs/2026-04-04-sdkwork-appbase-wallet-withdraw-settlement-pc-react-design.md`
- Modify: `docs/superpowers/plans/2026-04-04-sdkwork-appbase-wallet-withdraw-settlement-pc-react.md`

- [x] Step 1: Update wallet documentation to describe settlement-ready withdraw input support.
- [x] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.service.test.ts packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.withdraw-dialog.test.tsx packages/pc-react/commerce/sdkwork-wallet-pc-react/tests/wallet.page.test.tsx`.
- [x] Step 3: Run `pnpm --dir packages/pc-react/commerce/sdkwork-wallet-pc-react exec tsc --noEmit`.
- [x] Step 4: Run `pnpm test -- packages/pc-react/commerce/sdkwork-wallet-pc-react`.
- [x] Step 5: Reflect verification-driven changes back into the design and plan docs.
