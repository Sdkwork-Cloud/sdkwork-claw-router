# Subscription Staged Shell PC React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable staged purchase shell to `@sdkwork/subscription-pc-react` so subscription flows explicitly move from plan selection into locked checkout.

**Architecture:** Extend the existing subscription headless contracts with a small `stage` state, add a slot-based `SubscriptionStageShell` component, and refactor the page to compose plan-stage and checkout-stage views without changing service ownership. Keep the plan grid and checkout panel reusable on their own.

**Tech Stack:** TypeScript, React 18, Vitest, Testing Library, `@sdkwork/ui-pc-react`, workspace commerce packages

---

## File Map

- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-stage-shell.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.stage-shell.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-controller.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/pages/SubscriptionPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/index.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.controller.test.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/README.md`

### Task 1: Stage Contract and Controller

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/subscription-controller.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.controller.test.ts`

- [ ] Step 1: Use the existing failing controller coverage for `activeStage`, safe defaulting to `plans`, manual transition to `checkout`, and add the missing guard coverage for forced fallback to `plans` when no plan is available.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.controller.test.ts` and confirm failure.
- [ ] Step 3: Add `SdkworkSubscriptionStage`, extend controller state/interface, and implement guarded `setStage`.
- [ ] Step 4: Re-run the controller test and confirm pass.

### Task 2: Stage Shell Component

**Files:**
- Create: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/components/subscription-stage-shell.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.stage-shell.test.tsx`

- [ ] Step 1: Extend the existing failing component coverage for `plans` stage CTA rendering and `checkout` stage locked package/back action rendering.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.stage-shell.test.tsx` and confirm failure.
- [ ] Step 3: Implement the slot-based staged shell with step indicator, plan-stage readiness panel, and checkout-stage locked summary panel while preserving the checkout panel's compact synchronized summary for standalone use.
- [ ] Step 4: Re-run the component test and confirm pass.

### Task 3: Page Integration

**Files:**
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/pages/SubscriptionPage.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/src/index.ts`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.page.test.tsx`
- Modify: `packages/pc-react/commerce/sdkwork-subscription-pc-react/README.md`

- [ ] Step 1: Extend the existing page coverage to fail on the missing staged flow, including `Continue to checkout` and the later checkout-stage action.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react/tests/subscription.page.test.tsx` and confirm failure.
- [ ] Step 3: Refactor the page to compose the new shell, export the shell from `index.ts`, and update package README ownership notes.
- [ ] Step 4: Re-run the page test and confirm pass.

### Task 4: Full Verification

**Files:**
- Review only

- [ ] Step 1: Run `pnpm --dir packages/pc-react/commerce/sdkwork-subscription-pc-react exec tsc --noEmit`.
- [ ] Step 2: Run `pnpm test -- packages/pc-react/commerce/sdkwork-subscription-pc-react/tests`.
- [ ] Step 3: Run `pnpm test -- packages/pc-react/commerce`.
- [ ] Step 4: Run `pnpm run review:structure`.
