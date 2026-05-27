# SDKWork Appbase App Template Storage Design

## Goal

Add a reusable SDKWork appbase storage contract for application templates. An application template is a design-time asset used to create or customize an application quickly during development.

The first implementation slice is database-contract only. It does not add ClawRouter admin API routes, portal screens, generated SDK methods, or template execution logic.

## Existing App Center Model

The current ClawRouter App Center does not use `app_*` physical tables. It uses a legacy app main table plus newer studio catalog extension tables:

- `plus_app`: legacy Java-compatible application main table.
- `plus_category`: legacy shared category tree used by app, skill, and course centers.
- `studio_catalog_action`: catalog action and review event log.
- `studio_catalog_asset`: catalog media assets such as covers, screenshots, icons, and preview media.
- `studio_catalog_artifact`: catalog deliverables such as install packages, source bundles, runtime artifacts, and platform-specific releases.

The new appbase template storage must follow this naming and responsibility split. It must not introduce `app_template` as a top-level prefix, and it must not add new `plus_*` tables for appbase-owned design-time assets.

## Core Decisions

1. Use the `studio_` prefix for new design-time tables.
2. Use `app`, not `application`, in table names to stay consistent with `plus_app` and existing App Center language.
3. Add template-specific tables only for template identity, template versions, and template usage facts.
4. Reuse `studio_catalog_asset`, `studio_catalog_artifact`, and `studio_catalog_action` for template media, packages, downloads, ratings, reviews, and usage-facing catalog events.
5. Keep runtime status separate from publish status. Do not repeat the legacy ambiguity where `plus_app.status` is runtime state and `config.portal.marketStatus` is market state.
6. Use integer enums for high-frequency internal state, consistent with the existing app tables and `DATABASE_SPEC.md`.
7. Keep template code and template number as first-class columns because they are lookup and uniqueness fields, not JSON metadata.

## Appbase Package

Create the storage package:

```text
packages/native-rust/studio/sdkwork-studio-storage-sqlx-rust
```

The package exposes:

- `studio_database_tables()`
- `studio_shared_catalog_tables()`
- `studio_app_template_tables()`
- `studio_initial_migration_sql()`
- a storage capability manifest that identifies the app-template table set, catalog table dependencies, migration names, and repository bindings.

The appbase capability catalog gains a `studio` capability with this storage layer as its first standard slice.

## Tables

The first slice owns six table contracts:

- Shared catalog tables:
  - `studio_catalog_action`
  - `studio_catalog_asset`
  - `studio_catalog_artifact`
- App template tables:
  - `studio_app_template`
  - `studio_app_template_version`
  - `studio_app_template_usage`

The shared catalog table definitions must stay compatible with the existing ClawRouter definitions. Appbase may create them with `CREATE TABLE IF NOT EXISTS` for standalone deployments, but ClawRouter integration must not fork or rename them.

## `studio_app_template`

`studio_app_template` is the template main table. It is the design-time equivalent of an app main record, not a published runtime app.

```sql
CREATE TABLE IF NOT EXISTS studio_app_template (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,

    template_no VARCHAR(64) NOT NULL,
    template_code VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    summary VARCHAR(512),
    description TEXT,

    category_id BIGINT,
    category_code VARCHAR(128),

    template_type INTEGER NOT NULL DEFAULT 1,
    runtime_kind VARCHAR(64),
    framework_kind VARCHAR(64),

    status INTEGER NOT NULL DEFAULT 1,
    publish_status INTEGER NOT NULL DEFAULT 1,
    visibility INTEGER NOT NULL DEFAULT 1,

    current_version_id BIGINT,
    current_version VARCHAR(64),

    icon JSONB,
    icon_url VARCHAR(512),
    cover_url VARCHAR(1024),
    resource_list JSONB,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    source_type VARCHAR(64),
    source_ref VARCHAR(512),

    sort_weight INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT FALSE,

    published_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,

    CONSTRAINT uk_studio_app_template_no
        UNIQUE (tenant_id, template_no),
    CONSTRAINT uk_studio_app_template_code
        UNIQUE (tenant_id, organization_id, template_code)
);
```

Indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_studio_app_template_scope_status
    ON studio_app_template (tenant_id, organization_id, status, publish_status, updated_at, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_category
    ON studio_app_template (tenant_id, organization_id, category_id, status, sort_weight, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_type_runtime
    ON studio_app_template (tenant_id, organization_id, template_type, runtime_kind, framework_kind, status, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_featured
    ON studio_app_template (tenant_id, organization_id, featured, publish_status, sort_weight, id);
```

Important field rules:

- `template_no` is the tenant-scoped business number.
- `template_code` is the stable human-readable key for SDK, seed, and admin references.
- `config` carries template-level configuration only. High-frequency filters and uniqueness fields must remain physical columns.
- `resource_list` is a lightweight summary compatible with the `plus_app.resource_list` pattern. Canonical assets and packages are stored in the shared catalog tables.
- `category_id` is an optional integration reference. It must not require `plus_category` in appbase standalone deployments.
- `category_code` is the portable category identifier for appbase-only deployments.

## `studio_app_template_version`

`studio_app_template_version` stores immutable template version facts. Development scaffolds must be traceable to a version, not just the current template record.

```sql
CREATE TABLE IF NOT EXISTS studio_app_template_version (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    v BIGINT NOT NULL DEFAULT 0,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,

    template_id BIGINT NOT NULL,
    version_no VARCHAR(64) NOT NULL,
    lifecycle_status INTEGER NOT NULL DEFAULT 1,

    title VARCHAR(255),
    summary VARCHAR(512),
    release_notes TEXT,

    app_config_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
    default_app_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    variable_schema JSONB NOT NULL DEFAULT '{}'::jsonb,

    file_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    dependency_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    capability_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,

    scaffold_artifact_id BIGINT,
    preview_artifact_id BIGINT,
    checksum_hash VARCHAR(128),
    source_ref VARCHAR(512),

    published_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    created_by BIGINT,

    CONSTRAINT uk_studio_app_template_version_no
        UNIQUE (tenant_id, organization_id, template_id, version_no)
);
```

Indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_template
    ON studio_app_template_version (tenant_id, organization_id, template_id, lifecycle_status, published_at, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_version_artifact
    ON studio_app_template_version (tenant_id, organization_id, scaffold_artifact_id, preview_artifact_id);
```

Important field rules:

- `app_config_schema` describes the app configuration accepted by the template.
- `default_app_config` stores default values used when creating a new app from the template.
- `variable_schema` describes template variables such as app name, package name, route prefix, theme, and module selection.
- `file_manifest` stores file descriptors, not large file bodies.
- `dependency_manifest` stores dependency descriptors for packages such as npm, Cargo, Flutter, or Maven.
- `capability_manifest` declares required appbase capabilities such as `iam`, `commerce`, `messaging`, or `intelligence-runtime`.
- `scaffold_artifact_id` and `preview_artifact_id` reference rows in `studio_catalog_artifact`.

## `studio_app_template_usage`

`studio_app_template_usage` is an audit fact table for creating apps or projects from templates. It is not an action aggregate and should not replace `studio_catalog_action`.

```sql
CREATE TABLE IF NOT EXISTS studio_app_template_usage (
    id BIGINT PRIMARY KEY,
    uuid VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tenant_id BIGINT NOT NULL DEFAULT 0,
    organization_id BIGINT NOT NULL DEFAULT 0,
    data_scope INTEGER NOT NULL DEFAULT 0,
    user_id BIGINT,

    template_id BIGINT NOT NULL,
    template_version_id BIGINT,

    target_type INTEGER NOT NULL,
    target_id BIGINT,
    target_ref VARCHAR(512),

    usage_type INTEGER NOT NULL DEFAULT 1,
    request_id VARCHAR(128),
    trace_id VARCHAR(128),

    input_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    output_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,

    status INTEGER NOT NULL DEFAULT 1,
    error_code VARCHAR(128),
    error_message VARCHAR(1000)
);
```

Indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_template
    ON studio_app_template_usage (tenant_id, organization_id, template_id, template_version_id, created_at, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_target
    ON studio_app_template_usage (tenant_id, organization_id, target_type, target_id, created_at, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_user
    ON studio_app_template_usage (tenant_id, organization_id, user_id, created_at, id);

CREATE INDEX IF NOT EXISTS idx_studio_app_template_usage_request
    ON studio_app_template_usage (tenant_id, request_id);
```

Important field rules:

- `target_type` and `target_id` identify the generated object, such as a future `studio_app`, a legacy `plus_app`, or a project record owned by a host application.
- `target_ref` allows a stable app key or external project reference when no numeric target exists yet.
- `input_snapshot` records template variables and creation options.
- `output_snapshot` records generated app metadata, generated artifact references, and post-create details.
- Failed usage attempts are retained with `status`, `error_code`, and `error_message` for diagnosis.

## Shared Catalog Usage

Template media uses `studio_catalog_asset`:

```text
target_type = 16
target_id = studio_app_template.id
metadata.itemType = "app_template_asset"
metadata.templateVersionId = optional version id
```

Expected asset types:

- `COVER`
- `ICON`
- `SCREENSHOT`
- `PREVIEW_IMAGE`
- `DEMO_VIDEO`

Template packages use `studio_catalog_artifact`:

```text
target_type = 16
target_id = studio_app_template.id
metadata.itemType = "app_template_artifact"
metadata.templateVersionId = studio_app_template_version.id
```

Expected artifact types:

- `SCAFFOLD_PACKAGE`
- `SOURCE_ARCHIVE`
- `PREVIEW_BUILD`
- `GENERATOR_PACKAGE`

Template downloads, ratings, reviews, bookmarks, and public catalog activity use `studio_catalog_action`:

```text
target_type = 16
target_id = studio_app_template.id
```

The existing app center uses `target_type = 15` for apps. The app template target type is appended as `16`.

## Enum Contracts

Common status:

```text
1 ACTIVE
2 INACTIVE
3 ARCHIVED
9 DELETED
```

Publish status:

```text
1 DRAFT
2 REVIEWING
3 PUBLISHED
4 OFFLINE
5 DEPRECATED
```

Visibility:

```text
1 PRIVATE
2 ORGANIZATION
3 TENANT
4 PUBLIC
```

Template type:

```text
1 WEB_APP
2 DESKTOP_APP
3 MOBILE_APP
4 MINI_PROGRAM
5 AGENT_APP
6 WORKFLOW_APP
99 CUSTOM
```

Template version lifecycle status:

```text
1 DRAFT
2 PUBLISHED
3 DEPRECATED
9 DELETED
```

Usage type:

```text
1 CREATE_APP
2 CREATE_PROJECT
3 PREVIEW
4 EXPORT
5 UPGRADE_CHECK
```

Catalog target type:

```text
15 APP
16 APP_TEMPLATE
```

## Migration Layout

The storage package uses domain-ordered migrations:

```text
0001_studio_catalog.sql
0002_studio_app_template.sql
```

`0001_studio_catalog.sql` contains compatible `CREATE TABLE IF NOT EXISTS` definitions for:

- `studio_catalog_action`
- `studio_catalog_asset`
- `studio_catalog_artifact`

`0002_studio_app_template.sql` contains:

- `studio_app_template`
- `studio_app_template_version`
- `studio_app_template_usage`

If the implementation chooses one initial SQL file for the first slice, it must still expose the two logical migration names in the manifest so later packages can depend on the shared catalog separately from app templates.

## Test Plan

Add `tests/studio_storage_standard.rs` for the new Rust storage package.

Required tests:

- The studio table catalog contains the three shared catalog tables and the three app template tables.
- New template tables start with `studio_app_template`.
- The package does not expose top-level `app_template`, `application_template`, or new `plus_*` table names.
- The initial migration SQL creates `studio_app_template`, `studio_app_template_version`, and `studio_app_template_usage`.
- The initial migration SQL declares `tenant_id`, `organization_id`, `data_scope`, `status`, `created_at`, `updated_at`, and `uuid` for each template table.
- `studio_app_template` has unique constraints for `(tenant_id, template_no)` and `(tenant_id, organization_id, template_code)`.
- `studio_app_template_version` has unique constraint `(tenant_id, organization_id, template_id, version_no)`.
- The migration includes all required hot-path indexes listed in this spec.
- The manifest declares `APP_TEMPLATE` target type as `16` and `APP` target type as `15`.
- The manifest declares `studio_catalog_asset` and `studio_catalog_artifact` as the asset and package stores for app templates.

## Non-Goals

- No ClawRouter admin API implementation in this slice.
- No portal UI for template management in this slice.
- No generated TypeScript SDK changes in this slice.
- No template rendering or scaffold execution engine in this slice.
- No migration from `plus_app` to `studio_app` in this slice.
- No new `plus_app_template` table.
- No duplicate template-specific asset or artifact table.

## Future Integration Path

When ClawRouter admin app center consumes this contract, it should:

1. Add backend endpoints under the existing admin app center surface for template list, detail, create, update, publish, offline, and use-from-template.
2. Store template covers, screenshots, and packages in `studio_catalog_asset` and `studio_catalog_artifact`.
3. Write `studio_app_template_usage` when a user creates a legacy `plus_app` or future `studio_app` from a template.
4. Preserve the legacy `plus_app` compatibility rule until the product explicitly migrates app main records to `studio_app`.
5. Avoid adding `market_status` or `app_key` columns to `plus_app`; template code belongs to `studio_app_template.template_code`.
