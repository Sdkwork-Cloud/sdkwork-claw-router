# SDKWORK Wallet Withdraw PC React Design

## Why this is the right next step

The current `@sdkwork/wallet-pc-react` package already covers:

- wallet overview loading
- points recharge
- VIP package purchase
- transaction history presentation
- header-entry and quick-panel composition

Compared with `claw-studio`, the missing reusable wallet capability is cash withdrawal.

`claw-studio` already treats withdraw as a first-class account action:

- service-level `withdraw(amount, destination)`
- explicit withdraw destination selection
- shared modal workflow beside recharge

`sdkwork-appbase` still stops at recharge and membership purchase, which leaves the wallet package incomplete as a general-purpose commercialization surface.

## Reference inputs

Primary references:

- `claw-studio/packages/sdkwork-claw-core/src/services/accountService.ts`
- `claw-studio/packages/sdkwork-claw-account/src/Account.tsx`
- `spring-ai-plus-app-api/sdkwork-sdk-app/sdkwork-app-sdk-typescript/src/api/account.ts`
- `spring-ai-plus-app-api/sdkwork-sdk-app/sdkwork-app-sdk-typescript/src/types/cash-withdraw-form.ts`
- `spring-ai-plus-app-api/sdkwork-sdk-app/sdkwork-app-sdk-typescript/src/types/cash-withdraw-vo.ts`

Current appbase surfaces to preserve:

- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-service.ts`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/wallet-controller.ts`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-balance-panel.tsx`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-quick-panel.tsx`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-recharge-dialog.tsx`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/components/wallet-header-entry.tsx`
- `packages/pc-react/commerce/sdkwork-wallet-pc-react/src/pages/WalletPage.tsx`

## Goal

Upgrade `@sdkwork/wallet-pc-react` so it becomes a reusable wallet operations workspace with:

- recharge
- withdraw
- membership purchase
- transaction visibility

The withdrawal flow must be package-owned and reusable from both full-page and header-entry contexts.

## Approaches considered

### Approach 1: Page-only withdraw modal

Add a withdraw modal only to `WalletPage`.

Pros:

- fastest implementation

Cons:

- not reusable from header-entry
- breaks the package’s shared-entry architecture
- keeps wallet actions fragmented

### Approach 2: Wallet-owned withdraw lane

Add withdraw contracts to `wallet-service`, state management to `wallet-controller`, a reusable `wallet-withdraw-dialog` component, and shared entry buttons in wallet page surfaces.

Pros:

- matches current package boundaries
- keeps the capability reusable
- aligns with existing recharge and membership flows

Cons:

- touches more files

### Approach 3: New dedicated withdraw package

Create a separate `sdkwork-withdraw-pc-react` package.

Pros:

- pure isolation

Cons:

- premature abstraction
- withdraw depends directly on wallet account state and balance
- would force awkward cross-package composition for a single action lane

## Chosen approach

Approach 2 is the best fit.

Withdrawal belongs inside `@sdkwork/wallet-pc-react` because it is an account operation over wallet cash balance, not a standalone commerce domain.

## Ownership boundary

`@sdkwork/wallet-pc-react` will own:

- withdraw input and result contracts
- withdraw destination option modeling
- generated SDK client invocation for withdraw
- controller state for open, close, and mutation orchestration
- reusable withdraw dialog UI
- wallet page and header-entry integration

It will not own:

- bank-card management
- settlement review workflows
- risk control and KYC flows
- payout ledger back-office tooling

## Data model additions

Add:

- `SdkworkWalletWithdrawDestination`
  - `id`
  - `code`
  - `label`
  - `description`
- `SdkworkWalletWithdrawInput`
  - `amountCny`
  - `destinationCode`
  - `remarks`
- `SdkworkWalletWithdrawResult`
  - `amountCny`
  - `destinationCode`
  - `processedAt`
  - `remainingCashAvailable`
  - `status`
  - `transactionId`

The default destination list should stay intentionally small and PC-commerce aligned:

- `bank_account`
- `ALIPAY`
- `WECHAT_PAY`

These destinations represent payout rails only.
They do not create or manage beneficiary identity.
The host application or backend owns any linked payout profile, KYC, bank-card binding, or settlement-account administration.

## Service approach

The generated app SDK already exposes `account.withdraw` for `/account/cash/withdraw`.

Extend the wallet client boundary with optional `account.withdraw`, but do not introduce manual HTTP clients or package-local transport shims.

`wallet-service` should expose `withdrawCash(input)` and map the generated SDK envelope into a stable package contract.

The service must:

- fail clearly if withdraw is unavailable
- preserve the current guest-safe overview behavior
- map remote payloads with the same normalization style already used for recharge and VIP purchase

## Controller approach

`wallet-controller` should add:

- `isWithdrawOpen`
- `openWithdraw()`
- `closeWithdraw()`
- `withdrawCash(input)`

Mutation behavior should mirror the recharge flow:

- set `isMutating`
- clear `lastError`
- run the mutation
- refresh overview
- close the dialog on success

## UI composition

Add a reusable `wallet-withdraw-dialog` that mirrors the recharge dialog structure:

- current available cash summary
- amount input
- destination selection
- guardrails for guest mode and insufficient amount
- confirm and cancel actions

Add withdraw entrypoints to:

- `wallet-balance-panel`
- `wallet-quick-panel`
- `wallet-header-entry`
- `WalletPage`

The hero panel should present withdraw as a peer action beside recharge and membership.
`wallet-quick-panel` owns the CTA surface, while `wallet-header-entry` and `WalletPage` own dialog mounting and controller wiring.

## Error handling

The first version should keep the flow deterministic and honest:

- guest users cannot submit
- zero or negative amounts cannot submit
- amounts above available cash cannot submit
- if the SDK withdraw mutation is unavailable, the error must surface through `lastError`

No optimistic transaction insertion should be added in this iteration.
The package should rely on the post-mutation overview refresh.

## Testing scope

Tests should cover:

- service contract mapping for withdraw
- controller refresh and dialog-close behavior after withdraw
- withdraw dialog rendering and guardrails
- wallet page integration
- wallet quick-panel and header-entry withdraw launch behavior

## Deliverable

After this lands, `@sdkwork/wallet-pc-react` will no longer be a recharge-only wallet shell.
It will become a reusable wallet operations package that supports the full core action set expected from AI-era commercial desktop applications.
