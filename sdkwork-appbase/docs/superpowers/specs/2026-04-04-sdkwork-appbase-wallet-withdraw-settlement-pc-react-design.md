# SDKWORK Wallet Withdraw Settlement PC React Design

## Context

`@sdkwork/wallet-pc-react` now supports a reusable withdraw flow:

- generated SDK-backed withdraw mutation
- wallet controller state for withdraw
- withdraw dialog
- withdraw entrypoints in wallet page and header contexts

That closes the first functional gap, but the current flow still stops at payout rail selection.
It does not yet support the settlement details that real desktop applications commonly need to pass with a withdrawal request.

The backend and generated app SDK already expose these fields on withdraw forms:

- `accountName`
- `accountNo`
- `bankName`
- `requestNo`

The generated desktop client path for this capability is the wallet operation lane:

- `client.wallet.withdraw(...)`
- `POST /wallet/withdrawals`

The wallet package should expose these as composable withdraw form inputs without turning into a payout-profile management package.

## Goal

Upgrade the wallet withdraw flow from a rail-only interaction into a reusable settlement-ready withdraw form that still stays package-scoped and host-agnostic.

## Approaches considered

### Approach 1: Add `requestNo` only

Pros:

- very small change

Cons:

- still leaves payout details incomplete
- does not materially improve withdraw realism

### Approach 2: Add inline settlement fields inside the withdraw dialog

Pros:

- keeps the capability local to the existing wallet flow
- maps directly onto generated SDK fields
- materially improves reuse and real-world readiness

Cons:

- adds more form state and validation

### Approach 3: Build payout-profile management as a new wallet subsystem

Pros:

- richest end-state

Cons:

- too large for the next iteration
- introduces identity/KYC/account-binding concerns outside the current package scope

## Chosen approach

Approach 2 is the correct next step.

The wallet package should collect settlement details at request time, but stop short of owning saved beneficiary profiles, KYC, or settlement-admin workflows.

## Ownership boundary

`@sdkwork/wallet-pc-react` will own:

- withdraw form fields for settlement-ready submission
- field-level validation rules aligned with the generated SDK form
- destination-aware conditional form sections
- passing `requestNo` through the public wallet withdraw contract

It will not own:

- saved payout profile CRUD
- KYC verification
- beneficiary management
- settlement approval or finance back-office workflows

## Contract changes

Extend `SdkworkWalletWithdrawInput` with:

- `accountName`
- `accountNo`
- `bankName`
- `requestNo`

Extend `SdkworkWalletWithdrawResult` with:

- `requestNo`

## Form design

The dialog should keep the existing top summary and rail selection, then add a settlement details section.

Field behavior:

- Always show `requestNo` as an optional idempotency field.
- Always show `accountName`.
- Always show `accountNo`.
- Show `bankName` only when the selected rail is `bank_account`.

This keeps the UI small while still supporting all current generated SDK fields.

## Validation rules

The package should add only the validation that is stable and directly supported by current backend contracts:

- amount must be greater than zero
- amount must not exceed current available cash
- destination must be selected
- `requestNo`, when present, must match backend-safe format
  - 6 to 64 chars
  - letters, numbers, `_`, `-`
- `accountName` and `accountNo` are required on both the dialog path and direct service usage
- `accountName` and `accountNo` should be trimmed before submission
- `bankName` should be trimmed before submission

Do not invent stricter per-rail validation unless the backend contract requires it.

## UI / Interaction notes

- Keep the dialog reusable and callback-driven.
- Use copy that frames settlement details as the payout target for the current request, not as permanent account configuration.
- If `bank_account` is selected, the bank name field should appear inline below account fields.
- Show validation errors inline or through `StatusNotice`, but keep the interaction fast and deterministic.

## Testing scope

Tests should cover:

- service request mapping with `accountName`, `accountNo`, `bankName`, and `requestNo`
- `requestNo` result mapping
- withdraw dialog field rendering for bank and non-bank rails
- invalid `requestNo` guardrails
- submit enabling only when form validity conditions are met

## Implementation notes

The landed implementation should preserve two stability constraints:

- the submit payload must be sent through `wallet.withdraw`, not legacy `account.withdraw` helpers
- withdraw destination options must stay render-stable so dialog open-state resets only happen when the dialog actually opens, not on every render
- direct service consumers must receive the same settlement-field validation guarantees as dialog users

## Deliverable

After this lands, `@sdkwork/wallet-pc-react` will support a settlement-ready withdraw form that is still cleanly package-bounded, generated-SDK aligned, and reusable across desktop wallet entry surfaces.
