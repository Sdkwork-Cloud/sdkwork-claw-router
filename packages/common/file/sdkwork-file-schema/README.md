# SDKWork File Schema

Canonical database schema definitions and PostgreSQL migration SQL for the
SDKWork file platform.

The schema package keeps database standards testable: core tables, indexes,
unique constraints, non-negative byte checks, append-only usage ledger
protection, storage usage counters and historical snapshots, and
storage-internal field boundaries are all covered by tests. Provider types,
logical bucket scopes, quota policy scopes, and usage counter/snapshot scopes
are enforced as PostgreSQL check constraints from the canonical
`@sdkwork/file-contracts` vocabulary. Upload mode, drive space type, and drive
node type are also enforced with canonical check constraints so API enum
contracts and database state cannot drift. It also defines the storage
reconciliation and garbage-collection governance tables used by backend
operations to audit missing objects, orphan objects, checksum mismatches, and
dry-run deletion jobs.
