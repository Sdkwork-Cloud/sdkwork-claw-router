from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from tools.frontend_contract_loader import DEFAULT_CONTRACT_INDEX, DEFAULT_CONTRACT_SNAPSHOT

try:
    import yaml
except ImportError as exc:  # pragma: no cover - exercised only on missing tooling
    yaml = None
    _YAML_IMPORT_ERROR = exc
else:
    _YAML_IMPORT_ERROR = None


OBSOLETE_SKILLS_HUB_TABLES = {
    "studio_skill_listing",
    "studio_skill_version",
    "studio_skill_media",
}

SKILLS_HUB_ROUTES = {"/skills-hub", "/skills-hub/:id"}

TYPE_BINDING_TARGETS = {"java", "rust", "typescript", "openapi"}

DOMAIN_NAME_REQUIRED_CODES = {
    "model_vendor": {"unknown"},
    "price_side": {"official_reference", "upstream_cost", "customer_charge", "internal_transfer"},
    "billing_mode": {
        "token",
        "fixed_price",
        "per_request",
        "per_result",
        "per_item",
        "duration",
        "character",
        "storage",
        "bandwidth",
        "tiered",
        "expression",
        "image",
        "audio",
        "video",
    },
    "billing_meter": {
        "llm_input_token",
        "llm_output_token",
        "llm_reasoning_token",
        "llm_cache_write_token",
        "llm_cache_read_token",
        "llm_cache_storage_token_hour",
        "embedding_input_token",
        "embedding_image",
        "image_input_token",
        "image_output_token",
        "image_result",
        "image_pixel",
        "image_megapixel",
        "audio_input_second",
        "audio_output_second",
        "audio_input_minute",
        "audio_output_minute",
        "tts_input_character",
        "speech_character",
        "stt_audio_minute",
        "video_input_second",
        "video_output_second",
        "video_result",
        "music_output_second",
        "sfx_result",
        "rerank_search",
        "rerank_document",
        "api_request",
        "api_result",
        "api_item",
        "tool_call",
        "web_search_call",
        "file_search_call",
        "code_interpreter_session",
        "container_session",
        "storage_gb_day",
        "bandwidth_gb",
        "unknown",
    },
    "integration_provider_type": {
        "model_vendor_direct",
        "cloud_platform",
        "relay_aggregator",
        "self_hosted_gateway",
        "local_runtime",
        "custom",
        "unknown",
    },
}

DOMAIN_NAMES_REQUIRING_TYPE_BINDINGS = {"model_vendor", "billing_meter", "integration_provider_type"}

FORBIDDEN_PRICING_TABLES = {"ai_pricing_group"}

FORBIDDEN_LEGACY_IDENTITY_TABLES = {
    "plus_api_key",
    "plus_oauth_account",
    "plus_organization",
    "plus_organization_member",
    "plus_permission",
    "plus_role",
    "plus_role_permission",
    "plus_tenant",
    "plus_user",
    "plus_user_role",
}

APPBASE_COMMERCE_LEGACY_ALIASES: dict[str, str] = {
    "ops_coupon_issue_batch": "commerce_coupon_issue_batch",
    "plus_account": "commerce_account",
    "plus_account_exchange_config": "commerce_exchange_rule",
    "plus_account_history": "commerce_account_ledger_entry",
    "plus_coupon": "commerce_coupon_template",
    "plus_coupon_template": "commerce_coupon_template",
    "plus_currency": "sdkwork-appbase commerce money value fields",
    "plus_exchange_rate": "sdkwork-appbase commerce exchange rules",
    "plus_invoice": "commerce_invoice",
    "plus_invoice_item": "commerce_invoice_item",
    "plus_invoice_record": "commerce_invoice",
    "plus_ledger_bridge": "commerce_account_ledger_entry",
    "plus_order": "commerce_order",
    "plus_order_dispatch_rule": "sdkwork-appbase commerce order policy",
    "plus_order_item": "commerce_order_item",
    "plus_order_worker_dispatch_profile": "sdkwork-appbase commerce order policy",
    "plus_payment": "commerce_payment_attempt",
    "plus_payment_webhook_event": "commerce_payment_webhook_event",
    "plus_product": "commerce_product",
    "plus_refund": "commerce_refund",
    "plus_shop": "commerce_product",
    "plus_shopping_cart": "commerce_order",
    "plus_shopping_cart_item": "commerce_order_item",
    "plus_sku": "commerce_sku",
    "plus_user_coupon": "commerce_coupon",
    "plus_vip_benefit": "commerce_vip_entitlement",
    "plus_vip_benefit_usage": "commerce_vip_entitlement_usage",
    "plus_vip_level": "commerce_vip_level",
    "plus_vip_level_benefit": "commerce_vip_entitlement",
    "plus_vip_pack": "commerce_recharge_package",
    "plus_vip_pack_group": "commerce_recharge_package",
    "plus_vip_point_change": "commerce_account_ledger_entry",
    "plus_vip_recharge": "commerce_order",
    "plus_vip_recharge_method": "commerce_payment_method",
    "plus_vip_recharge_pack": "commerce_recharge_package",
    "plus_vip_user": "commerce_vip_membership",
}

REQUIRED_TABLE_COLUMNS = {
    "ai_model_vendor": {"vendor_code", "display_name"},
    "ai_model": {
        "model",
        "vendor_code",
        "capability",
        "capabilities",
        "modalities",
        "default_pricing_id",
    },
    "ai_model_pricing": {
        "model",
        "vendor_code",
        "provider_code",
        "price_side",
        "pricing_plan_id",
        "billing_mode",
        "billing_meter_code",
        "unit_price",
        "currency",
        "reference_price_id",
        "reference_multiplier",
        "effective_from",
        "effective_to",
    },
    "ai_billing_meter": {"meter_code", "billing_mode", "default_unit", "quantity_source"},
    "ai_pricing_plan": {"plan_code", "plan_scope", "base_price_side", "default_multiplier", "default_markup_amount"},
    "ai_pricing_plan_binding": {"pricing_plan_id", "subject_type", "subject_id", "priority", "effective_from"},
    "ai_pricing_rule": {
        "pricing_plan_id",
        "price_side",
        "reference_price_side",
        "billing_mode",
        "billing_meter_code",
        "formula_mode",
        "multiplier",
        "expression",
    },
    "ai_pricing_tier": {
        "pricing_rule_id",
        "billing_mode",
        "billing_meter_code",
        "input_unit_price",
        "output_unit_price",
        "image_unit_price",
        "audio_unit_price",
        "video_unit_price",
        "per_request_price",
    },
    "iam_gateway_api_key": {"group_id", "key_hash", "policy_id", "quota_policy_id", "rate_limit_policy_id"},
    "iam_gateway_api_key_group": {"pricing_plan_id", "pricing_plan_code", "official_price_multiplier", "billing_type"},
    "integration_provider": {"provider_code", "default_vendor_code", "integration_type", "capabilities"},
    "integration_channel_model": {"model", "vendor_code", "provider_model", "capability"},
}

MESSAGING_STANDARD_TABLES: tuple[str, ...] = (
    "messaging_provider_capability",
    "messaging_sender_identity",
    "messaging_template",
    "messaging_template_version",
    "messaging_template_variant",
    "messaging_template_binding",
    "messaging_route_rule",
    "messaging_route_rule_target",
    "messaging_send_request",
    "messaging_send_attempt",
    "messaging_delivery_event",
    "messaging_suppression",
    "messaging_rate_limit_bucket",
)

MESSAGING_TABLE_NAME_TOKENS: tuple[str, ...] = (
    "email",
    "provider",
    "route",
    "send",
    "sender",
    "sms",
    "template",
    "webhook",
)

@dataclass(frozen=True)
class SchemaGuardianResult:
    ok: bool
    messages: list[str]


class SchemaGuardian:
    """Executable guardrails for the Claw Router schema registry."""

    def __init__(
        self,
        root: Path,
        registry_path: Path | None = None,
        test_schema_path: Path | None = None,
    ) -> None:
        self.root = Path(root).resolve()
        self.registry_path = (
            Path(registry_path).resolve()
            if registry_path is not None
            else self.root / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        )
        self.test_schema_path = Path(test_schema_path).resolve() if test_schema_path is not None else None

    def run(self) -> SchemaGuardianResult:
        data = self._load_registry()
        tables = data.get("tables", [])
        if not isinstance(tables, list):
            return SchemaGuardianResult(ok=False, messages=["tables must be a list"])

        by_table = {
            item.get("table"): item
            for item in tables
            if isinstance(item, dict) and isinstance(item.get("table"), str)
        }

        messages: list[str] = []
        messages.extend(self._check_forbidden_synonyms(data, by_table))
        messages.extend(self._check_legacy_identity_standard(data, by_table))
        messages.extend(self._check_appbase_commerce_legacy_aliases(by_table))
        messages.extend(self._check_appbase_commerce_legacy_alias_references())
        messages.extend(self._check_skills_hub_tables(by_table))
        messages.extend(self._check_domain_names(data, by_table))
        messages.extend(self._check_pricing_and_billing_contracts(by_table))
        messages.extend(self._check_messaging_delivery_standard(by_table))
        messages.extend(self._check_projection_source_contracts(by_table))
        messages.extend(self._check_api_prefixes(data))
        messages.extend(self._check_table_naming_guardrails(data, by_table))
        messages.extend(self._check_frontend_route_api_surfaces(by_table))

        return SchemaGuardianResult(ok=not messages, messages=messages)

    def _load_registry(self) -> dict[str, Any]:
        if yaml is None:
            raise RuntimeError("PyYAML is required to load schema registry YAML") from _YAML_IMPORT_ERROR
        if not self.registry_path.exists():
            raise FileNotFoundError(f"schema registry not found: {self.registry_path}")
        content = self.registry_path.read_text(encoding="utf-8")
        data = yaml.safe_load(content)
        if data is None:
            return {}
        if not isinstance(data, dict):
            raise ValueError("schema registry root must be a mapping")
        return data

    def _check_forbidden_synonyms(self, data: dict[str, Any], by_table: dict[str, dict[str, Any]]) -> list[str]:
        guardrails = data.get("schema_registry", {}).get("legacy_compatibility_guardrails", {})
        forbidden_tables = guardrails.get("forbidden_synonym_tables", [])
        if not isinstance(forbidden_tables, list):
            return ["legacy_compatibility_guardrails.forbidden_synonym_tables must be a list"]

        return [
            f"forbidden synonym table present: {table}"
            for table in forbidden_tables
            if isinstance(table, str) and table in by_table
        ]

    def _check_appbase_commerce_legacy_aliases(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, replacement in sorted(APPBASE_COMMERCE_LEGACY_ALIASES.items()):
            if table in by_table:
                messages.append(f"appbase commerce legacy alias must be removed: {table} -> {replacement}")
        return messages

    def _check_appbase_commerce_legacy_alias_references(self) -> list[str]:
        checked_sources = [
            *self._frontend_contract_source_paths(),
            self.root / "tools" / "api_contract_manifest.py",
        ]
        messages: list[str] = []

        for source in checked_sources:
            if not source.exists():
                continue
            text = source.read_text(encoding="utf-8")
            for alias, replacement in sorted(APPBASE_COMMERCE_LEGACY_ALIASES.items()):
                if alias in text:
                    messages.append(
                        f"{source.relative_to(self.root)} references appbase commerce legacy alias: {alias} -> {replacement}"
                    )

        return messages

    def _frontend_contract_source_paths(self) -> list[Path]:
        index_path = self.root / DEFAULT_CONTRACT_INDEX
        if not index_path.is_file():
            return [self.root / DEFAULT_CONTRACT_SNAPSHOT]
        sources = [index_path]
        index = self._load_yaml_mapping(index_path)
        fragments = index.get("fragments", [])
        if isinstance(fragments, list):
            for raw_fragment in fragments:
                fragment_path = self._frontend_contract_fragment_path(index_path, raw_fragment)
                if fragment_path is not None:
                    sources.append(fragment_path)
        return sources

    def _load_yaml_mapping(self, path: Path) -> dict[str, Any]:
        if yaml is None or not path.is_file():
            return {}
        payload = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        return payload if isinstance(payload, dict) else {}

    def _frontend_contract_fragment_path(self, index_path: Path, raw_fragment: Any) -> Path | None:
        if isinstance(raw_fragment, str):
            raw_path = raw_fragment
        elif isinstance(raw_fragment, dict) and isinstance(raw_fragment.get("path"), str):
            raw_path = raw_fragment["path"]
        else:
            return None
        candidate = Path(raw_path)
        if candidate.is_absolute() or ".." in candidate.parts:
            return None
        return (index_path.parent / candidate).resolve()

    def _check_legacy_identity_standard(
        self,
        data: dict[str, Any],
        by_table: dict[str, dict[str, Any]],
    ) -> list[str]:
        messages: list[str] = []
        for table in sorted(FORBIDDEN_LEGACY_IDENTITY_TABLES):
            if table in by_table:
                messages.append(f"legacy identity table must be removed: {table}")

        for table, metadata in by_table.items():
            foreign_keys = metadata.get("foreign_keys", [])
            if isinstance(foreign_keys, list):
                for foreign_key in foreign_keys:
                    if not isinstance(foreign_key, dict):
                        continue
                    reference = foreign_key.get("references_table")
                    if reference in FORBIDDEN_LEGACY_IDENTITY_TABLES:
                        name = foreign_key.get("name", "<unnamed>")
                        replacement = "iam_user" if reference == "plus_user" else self._iam_identity_table_for(str(reference))
                        messages.append(
                            f"{table} foreign key {name} must reference {replacement} instead of {reference}"
                        )

            messages.extend(self._check_legacy_identity_source_list(table, metadata, "source_tables"))
            policy = metadata.get("projection_policy")
            if isinstance(policy, dict):
                messages.extend(
                    self._check_legacy_identity_source_list(
                        table,
                        policy,
                        "does_not_replace",
                        label="projection_policy.does_not_replace",
                    )
                )

        return messages

    def _check_legacy_identity_source_list(
        self,
        table: str,
        metadata: dict[str, Any],
        key: str,
        *,
        label: str | None = None,
    ) -> list[str]:
        values = metadata.get(key)
        if not isinstance(values, list):
            return []

        messages: list[str] = []
        for value in values:
            if not isinstance(value, str) or value not in FORBIDDEN_LEGACY_IDENTITY_TABLES:
                continue
            replacement = "iam_user" if value == "plus_user" else self._iam_identity_table_for(value)
            messages.append(f"{table} {label or key} must use {replacement} instead of {value}")
        return messages

    def _iam_identity_table_for(self, legacy_table: str) -> str:
        return {
            "plus_api_key": "iam_gateway_api_key",
            "plus_oauth_account": "iam_user_identity",
            "plus_organization": "iam_organization",
            "plus_organization_member": "iam_organization_member",
            "plus_permission": "iam_permission",
            "plus_role": "iam_role",
            "plus_role_permission": "iam_role_permission",
            "plus_tenant": "iam_tenant",
            "plus_user": "iam_user",
            "plus_user_role": "iam_user_role",
        }.get(legacy_table, f"iam_{legacy_table.removeprefix('plus_')}")

    def _check_skills_hub_tables(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table in sorted(OBSOLETE_SKILLS_HUB_TABLES):
            metadata = by_table.get(table)
            if metadata is None:
                continue

            messages.append(f"obsolete SkillsHub table remains: {table}")
            routes = metadata.get("frontend_routes", [])
            if isinstance(routes, list):
                for route in routes:
                    if isinstance(route, str) and route in SKILLS_HUB_ROUTES:
                        messages.append(f"{route} still uses obsolete SkillsHub table: {table}")

        return messages

    def _check_domain_names(self, data: dict[str, Any], by_table: dict[str, dict[str, Any]]) -> list[str]:
        domain_names = data.get("domain_names")
        if not isinstance(domain_names, dict):
            return []

        messages: list[str] = []
        for name, definition in domain_names.items():
            if not isinstance(name, str) or not isinstance(definition, dict):
                continue

            persistence = definition.get("persistence", {})
            if isinstance(persistence, dict):
                table = persistence.get("table")
                if isinstance(table, str) and table not in by_table:
                    messages.append(f"{name} persistence table must be registered: {table}")
                if name == "pricing_plan" and table != "ai_pricing_plan":
                    messages.append("pricing_plan persistence table must be ai_pricing_plan")

            if name in DOMAIN_NAMES_REQUIRING_TYPE_BINDINGS:
                type_bindings = definition.get("type_bindings", {})
                if not isinstance(type_bindings, dict):
                    type_bindings = {}
                for target in sorted(TYPE_BINDING_TARGETS):
                    if not type_bindings.get(target):
                        messages.append(f"{name} type_bindings.{target} is required")

            required_codes = DOMAIN_NAME_REQUIRED_CODES.get(name, set())
            if required_codes:
                builtin_codes = self._builtin_codes(definition)
                for code in sorted(required_codes):
                    if code not in builtin_codes:
                        messages.append(f"{name} builtin_values must include {code}")

        return messages

    def _check_pricing_and_billing_contracts(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table in sorted(FORBIDDEN_PRICING_TABLES):
            if table in by_table:
                messages.append(f"forbidden pricing table present: {table}")

        for table, required_columns in REQUIRED_TABLE_COLUMNS.items():
            metadata = by_table.get(table)
            if metadata is None:
                continue
            columns = metadata.get("columns", {})
            if not isinstance(columns, dict):
                columns = {}
            for column in sorted(required_columns):
                if column not in columns:
                    messages.append(f"{table} must include column {column}")

        return messages

    def _check_messaging_delivery_standard(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        has_messaging_table = False

        for table, metadata in by_table.items():
            domain = metadata.get("domain")
            if table.startswith("messaging_") or domain == "messaging":
                has_messaging_table = True
                if not table.startswith("messaging_") or domain != "messaging":
                    messages.append(
                        f"external messaging table must use messaging_* prefix and messaging domain: {table}"
                    )
                continue

            if table.startswith("ops_notification_"):
                continue
            if table.startswith("notification_") or domain == "notification":
                if any(token in table for token in MESSAGING_TABLE_NAME_TOKENS):
                    messages.append(
                        f"external messaging table must use messaging_* prefix and messaging domain: {table}"
                    )

        if has_messaging_table:
            for table in MESSAGING_STANDARD_TABLES:
                if table not in by_table:
                    messages.append(f"messaging standard table is required: {table}")

        return messages

    def _check_projection_source_contracts(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, metadata in by_table.items():
            if not self._is_projection_table(metadata):
                continue

            source_tables = metadata.get("source_tables", [])
            source_refs = metadata.get("source_refs", [])
            if not isinstance(source_tables, list):
                messages.append(f"{table} source_tables must be a list")
                source_tables = []
            if not isinstance(source_refs, list):
                messages.append(f"{table} source_refs must be a list")
                source_refs = []

            source_table_names = [source for source in source_tables if isinstance(source, str)]
            source_ref_names = [source for source in source_refs if isinstance(source, str)]
            if not source_table_names and not source_ref_names:
                messages.append(f"{table} projection table must declare source_tables or source_refs")

            for source in source_table_names:
                if source not in by_table:
                    messages.append(f"{table} source_tables references unregistered table {source}")
                    continue
                if by_table[source].get("domain") == "legacy" and not self._declares_non_replacement(metadata, source):
                    messages.append(
                        f"{table} projection over legacy table {source} must declare projection_policy.does_not_replace"
                    )

        return messages

    def _is_projection_table(self, metadata: dict[str, Any]) -> bool:
        return metadata.get("profile") == "projection" or metadata.get("common_columns") == "projection"

    def _declares_non_replacement(self, metadata: dict[str, Any], source: str) -> bool:
        policy = metadata.get("projection_policy")
        if isinstance(policy, dict):
            value = policy.get("does_not_replace")
            if isinstance(value, list):
                return source in value or "*" in value
            return value == source or value == "*" or value is True
        if isinstance(policy, str):
            return "does_not_replace" in policy
        return False

    def _builtin_codes(self, definition: dict[str, Any]) -> set[str]:
        values = definition.get("builtin_values", [])
        if not isinstance(values, list):
            return set()

        codes: set[str] = set()
        for value in values:
            if isinstance(value, dict) and isinstance(value.get("code"), str):
                codes.add(value["code"])
        return codes

    def _check_api_prefixes(self, data: dict[str, Any]) -> list[str]:
        prefixes = data.get("schema_registry", {}).get("api_prefixes")
        if not isinstance(prefixes, dict):
            return []

        return []

    def _check_table_naming_guardrails(
        self,
        data: dict[str, Any],
        by_table: dict[str, dict[str, Any]],
    ) -> list[str]:
        naming = data.get("schema_registry", {}).get("naming_guardrails", {})
        forbidden_prefixes = naming.get("forbidden_new_prefixes", [])
        if not isinstance(forbidden_prefixes, list):
            return ["naming_guardrails.forbidden_new_prefixes must be a list"]

        forbidden = {prefix for prefix in forbidden_prefixes if isinstance(prefix, str)}
        messages: list[str] = []
        for table, metadata in by_table.items():
            if metadata.get("domain") == "legacy":
                continue
            prefix = table.split("_", 1)[0]
            if prefix in forbidden:
                messages.append(f"forbidden new table prefix present: {table}")
        return messages

    def _check_frontend_route_api_surfaces(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, metadata in by_table.items():
            routes = metadata.get("frontend_routes", [])
            if not isinstance(routes, list) or not routes:
                continue

            api_surfaces = metadata.get("api_surfaces", [])
            if not isinstance(api_surfaces, list):
                api_surfaces = []
            surfaces = {surface for surface in api_surfaces if isinstance(surface, str)}

            for route in routes:
                if not isinstance(route, str):
                    continue
                if route.startswith("/admin"):
                    if "backend" not in surfaces:
                        messages.append(f"{route} on {table} requires backend api_surface")
                elif "app" not in surfaces:
                    messages.append(f"{route} on {table} requires app api_surface")

        return messages


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate sdkwork-claw-router schema registry guardrails.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--registry", type=Path, default=None, help="schema registry YAML path")
    parser.add_argument("--test-schema", type=Path, default=None, help="Rust integration test schema source path")
    args = parser.parse_args()

    result = SchemaGuardian(root=args.root, registry_path=args.registry, test_schema_path=args.test_schema).run()
    if result.ok:
        print("Schema guardian passed")
        return 0

    for message in result.messages:
        print(message)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
