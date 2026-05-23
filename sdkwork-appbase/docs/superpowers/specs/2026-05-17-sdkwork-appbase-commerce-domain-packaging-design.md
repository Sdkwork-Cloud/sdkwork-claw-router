# SDKWork Appbase Commerce Local/Private Runtime Design

## Context

`sdkwork-appbase` is the foundation for local and private SDKWork applications. Commerce is therefore not just a TypeScript contract or PC React UI concern. It must provide a real local/private backend runtime implemented in Rust, while keeping TypeScript contracts and PC React UI aligned to the same standard.

The existing commerce foundation already has useful pieces:

```text
packages/common/commerce/
  sdkwork-commerce-contracts
  sdkwork-commerce-sdk-ports
  sdkwork-commerce-service
  sdkwork-commerce-runtime

packages/native-rust/commerce/
  sdkwork-commerce-core-rust
  sdkwork-commerce-http-rust
  sdkwork-commerce-storage-sqlx-rust
  sdkwork-commerce-tauri-rust

packages/pc-react/commerce/*
```

The problem is that both TypeScript and Rust are currently too horizontal. Package names expose technical layers first, while the product needs business-domain building blocks. The Rust crates also stop at route catalogs, status enums, SQL table catalogs, and a Tauri manifest. They do not yet provide the local/private commerce backend services required by a complete appbase runtime.

This is a new standard. Compatibility with the previous horizontal package layout is not a goal. Correctness, domain clarity, local/private deployability, and long-term maintainability are more important than migration convenience.

## Goal

Build a standard commerce platform for `sdkwork-appbase` with three aligned layers:

```text
TypeScript common domain contracts and service facades
Rust local/private backend services
PC React reusable UI modules
```

Rust is the source of execution for local and private deployments. TypeScript and UI packages consume the same route, DTO, status, error, and capability contracts.

## Non Goals

This design does not keep the existing horizontal TypeScript packages as compatibility targets.

This design does not implement app-specific adapters inside `sdkwork-appbase`.

This design does not put concrete payment providers, claw-router SDKs, Java service classes, or SaaS-only DTOs into appbase.

This design does not attempt to implement every commerce domain in one pass. The first implementation slice proves the standard through `core`, `account`, `promotion`, `order`, `payment`, `membership`, `invoice`, `runtime`, `storage`, `http`, and `tauri`.

## Deployment Modes

### SaaS

SaaS mode may use Java/Spring services or other hosted backend implementations. Appbase must still define the contract standard, but it does not own SaaS execution.

### Local

Local mode uses the appbase Rust backend as the authoritative commerce runtime. It should support embedded desktop/Tauri usage and local HTTP usage. SQLite through SQLx is the default persistence target.

### Private

Private mode uses the appbase Rust backend as the authoritative commerce runtime in a private deployment. It should use the same service layer as local mode and support SQLx-backed storage such as PostgreSQL or SQLite.

## Architecture

```text
PC React UI
  -> TypeScript domain runtime/service facade
  -> Local/private host adapter
  -> Rust HTTP handler or Tauri command
  -> Rust commerce runtime
  -> Rust domain service
  -> Rust repository trait
  -> SQLx storage implementation
```

HTTP and Tauri are transport layers. They must both call the same Rust runtime services. Business logic must not be duplicated between HTTP handlers and Tauri commands.

## Business-Domain Package Model

TypeScript common packages and Rust crates use the same business vocabulary.

### TypeScript packages

```text
packages/common/commerce/
  sdkwork-commerce-core/
  sdkwork-commerce-account/
  sdkwork-commerce-catalog/
  sdkwork-commerce-promotion/
  sdkwork-commerce-order/
  sdkwork-commerce-payment/
  sdkwork-commerce-membership/
  sdkwork-commerce-invoice/
  sdkwork-commerce-billing/
  sdkwork-commerce-checkout/
  sdkwork-commerce/
```

Each package contains:

```text
src/
  contracts/
  ports/
  service/
  runtime/
  testing/
  index.ts
tests/
specs/
```

### Rust crates

```text
packages/native-rust/commerce/
  sdkwork-commerce-core-rust/
  sdkwork-commerce-account-rust/
  sdkwork-commerce-catalog-rust/
  sdkwork-commerce-promotion-rust/
  sdkwork-commerce-order-rust/
  sdkwork-commerce-payment-rust/
  sdkwork-commerce-membership-rust/
  sdkwork-commerce-invoice-rust/
  sdkwork-commerce-billing-rust/
  sdkwork-commerce-checkout-rust/
  sdkwork-commerce-runtime-rust/
  sdkwork-commerce-storage-sqlx-rust/
  sdkwork-commerce-http-rust/
  sdkwork-commerce-tauri-rust/
```

Business-domain crates own domain rules and service ports. Infrastructure crates own runtime composition, SQLx persistence, HTTP transport, and Tauri transport.

## Rust Crate Standard

Every Rust business-domain crate should follow this shape:

```text
src/
  domain/
    mod.rs
    models.rs
    status.rs
    errors.rs
  commands/
    mod.rs
  queries/
    mod.rs
  ports/
    mod.rs
    repository.rs
  service/
    mod.rs
  validation/
    mod.rs
  lib.rs
tests/
  *_standard.rs
```

Rules:

- `domain` owns value objects, status enums, aggregates, and errors.
- `commands` defines write inputs and expected write outputs.
- `queries` defines read inputs and read projections.
- `ports` defines repository and external provider traits.
- `service` owns business rules and state transitions.
- `validation` owns reusable validation helpers.
- Tests must cover status transitions, validation, idempotency expectations, and repository-contract behavior.

## Core Domain Ownership

### `core`

Owns:

- deployment mode and environment
- runtime context
- surface profile
- subject identifiers
- amount and currency value objects
- request number and idempotency key
- standard service errors
- response envelope
- capability metadata
- feature flag metadata

### `account`

Owns:

- asset accounts
- wallet, points, and token balance views
- immutable ledger entries
- balance adjustments
- prehold, settle, and release
- exchange rules and exchange transactions

Financial correctness lives here. Ledger entries are append-only. Corrections are reverse entries, not mutation of prior entries.

### `catalog`

Owns:

- product
- SKU
- package
- pricing plan
- recharge package
- sellable plan metadata
- quote inputs and quote outputs

Catalog says what can be sold. It does not create orders or payments.

### `promotion`

Owns:

- coupon campaign
- coupon template
- coupon batch
- coupon code
- user coupon
- claim
- redeem
- rollback
- discount applicability

Promotion can be used by checkout and order. It does not execute payment.

### `order`

Owns:

- order draft
- order item
- amount breakdown
- order lifecycle state
- cancellation
- expiration
- fulfillment references
- order list and detail projections
- links to payment and invoice

Order records the commercial transaction. It does not own payment provider behavior.

### `payment`

Owns:

- payment method
- payment intent
- payment attempt
- payment status polling
- close and reconcile
- payment webhook event
- refund request
- refund record
- refund status

Concrete provider implementations are injected through provider ports.

### `membership`

Owns:

- VIP level and benefit
- VIP membership
- subscription lifecycle
- entitlement
- quota
- privilege usage
- renewal, upgrade, downgrade, expiration, and grace period

Membership owns long-lived access after a commercial transaction succeeds.

### `invoice`

Owns:

- invoice title
- tax profile
- invoice application
- invoice item
- invoice document
- invoice issue and review status
- invoice download metadata
- order and payment references

### `billing`

Owns projections:

- usage statement
- billing period
- spend summary
- budget policy
- settlement
- finance query view
- billing health evaluation

Billing does not own order, payment, invoice, account, or membership entities.

### `checkout`

Owns orchestration:

- checkout source
- checkout session
- selected coupon
- selected payment method
- invoice preference
- order intent creation
- payment intent creation
- submit result

Checkout orchestrates domain services. It does not persist the core entities itself.

## Rust Local/Private Backend Requirements

### Idempotency

Every write command that can create financial or commercial side effects must pass through an idempotency executor.

Required fields:

```text
tenant_id
scope
idempotency_key
request_hash
response_json
status
locked_until
expires_at
created_at
updated_at
```

Repeated requests with the same key and request hash must return the first completed result. Reused keys with different hashes must fail with conflict.

### Transactions

The following operations require one transaction boundary:

- create order with items and amount breakdown
- create payment intent and payment attempt
- mark payment succeeded, update order, and write ledger
- settle or release prehold and write ledger
- redeem coupon and record discount usage
- issue invoice from an eligible order/payment
- activate membership after paid order

### Immutable Ledger

Ledger entries are append-only. No service may update an existing ledger amount, direction, request number, or balance result.

### State Machines

Order state:

```text
draft -> pending_payment -> paid -> fulfilled -> completed
pending_payment -> cancelled
pending_payment -> expired
paid -> refunding -> refunded
```

Payment state:

```text
created -> pending -> succeeded
created -> pending -> failed
created -> pending -> closed
succeeded -> refunding -> refunded
```

Invoice state:

```text
draft -> submitted -> reviewing -> issued
submitted -> cancelled
reviewing -> rejected
issued -> voided
```

Invalid transitions must fail with `invalid-state`.

### Provider Ports

Appbase defines provider traits. Hosts provide implementations.

Payment provider port:

```text
create_payment_intent
query_payment_status
close_payment
refund
verify_webhook
```

Invoice provider port:

```text
issue_invoice
download_invoice
void_invoice
```

No payment provider SDK should be hardcoded into appbase.

### Storage

`sdkwork-commerce-storage-sqlx-rust` owns SQLx repositories, schema checks, migrations, and transaction helpers.

Migration files should be domain ordered:

```text
0001_core_idempotency.sql
0002_account_ledger.sql
0003_promotion_coupon.sql
0004_order.sql
0005_payment_refund.sql
0006_membership.sql
0007_invoice.sql
0008_catalog.sql
0009_billing_statement.sql
0010_checkout_projection.sql
```

The first implementation slice only needs migrations for core idempotency, account ledger, promotion coupon, order, payment, membership, and invoice.

### HTTP

`sdkwork-commerce-http-rust` owns HTTP route definitions and handler contracts for:

```text
/app/v3/api/billing/account/summary
/app/v3/api/billing/users/current/coupons
/app/v3/api/billing/coupons/claims
/app/v3/api/billing/coupons/{couponId}
/app/v3/api/billing/coupons/{couponId}/redeem
/app/v3/api/billing/orders
/app/v3/api/billing/orders/{orderId}
/app/v3/api/billing/payments/intents
/app/v3/api/billing/payments/records
/app/v3/api/billing/vip/levels
/app/v3/api/billing/vip/membership
/app/v3/api/billing/vip/memberships/activate
/app/v3/api/billing/vip/entitlements
/app/v3/api/billing/invoices
```

Backend/admin routes are modeled separately from app routes.

### Tauri

`sdkwork-commerce-tauri-rust` owns Tauri command manifests and command handler contracts. Tauri commands must call the same runtime services as HTTP handlers.

First-slice commands:

```text
commerce_account_summary
commerce_coupons_current_user_list
commerce_coupons_claim
commerce_coupons_retrieve
commerce_coupons_redeem
commerce_orders_list
commerce_orders_create
commerce_payments_create_intent
commerce_vip_levels_list
commerce_vip_membership_current
commerce_vip_membership_activate
commerce_vip_entitlements_list
commerce_invoices_list
commerce_invoices_create
```

## TypeScript and Rust Contract Parity

TypeScript and Rust must agree on:

- route path
- operation ID
- request DTO
- response DTO
- status enum
- error code
- capability name
- surface profile

The first standard uses mirrored tests. Later generations can move to manifest-driven code generation.

## Surface Profiles

Standard profiles:

```text
app
console
admin
```

App profile handles user self-service. Console profile handles operator workspace behavior. Admin profile handles management-plane operations. Profiles are not separate business domains.

## Error Model

Standard errors:

```text
unauthenticated
unauthorized
not-found
conflict
invalid-state
validation
transport
unsupported-capability
provider-unavailable
storage
unknown
```

Read APIs may return safe empty projections when data is absent. Mutations must fail clearly when capabilities or providers are unavailable.

## First Implementation Slice

The first implementation slice builds a Rust-first local/private vertical standard:

```text
core
account
promotion
order
payment
membership
invoice
runtime
storage-sqlx
http
tauri
```

This slice proves:

- domain crates are business-named
- business crates follow the standard `domain`, `commands`, `queries`, `ports`, `service`, and `validation` module layout
- runtime context and errors are centralized
- runtime exposes service contracts and operation-to-service bindings for HTTP and Tauri transports
- coupon and VIP capabilities are first-class local/private backend domains
- order, payment, and invoice status machines are enforced
- account ledger rules are append-only
- storage catalog includes first-slice tables and migrations
- HTTP routes expose standard app billing paths
- Tauri manifest exposes matching commands
- tests verify the standard

TypeScript and PC React migration follow after this Rust backend standard is in place.

## Acceptance Criteria

The standard is acceptable when:

- Rust business crates compile independently.
- Rust runtime, storage, HTTP, and Tauri crates compile independently.
- First-slice tests verify amount validation, runtime context, state machines, append-only ledger intent, route parity, table catalog, migration names, and Tauri command manifest.
- Package and crate names reveal business capabilities.
- No app-specific SDK is imported into appbase.
- No compatibility package is required for the new standard.
- Local/private Rust backend is treated as a first-class execution layer, not an adapter afterthought.

## Implementation Order

1. Update the Rust core crate with final runtime context, surface profile, service error, idempotency, amount, and capability primitives.
2. Add `account`, `promotion`, `order`, `payment`, `membership`, and `invoice` Rust business crates.
3. Add `runtime` crate to compose the first-slice services and deployment config.
4. Split every business crate into `domain`, `commands`, `queries`, `ports`, `service`, and `validation` modules.
5. Expose reusable service contracts for each business crate and bind app operation IDs to runtime services.
6. Upgrade `storage-sqlx` to expose first-slice table catalog, domain migration names, and repository boundary contracts.
7. Upgrade `http` routes to first-slice app routes for account, coupon, order, payment, VIP, and invoice.
8. Upgrade `tauri` manifest to expose matching command names and command-to-service bindings.
9. Run focused cargo tests for every touched Rust crate.

## Approval

The user approved autonomous execution and clarified that this is a new application standard. The design intentionally prioritizes correctness and standardization over compatibility with the previous horizontal package layout.
