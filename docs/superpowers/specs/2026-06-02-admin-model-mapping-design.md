# Admin Model Mapping Design

## Goal

Add an admin model mapping configuration surface under `/admin/model/mappings` so operators can map a requested model name to an effective catalog/upstream model by global, vendor, or channel scope.

## Scope And Priority

Model mapping uses one table, `ai_model_mapping_rule`, with three scopes:

- `global`: applies to every request when no narrower rule matches.
- `vendor`: applies when the selected or resolved vendor matches `vendor_code`.
- `channel`: applies when the selected channel/account matches `channel_id`.

The fixed resolution order is `channel > vendor > global`. Within one scope, enabled active rules are ordered by `priority ASC`, `updated_at DESC`, then `id DESC`.

## Product Behavior

The admin page lists mapping rules with scope, source model, target model, target provider model, priority, status, and effective window. The form supports exact-match mappings only in the first version. This matches common gateway operations needs: model aliasing, vendor-specific provider model naming, and account-level overrides for upstream model variants.

The page also provides a resolve/preview action. Given request model, optional vendor, and optional channel, the backend returns the selected rule and the resolved effective model. This is intentionally included in the first version because model routing issues are hard to debug without explaining which rule won.

## Database

`ai_model_mapping_rule` belongs to the AI domain and is owned by `ai-routing-service`.

Key fields:

- scope: `scope_type`, `vendor_id`, `vendor_code`, `channel_id`, `channel_code`
- source identity: `source_model`, `source_catalog_key`, `source_vendor_code`
- target identity: `target_model`, `target_catalog_key`, `target_vendor_code`, `target_provider_model`, `target_provider_native_model`
- rule controls: `mapping_mode`, `match_type`, `priority`, `enabled`, `effective_from`, `effective_to`, `description`, `metadata`

The first implementation supports `mapping_mode=alias` and `match_type=exact`; the table keeps fields for future rewrite/fallback/block modes without changing the schema.

## API

Backend management APIs:

- `GET /backend/v3/api/ai/model_mappings`
- `POST /backend/v3/api/ai/model_mappings`
- `PATCH /backend/v3/api/ai/model_mappings/{mappingId}`
- `DELETE /backend/v3/api/ai/model_mappings/{mappingId}`
- `POST /backend/v3/api/ai/model_mappings/resolve`

The frontend must call these through generated `@sdkwork/clawrouter-backend-sdk`, exposed as `getClawRouterBackendSdkClient().ai.modelMappings.*`.
