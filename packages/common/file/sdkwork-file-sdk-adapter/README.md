# SDKWork File SDK Adapter

Approved wrapper boundary between generated SDK clients and the SDKWork file
platform service/component interfaces.

This package does not perform HTTP, configure auth headers, or fork generated
SDK code. It accepts semantic app/backend SDK wrapper clients, maps them to the
file platform service and admin storage port shapes, and validates the mapping
against the canonical OpenAPI contracts. Backend admin mappings cover storage
provider, bucket, and quota-policy list/create commands, usage counters,
append-only usage ledger queries, and historical usage snapshots. They also map
reconciliation run list/create and garbage-collection job create operations
through semantic generated SDK wrapper methods. Mutating storage configuration
commands carry explicit idempotency keys at the port boundary; the adapter still
delegates only to semantic generated SDK wrapper methods.
Adapter standard validation also requires command mappings to point at OpenAPI
operations with JSON request bodies, so generated SDK wrappers cannot silently
degrade command inputs to untyped or transport-specific shapes.
Every adapter-mapped operation must also point at an OpenAPI operation with a
typed JSON `200` response schema. This keeps app service facades and backend
admin storage ports aligned with generated SDK return types for both commands
and read/list operations.
