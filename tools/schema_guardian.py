from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

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

EXPECTED_API_PREFIXES = {
    "app": "/app/v3/api",
    "backend": "/backend/v3/api",
    "openai_compatible": "/v1",
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

DEFAULT_RUST_TEST_SCHEMA_PATH = (
    Path("services") / "sdkwork-claw-admin-api" / "tests" / "database_config_router.rs"
)


def _legacy_index(
    table: str,
    name: str,
    columns: list[str],
    *,
    unique: bool = False,
    method: str | None = None,
    portable: bool = True,
) -> dict[str, Any]:
    kind = "unique index" if unique else "index"
    column_text = ", ".join(columns)
    method_text = f" using {method.lower()}" if method is not None else ""
    return {
        "name": name,
        "unique": unique,
        "columns": columns,
        "method": method.lower() if method is not None else None,
        "portable": portable,
        "message": f"{table} must declare {kind} {name}{method_text} on {column_text}",
    }


def _legacy_unique_constraint(table: str, columns: list[str]) -> dict[str, Any]:
    column_text = ", ".join(columns)
    return {
        "columns": columns,
        "message": f"{table} must declare unique constraint on {column_text}",
    }


def _legacy_uuid_constraint(table: str) -> dict[str, Any]:
    return _legacy_unique_constraint(table, ["uuid"])


def _legacy_foreign_key(
    table: str,
    name: str,
    columns: list[str],
    references_table: str,
    references_columns: list[str],
) -> dict[str, Any]:
    column_text = ", ".join(columns)
    reference_column_text = ", ".join(references_columns)
    return {
        "name": name,
        "columns": columns,
        "references_table": references_table,
        "references_columns": references_columns,
        "message": (
            f"{table} must declare foreign key {name} "
            f"on {column_text} references {references_table}({reference_column_text})"
        ),
    }


REQUIRED_LEGACY_INDEXES: dict[str, list[dict[str, Any]]] = {
    "plus_account": [
        _legacy_index(
            "plus_account",
            "uk_plus_account_user_type",
            ["tenant_id", "organization_id", "user_id", "account_type"],
            unique=True,
        ),
        _legacy_index("plus_account", "idx_plus_account_user_id", ["user_id"]),
        _legacy_index("plus_account", "idx_plus_account_owner_id", ["owner", "owner_id"]),
    ],
    "plus_account_history": [
        _legacy_index("plus_account_history", "idx_account_history_account_id", ["account_id"]),
        _legacy_index("plus_account_history", "idx_account_history_transaction_id", ["transaction_id"]),
        _legacy_index("plus_account_history", "idx_account_history_source_id", ["source_id"]),
    ],
    "plus_vip_level": [
        _legacy_index("plus_vip_level", "uk_plus_vip_level_name", ["name"], unique=True),
        _legacy_index("plus_vip_level", "uk_plus_vip_level_value", ["level_value"], unique=True),
        _legacy_index("plus_vip_level", "idx_plus_vip_level_status", ["status"]),
    ],
    "plus_vip_benefit": [
        _legacy_index("plus_vip_benefit", "uk_plus_vip_benefit_name", ["name"], unique=True),
        _legacy_index("plus_vip_benefit", "uk_plus_vip_benefit_key", ["benefit_key"], unique=True),
        _legacy_index("plus_vip_benefit", "idx_plus_vip_benefit_type", ["type"]),
        _legacy_index("plus_vip_benefit", "idx_plus_vip_benefit_status", ["status"]),
    ],
    "plus_vip_level_benefit": [
        _legacy_index(
            "plus_vip_level_benefit",
            "uk_plus_vip_level_benefit_pair",
            ["vip_level_id", "benefit_id"],
            unique=True,
        ),
        _legacy_index("plus_vip_level_benefit", "idx_plus_vip_level_benefit_level", ["vip_level_id"]),
        _legacy_index("plus_vip_level_benefit", "idx_plus_vip_level_benefit_benefit", ["benefit_id"]),
        _legacy_index("plus_vip_level_benefit", "idx_plus_vip_level_benefit_status", ["status"]),
    ],
    "plus_vip_pack_group": [
        _legacy_index(
            "plus_vip_pack_group",
            "uk_plus_vip_pack_group_scope_key",
            ["scope_type", "scope_id", "group_key"],
            unique=True,
        ),
        _legacy_index("plus_vip_pack_group", "idx_plus_vip_pack_group_status", ["status"]),
        _legacy_index("plus_vip_pack_group", "idx_plus_vip_pack_group_app", ["app_id"]),
        _legacy_index("plus_vip_pack_group", "idx_plus_vip_pack_group_scope", ["scope_type", "scope_id"]),
        _legacy_index("plus_vip_pack_group", "idx_plus_vip_pack_group_sort", ["sort_weight"]),
    ],
    "plus_vip_recharge_pack": [
        _legacy_index("plus_vip_recharge_pack", "idx_plus_vip_recharge_pack_status", ["status"]),
        _legacy_index("plus_vip_recharge_pack", "idx_plus_vip_recharge_pack_app", ["app_id"]),
        _legacy_index("plus_vip_recharge_pack", "idx_plus_vip_recharge_pack_sort", ["sort_weight"]),
    ],
    "plus_vip_pack": [
        _legacy_index(
            "plus_vip_pack",
            "uk_plus_vip_pack_group_level_cycle",
            ["group_id", "vip_level_id", "billing_cycle"],
            unique=True,
        ),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_status", ["status"]),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_app", ["app_id"]),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_group", ["group_id"]),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_level", ["vip_level_id"]),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_sort", ["sort_weight"]),
        _legacy_index("plus_vip_pack", "idx_plus_vip_pack_recharge_pack", ["recharge_pack_id"]),
    ],
    "plus_vip_recharge": [
        _legacy_index("plus_vip_recharge", "idx_plus_vip_recharge_user", ["user_id"]),
        _legacy_index("plus_vip_recharge", "idx_plus_vip_recharge_level", ["vip_level_id"]),
        _legacy_index("plus_vip_recharge", "idx_plus_vip_recharge_status", ["status"]),
        _legacy_index("plus_vip_recharge", "idx_plus_vip_recharge_time", ["recharge_time"]),
        _legacy_index("plus_vip_recharge", "idx_plus_vip_recharge_transaction", ["transaction_no"]),
    ],
    "plus_vip_recharge_method": [
        _legacy_index(
            "plus_vip_recharge_method",
            "uk_plus_vip_recharge_method_key",
            ["method_key"],
            unique=True,
        ),
        _legacy_index("plus_vip_recharge_method", "idx_plus_vip_recharge_method_status", ["status"]),
        _legacy_index("plus_vip_recharge_method", "idx_plus_vip_recharge_method_sort", ["sort_weight"]),
    ],
    "plus_vip_user": [
        _legacy_index("plus_vip_user", "uk_plus_vip_user_user_id", ["user_id"], unique=True),
        _legacy_index("plus_vip_user", "idx_plus_vip_user_level", ["vip_level_id"]),
        _legacy_index("plus_vip_user", "idx_plus_vip_user_status", ["status"]),
    ],
    "plus_vip_point_change": [
        _legacy_index("plus_vip_point_change", "idx_plus_vip_point_change_user", ["user_id"]),
        _legacy_index("plus_vip_point_change", "idx_plus_vip_point_change_type", ["change_type"]),
        _legacy_index("plus_vip_point_change", "idx_plus_vip_point_change_source", ["source_type"]),
    ],
    "plus_vip_benefit_usage": [
        _legacy_index("plus_vip_benefit_usage", "idx_plus_vip_benefit_usage_user", ["user_id"]),
        _legacy_index("plus_vip_benefit_usage", "idx_plus_vip_benefit_usage_type", ["benefit_type"]),
        _legacy_index("plus_vip_benefit_usage", "idx_plus_vip_benefit_usage_time", ["usage_time"]),
        _legacy_index("plus_vip_benefit_usage", "idx_plus_vip_benefit_usage_status", ["status"]),
    ],
    "plus_coupon_template": [
        _legacy_index(
            "plus_coupon_template",
            "uk_plus_coupon_template_code",
            ["template_code"],
            unique=True,
        ),
        _legacy_index("plus_coupon_template", "idx_plus_coupon_template_status", ["status"]),
        _legacy_index("plus_coupon_template", "idx_plus_coupon_template_type", ["type"]),
        _legacy_index("plus_coupon_template", "idx_plus_coupon_template_time_window", ["start_time", "end_time"]),
        _legacy_index(
            "plus_coupon_template",
            "idx_plus_coupon_template_tenant_org_status",
            ["tenant_id", "organization_id", "status"],
        ),
    ],
    "plus_coupon": [
        _legacy_index("plus_coupon", "uk_plus_coupon_redeem_code", ["redeem_code"], unique=True),
        _legacy_index("plus_coupon", "idx_plus_coupon_status", ["status"]),
        _legacy_index("plus_coupon", "idx_plus_coupon_type", ["type"]),
        _legacy_index(
            "plus_coupon",
            "idx_plus_coupon_tenant_org_status",
            ["tenant_id", "organization_id", "status"],
        ),
    ],
    "plus_user_coupon": [
        _legacy_index("plus_user_coupon", "uk_plus_user_coupon_code", ["coupon_code"], unique=True),
        _legacy_index(
            "plus_user_coupon",
            "uk_plus_user_coupon_acquire_request_no",
            ["user_id", "acquire_request_no"],
            unique=True,
        ),
        _legacy_index("plus_user_coupon", "idx_plus_user_coupon_coupon_id", ["coupon_id"]),
        _legacy_index("plus_user_coupon", "idx_plus_user_coupon_user_status", ["user_id", "status"]),
        _legacy_index("plus_user_coupon", "idx_plus_user_coupon_expire_at", ["expire_at"]),
    ],
    "plus_shop": [
        _legacy_index("plus_shop", "idx_plus_shop_user_id", ["user_id"]),
        _legacy_index("plus_shop", "idx_plus_shop_status", ["status"]),
        _legacy_index("plus_shop", "idx_plus_shop_tenant_org_status", ["tenant_id", "organization_id", "status"]),
        _legacy_index("plus_shop", "gist_plus_shop_location", ["location"], method="gist", portable=False),
        _legacy_index("plus_shop", "gin_plus_shop_tags", ["tags"], method="gin", portable=False),
    ],
    "plus_product": [
        _legacy_index("plus_product", "uk_plus_product_code", ["code"], unique=True),
        _legacy_index("plus_product", "idx_plus_product_user_id", ["user_id"]),
        _legacy_index("plus_product", "idx_plus_product_category_id", ["category_id"]),
        _legacy_index("plus_product", "idx_plus_product_status", ["status"]),
        _legacy_index(
            "plus_product",
            "idx_plus_product_tenant_org_status",
            ["tenant_id", "organization_id", "status"],
        ),
        _legacy_index("plus_product", "idx_plus_product_category_status", ["category_id", "status", "created_at"]),
        _legacy_index("plus_product", "gin_plus_product_tags", ["tags"], method="gin", portable=False),
        _legacy_index("plus_product", "gin_plus_product_resources", ["resources"], method="gin", portable=False),
    ],
    "plus_sku": [
        _legacy_index("plus_sku", "uk_plus_sku_sku_code", ["sku_code"], unique=True),
        _legacy_index("plus_sku", "idx_plus_sku_product", ["product_id"]),
        _legacy_index("plus_sku", "idx_plus_sku_product_status", ["product_id", "status"]),
    ],
    "plus_shopping_cart": [
        _legacy_index("plus_shopping_cart", "idx_plus_shopping_cart_user_id", ["user_id"]),
        _legacy_index("plus_shopping_cart", "idx_plus_shopping_cart_owner", ["owner", "owner_id"]),
        _legacy_index("plus_shopping_cart", "idx_plus_shopping_cart_status", ["status"]),
    ],
    "plus_shopping_cart_item": [
        _legacy_index(
            "plus_shopping_cart_item",
            "uk_plus_shopping_cart_item_cart_sku",
            ["cart_id", "sku_id"],
            unique=True,
        ),
        _legacy_index("plus_shopping_cart_item", "idx_plus_shopping_cart_item_cart_id", ["cart_id"]),
        _legacy_index("plus_shopping_cart_item", "idx_plus_shopping_cart_item_product_id", ["product_id"]),
        _legacy_index("plus_shopping_cart_item", "idx_plus_shopping_cart_item_sku_id", ["sku_id"]),
    ],
    "plus_order_dispatch_rule": [
        _legacy_index(
            "plus_order_dispatch_rule",
            "uk_order_dispatch_rule_task_code",
            ["task_code"],
            unique=True,
        ),
        _legacy_index("plus_order_dispatch_rule", "idx_order_dispatch_rule_enabled", ["enabled"]),
    ],
    "plus_order_worker_dispatch_profile": [
        _legacy_index(
            "plus_order_worker_dispatch_profile",
            "uk_order_worker_dispatch_profile_user_id",
            ["user_id"],
            unique=True,
        ),
        _legacy_index("plus_order_worker_dispatch_profile", "idx_order_worker_dispatch_profile_enabled", ["enabled"]),
        _legacy_index(
            "plus_order_worker_dispatch_profile",
            "idx_order_worker_dispatch_profile_rating_level",
            ["rating_level"],
        ),
    ],
    "plus_order": [
        _legacy_index("plus_order", "uk_plus_order_order_sn", ["order_sn"], unique=True),
        _legacy_index("plus_order", "uk_plus_order_out_trade_no", ["out_trade_no"], unique=True),
        _legacy_index("plus_order", "idx_plus_order_user_id", ["user_id"]),
        _legacy_index("plus_order", "idx_plus_order_status", ["status"]),
        _legacy_index("plus_order", "idx_plus_order_status_payment_expire", ["status", "payment_expire_time"]),
        _legacy_index("plus_order", "idx_plus_order_task_code", ["task_code"]),
        _legacy_index("plus_order", "idx_plus_order_worker_user_id", ["worker_user_id"]),
        _legacy_index(
            "plus_order",
            "idx_plus_order_tenant_org_status",
            ["tenant_id", "organization_id", "status"],
        ),
    ],
    "plus_order_item": [
        _legacy_index("plus_order_item", "idx_plus_order_item_order_id", ["order_id"]),
        _legacy_index("plus_order_item", "idx_plus_order_item_product_id", ["product_id"]),
        _legacy_index("plus_order_item", "idx_plus_order_item_sku_id", ["sku_id"]),
    ],
    "plus_payment": [
        _legacy_index("plus_payment", "uk_plus_payment_out_trade_no", ["out_trade_no"], unique=True),
        _legacy_index("plus_payment", "idx_plus_payment_status_expire", ["status", "expire_time"]),
        _legacy_index("plus_payment", "idx_plus_payment_order_status", ["order_id", "status"]),
        _legacy_index("plus_payment", "idx_plus_payment_provider_status", ["provider", "status"]),
    ],
    "plus_refund": [
        _legacy_index("plus_refund", "uk_plus_refund_out_refund_no", ["out_refund_no"], unique=True),
        _legacy_index("plus_refund", "idx_plus_refund_order_id", ["order_id"]),
        _legacy_index("plus_refund", "idx_plus_refund_payment_id", ["payment_id"]),
        _legacy_index("plus_refund", "idx_plus_refund_status", ["status"]),
    ],
    "plus_invoice": [
        _legacy_index("plus_invoice", "idx_invoice_user", ["user_id"]),
        _legacy_index("plus_invoice", "idx_invoice_status", ["status"]),
        _legacy_index("plus_invoice", "idx_invoice_type", ["type"]),
        _legacy_index("plus_invoice", "idx_invoice_code", ["invoice_code"]),
        _legacy_index("plus_invoice", "idx_invoice_created", ["created_at"]),
    ],
    "plus_invoice_item": [
        _legacy_index("plus_invoice_item", "idx_invoice_item_invoice", ["invoice_id"]),
        _legacy_index("plus_invoice_item", "idx_invoice_item_order_item", ["order_item_id"]),
        _legacy_index("plus_invoice_item", "idx_invoice_item_created", ["created_at"]),
    ],
    "plus_invoice_record": [
        _legacy_index("plus_invoice_record", "idx_invoice_record_invoice", ["invoice_id"]),
        _legacy_index("plus_invoice_record", "idx_invoice_record_operation", ["operation_type"]),
        _legacy_index("plus_invoice_record", "idx_invoice_record_created", ["created_at"]),
    ],
}

REQUIRED_LEGACY_UNIQUE_CONSTRAINTS: dict[str, list[dict[str, Any]]] = {
    "plus_user": [_legacy_uuid_constraint("plus_user")],
    "plus_role": [_legacy_uuid_constraint("plus_role")],
    "plus_account": [_legacy_uuid_constraint("plus_account")],
    "plus_account_history": [_legacy_uuid_constraint("plus_account_history")],
    "plus_vip_recharge": [_legacy_uuid_constraint("plus_vip_recharge")],
    "plus_vip_recharge_method": [_legacy_uuid_constraint("plus_vip_recharge_method")],
    "plus_vip_point_change": [_legacy_uuid_constraint("plus_vip_point_change")],
    "plus_coupon_template": [_legacy_uuid_constraint("plus_coupon_template")],
    "plus_coupon": [_legacy_uuid_constraint("plus_coupon")],
    "plus_user_coupon": [_legacy_uuid_constraint("plus_user_coupon")],
    "plus_shop": [_legacy_uuid_constraint("plus_shop")],
    "plus_order": [_legacy_uuid_constraint("plus_order")],
    "plus_payment": [_legacy_uuid_constraint("plus_payment")],
    "plus_refund": [_legacy_uuid_constraint("plus_refund")],
    "plus_invoice": [_legacy_uuid_constraint("plus_invoice")],
}

REQUIRED_LEGACY_NOT_NULL_COLUMNS: dict[str, list[str]] = {
    "plus_order": [
        "subject",
        "order_type",
        "owner_id",
        "user_id",
        "order_sn",
        "out_trade_no",
        "total_amount",
        "paid_amount",
        "status",
        "category_id",
    ],
    "plus_payment": ["purpose", "order_id", "out_trade_no", "channel", "provider", "status", "amount"],
    "plus_refund": ["order_id", "payment_id", "out_refund_no", "amount", "type", "status", "apply_time"],
}

REQUIRED_LEGACY_FOREIGN_KEYS: dict[str, list[dict[str, Any]]] = {
    "plus_order": [
        _legacy_foreign_key("plus_order", "fk_plus_order_user", ["user_id"], "plus_user", ["id"]),
        _legacy_foreign_key("plus_order", "fk_plus_order_worker_user", ["worker_user_id"], "plus_user", ["id"]),
        _legacy_foreign_key("plus_order", "fk_plus_order_dispatcher_user", ["dispatcher_user_id"], "plus_user", ["id"]),
    ],
    "plus_order_worker_dispatch_profile": [
        _legacy_foreign_key(
            "plus_order_worker_dispatch_profile",
            "fk_order_worker_dispatch_profile_user",
            ["user_id"],
            "plus_user",
            ["id"],
        ),
    ],
    "plus_shop": [
        _legacy_foreign_key("plus_shop", "fk_plus_shop_user", ["user_id"], "plus_user", ["id"]),
    ],
    "plus_product": [
        _legacy_foreign_key("plus_product", "fk_plus_product_user", ["user_id"], "plus_user", ["id"]),
    ],
    "plus_sku": [
        _legacy_foreign_key("plus_sku", "fk_plus_sku_product", ["product_id"], "plus_product", ["id"]),
    ],
    "plus_order_item": [
        _legacy_foreign_key("plus_order_item", "fk_plus_order_item_order", ["order_id"], "plus_order", ["id"]),
        _legacy_foreign_key("plus_order_item", "fk_plus_order_item_product", ["product_id"], "plus_product", ["id"]),
        _legacy_foreign_key("plus_order_item", "fk_plus_order_item_sku", ["sku_id"], "plus_sku", ["id"]),
    ],
    "plus_payment": [
        _legacy_foreign_key("plus_payment", "fk_plus_payment_order", ["order_id"], "plus_order", ["id"]),
    ],
    "plus_refund": [
        _legacy_foreign_key("plus_refund", "fk_plus_refund_order", ["order_id"], "plus_order", ["id"]),
        _legacy_foreign_key("plus_refund", "fk_plus_refund_payment", ["payment_id"], "plus_payment", ["id"]),
    ],
    "plus_invoice": [
        _legacy_foreign_key("plus_invoice", "fk_plus_invoice_user", ["user_id"], "plus_user", ["id"]),
    ],
    "plus_invoice_item": [
        _legacy_foreign_key("plus_invoice_item", "fk_plus_invoice_item_invoice", ["invoice_id"], "plus_invoice", ["id"]),
        _legacy_foreign_key(
            "plus_invoice_item",
            "fk_plus_invoice_item_order_item",
            ["order_item_id"],
            "plus_order_item",
            ["id"],
        ),
    ],
    "plus_invoice_record": [
        _legacy_foreign_key("plus_invoice_record", "fk_plus_invoice_record_invoice", ["invoice_id"], "plus_invoice", ["id"]),
    ],
    "plus_shopping_cart": [
        _legacy_foreign_key("plus_shopping_cart", "fk_plus_shopping_cart_user", ["user_id"], "plus_user", ["id"]),
    ],
    "plus_shopping_cart_item": [
        _legacy_foreign_key(
            "plus_shopping_cart_item",
            "fk_plus_shopping_cart_item_cart",
            ["cart_id"],
            "plus_shopping_cart",
            ["id"],
        ),
        _legacy_foreign_key(
            "plus_shopping_cart_item",
            "fk_plus_shopping_cart_item_product",
            ["product_id"],
            "plus_product",
            ["id"],
        ),
        _legacy_foreign_key("plus_shopping_cart_item", "fk_plus_shopping_cart_item_sku", ["sku_id"], "plus_sku", ["id"]),
    ],
    "plus_user_coupon": [
        _legacy_foreign_key("plus_user_coupon", "fk_plus_user_coupon_coupon", ["coupon_id"], "plus_coupon", ["id"]),
        _legacy_foreign_key("plus_user_coupon", "fk_plus_user_coupon_user", ["user_id"], "plus_user", ["id"]),
        _legacy_foreign_key("plus_user_coupon", "fk_plus_user_coupon_order", ["order_id"], "plus_order", ["id"]),
    ],
    "plus_vip_level_benefit": [
        _legacy_foreign_key(
            "plus_vip_level_benefit",
            "fk_plus_vip_level_benefit_level",
            ["vip_level_id"],
            "plus_vip_level",
            ["id"],
        ),
        _legacy_foreign_key(
            "plus_vip_level_benefit",
            "fk_plus_vip_level_benefit_benefit",
            ["benefit_id"],
            "plus_vip_benefit",
            ["id"],
        ),
    ],
    "plus_vip_pack": [
        _legacy_foreign_key("plus_vip_pack", "fk_plus_vip_pack_group_id", ["group_id"], "plus_vip_pack_group", ["id"]),
        _legacy_foreign_key("plus_vip_pack", "fk_plus_vip_pack_level_id", ["vip_level_id"], "plus_vip_level", ["id"]),
        _legacy_foreign_key(
            "plus_vip_pack",
            "fk_plus_vip_pack_recharge_pack",
            ["recharge_pack_id"],
            "plus_vip_recharge_pack",
            ["id"],
        ),
    ],
    "plus_vip_user": [
        _legacy_foreign_key("plus_vip_user", "fk_plus_vip_user_user", ["user_id"], "plus_user", ["id"]),
        _legacy_foreign_key("plus_vip_user", "fk_plus_vip_user_level", ["vip_level_id"], "plus_vip_level", ["id"]),
    ],
    "plus_vip_point_change": [
        _legacy_foreign_key(
            "plus_vip_point_change",
            "fk_plus_vip_point_change_user",
            ["user_id"],
            "plus_user",
            ["id"],
        ),
    ],
    "plus_vip_recharge": [
        _legacy_foreign_key("plus_vip_recharge", "fk_plus_vip_recharge_user", ["user_id"], "plus_user", ["id"]),
        _legacy_foreign_key("plus_vip_recharge", "fk_plus_vip_recharge_level", ["vip_level_id"], "plus_vip_level", ["id"]),
        _legacy_foreign_key(
            "plus_vip_recharge",
            "fk_plus_vip_recharge_method",
            ["recharge_method_id"],
            "plus_vip_recharge_method",
            ["id"],
        ),
        _legacy_foreign_key(
            "plus_vip_recharge",
            "fk_plus_vip_recharge_pack",
            ["recharge_pack_id"],
            "plus_vip_recharge_pack",
            ["id"],
        ),
    ],
    "plus_vip_benefit_usage": [
        _legacy_foreign_key("plus_vip_benefit_usage", "fk_plus_vip_benefit_usage_user", ["user_id"], "plus_user", ["id"]),
    ],
}


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
        self.test_schema_path = (
            Path(test_schema_path).resolve()
            if test_schema_path is not None
            else self.root / DEFAULT_RUST_TEST_SCHEMA_PATH
        )

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
        messages.extend(self._check_finance_trade_contracts(data, by_table))
        messages.extend(self._check_skills_hub_tables(by_table))
        messages.extend(self._check_domain_names(data, by_table))
        messages.extend(self._check_pricing_and_billing_contracts(by_table))
        messages.extend(self._check_required_legacy_indexes(by_table))
        messages.extend(self._check_required_legacy_index_ownership(by_table))
        messages.extend(self._check_required_legacy_unique_constraints(by_table))
        messages.extend(self._check_required_legacy_not_null_columns(by_table))
        messages.extend(self._check_required_legacy_foreign_keys(by_table))
        messages.extend(self._check_required_legacy_foreign_key_ownership(by_table))
        messages.extend(self._check_legacy_test_schema_indexes())
        messages.extend(self._check_legacy_test_schema_unique_constraints())
        messages.extend(self._check_legacy_test_schema_not_null_columns())
        messages.extend(self._check_legacy_test_schema_foreign_keys())
        messages.extend(self._check_legacy_test_schema_foreign_key_enforcement())
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

    def _check_finance_trade_contracts(self, data: dict[str, Any], by_table: dict[str, dict[str, Any]]) -> list[str]:
        contracts = data.get("legacy_java_contracts", {}).get("finance_and_trade", {})
        if not isinstance(contracts, dict):
            return []

        messages: list[str] = []
        for contract in contracts.values():
            if not isinstance(contract, dict):
                continue

            tables = contract.get("tables", [])
            if isinstance(tables, list):
                for table in tables:
                    if isinstance(table, str):
                        messages.extend(self._check_l0_java_contract_table(table, by_table.get(table)))

            entities = contract.get("entities", {})
            if isinstance(entities, dict):
                for table, entity in entities.items():
                    if isinstance(table, str) and isinstance(entity, str):
                        messages.extend(self._check_java_entity_exists(table, entity))

        return messages

    def _check_l0_java_contract_table(self, table: str, metadata: dict[str, Any] | None) -> list[str]:
        if metadata is None:
            return [f"{table} must be registered in tables"]

        messages: list[str] = []
        if metadata.get("domain") != "legacy":
            messages.append(f"{table} domain must be legacy")
        if metadata.get("compliance_level") != "L0":
            messages.append(f"{table} compliance_level must be L0")
        if metadata.get("write_owner") != "spring-ai-plus-business-entity":
            messages.append(f"{table} write_owner must be spring-ai-plus-business-entity")
        if metadata.get("generated_by_this_project") is not False:
            messages.append(f"{table} generated_by_this_project must be false")
        if metadata.get("compatibility_rule") != "keep_physical_structure_identical":
            messages.append(f"{table} compatibility_rule must be keep_physical_structure_identical")
        return messages

    def _check_java_entity_exists(self, table: str, entity: str) -> list[str]:
        relative_path = Path(*entity.split(".")).with_suffix(".java")
        relative_text = relative_path.as_posix()

        for source_root in self._java_source_roots():
            if (source_root / relative_path).exists():
                return []

        return [f"missing Java entity for {table}: {relative_text}"]

    def _java_source_roots(self) -> list[Path]:
        module_source = Path("spring-ai-plus-business-entity") / "src" / "main" / "java"
        candidates = [
            self.root / module_source,
            self.root.parent / module_source,
            self.root.parent.parent / module_source,
        ]

        unique: list[Path] = []
        seen: set[Path] = set()
        for candidate in candidates:
            resolved = candidate.resolve()
            if resolved not in seen:
                unique.append(resolved)
                seen.add(resolved)
        return unique

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

    def _check_required_legacy_indexes(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, required_indexes in REQUIRED_LEGACY_INDEXES.items():
            metadata = by_table.get(table)
            if metadata is None:
                continue
            indexes = metadata.get("indexes", [])
            if not isinstance(indexes, list):
                indexes = []
            for required in required_indexes:
                if not self._has_required_index(indexes, required):
                    messages.append(str(required["message"]))
        return messages

    def _check_required_legacy_index_ownership(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        owner_by_index = {
            str(required["name"]): table
            for table, required_indexes in REQUIRED_LEGACY_INDEXES.items()
            for required in required_indexes
        }

        messages: list[str] = []
        for table, metadata in by_table.items():
            indexes = metadata.get("indexes", [])
            if not isinstance(indexes, list):
                continue

            for index in indexes:
                if not isinstance(index, dict):
                    continue
                name = index.get("name")
                if not isinstance(name, str):
                    continue
                expected_table = owner_by_index.get(name)
                if expected_table is not None and expected_table != table:
                    messages.append(f"index {name} belongs to {expected_table}, not {table}")

        return messages

    def _check_required_legacy_unique_constraints(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, required_constraints in REQUIRED_LEGACY_UNIQUE_CONSTRAINTS.items():
            metadata = by_table.get(table)
            if metadata is None:
                continue
            constraints = metadata.get("unique_constraints", [])
            if not isinstance(constraints, list):
                constraints = []
            for required in required_constraints:
                if not self._has_required_unique_constraint(constraints, required):
                    messages.append(str(required["message"]))
        return messages

    def _check_required_legacy_not_null_columns(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, required_columns in REQUIRED_LEGACY_NOT_NULL_COLUMNS.items():
            metadata = by_table.get(table)
            if metadata is None:
                continue
            not_null_columns = metadata.get("not_null_columns", [])
            if not isinstance(not_null_columns, list):
                not_null_columns = []
            declared = {column for column in not_null_columns if isinstance(column, str)}
            for column in required_columns:
                if column not in declared:
                    messages.append(f"{table} must declare not_null_columns including {column}")
        return messages

    def _check_required_legacy_foreign_keys(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        messages: list[str] = []
        for table, required_foreign_keys in REQUIRED_LEGACY_FOREIGN_KEYS.items():
            metadata = by_table.get(table)
            if metadata is None:
                continue
            foreign_keys = metadata.get("foreign_keys", [])
            if not isinstance(foreign_keys, list):
                foreign_keys = []
            for required in required_foreign_keys:
                if not self._has_required_foreign_key(foreign_keys, required):
                    messages.append(str(required["message"]))
        return messages

    def _check_required_legacy_foreign_key_ownership(self, by_table: dict[str, dict[str, Any]]) -> list[str]:
        owner_by_foreign_key = {
            str(required["name"]): table
            for table, required_foreign_keys in REQUIRED_LEGACY_FOREIGN_KEYS.items()
            for required in required_foreign_keys
        }

        messages: list[str] = []
        for table, metadata in by_table.items():
            foreign_keys = metadata.get("foreign_keys", [])
            if not isinstance(foreign_keys, list):
                continue

            for foreign_key in foreign_keys:
                if not isinstance(foreign_key, dict):
                    continue
                name = foreign_key.get("name")
                if not isinstance(name, str):
                    continue
                expected_table = owner_by_foreign_key.get(name)
                if expected_table is not None and expected_table != table:
                    messages.append(f"foreign key {name} belongs to {expected_table}, not {table}")

        return messages

    def _has_required_unique_constraint(self, constraints: list[Any], required: dict[str, Any]) -> bool:
        required_columns = required["columns"]
        for constraint in constraints:
            if not isinstance(constraint, dict):
                continue
            columns = constraint.get("columns")
            if isinstance(columns, list) and columns == required_columns:
                return True
        return False

    def _has_required_index(self, indexes: list[Any], required: dict[str, Any]) -> bool:
        required_name = required["name"]
        required_unique = required["unique"]
        required_columns = required["columns"]
        required_method = required.get("method")
        for index in indexes:
            if not isinstance(index, dict):
                continue
            columns = index.get("columns")
            if (
                index.get("name") == required_name
                and self._index_unique_matches(index, required_unique)
                and self._index_method_matches(index, required_method)
                and isinstance(columns, list)
                and columns == required_columns
            ):
                return True
        return False

    def _has_required_foreign_key(self, foreign_keys: list[Any], required: dict[str, Any]) -> bool:
        for foreign_key in foreign_keys:
            if not isinstance(foreign_key, dict):
                continue
            columns = foreign_key.get("columns")
            references_columns = foreign_key.get("references_columns")
            if (
                foreign_key.get("name") == required["name"]
                and isinstance(columns, list)
                and columns == required["columns"]
                and foreign_key.get("references_table") == required["references_table"]
                and isinstance(references_columns, list)
                and references_columns == required["references_columns"]
            ):
                return True
        return False

    def _index_unique_matches(self, index: dict[str, Any], required_unique: bool) -> bool:
        unique = index.get("unique", False)
        return isinstance(unique, bool) and unique is required_unique

    def _index_method_matches(self, index: dict[str, Any], required_method: Any) -> bool:
        if required_method is None:
            return True
        method = index.get("method")
        return isinstance(method, str) and method.lower() == required_method

    def _check_legacy_test_schema_indexes(self) -> list[str]:
        if not self.test_schema_path.exists():
            return []

        content = self.test_schema_path.read_text(encoding="utf-8")
        messages: list[str] = []
        for table, required_indexes in REQUIRED_LEGACY_INDEXES.items():
            if not self._test_schema_declares_table(content, table):
                continue
            for required in required_indexes:
                if not self._requires_test_schema_index(required):
                    continue
                if not self._test_schema_has_required_index(content, table, required):
                    messages.append(self._test_schema_index_message(table, required))
        return messages

    def _requires_test_schema_index(self, required: dict[str, Any]) -> bool:
        return required.get("portable", True) is True

    def _check_legacy_test_schema_unique_constraints(self) -> list[str]:
        if not self.test_schema_path.exists():
            return []

        content = self.test_schema_path.read_text(encoding="utf-8")
        messages: list[str] = []
        for table, required_constraints in REQUIRED_LEGACY_UNIQUE_CONSTRAINTS.items():
            if not self._test_schema_declares_table(content, table):
                continue
            for required in required_constraints:
                columns = required["columns"]
                if not self._test_schema_has_unique_constraint(content, table, columns):
                    messages.append(self._test_schema_unique_constraint_message(table, columns))
        return messages

    def _check_legacy_test_schema_not_null_columns(self) -> list[str]:
        if not self.test_schema_path.exists():
            return []

        content = self.test_schema_path.read_text(encoding="utf-8")
        messages: list[str] = []
        for table, required_columns in REQUIRED_LEGACY_NOT_NULL_COLUMNS.items():
            if not self._test_schema_declares_table(content, table):
                continue
            body = self._test_schema_table_body(content, table)
            if body is None:
                continue
            for column in required_columns:
                if not self._table_body_has_column_not_null(body, column):
                    messages.append(f"database_config_router.rs test schema must make {table}.{column} NOT NULL")
        return messages

    def _check_legacy_test_schema_foreign_keys(self) -> list[str]:
        if not self.test_schema_path.exists():
            return []

        content = self.test_schema_path.read_text(encoding="utf-8")
        messages: list[str] = []
        for table, required_foreign_keys in REQUIRED_LEGACY_FOREIGN_KEYS.items():
            if not self._test_schema_declares_table(content, table):
                continue
            body = self._test_schema_table_body(content, table)
            if body is None:
                continue
            for required in required_foreign_keys:
                if not self._table_body_has_foreign_key(body, required):
                    messages.append(self._test_schema_foreign_key_message(table, required))
        return messages

    def _check_legacy_test_schema_foreign_key_enforcement(self) -> list[str]:
        if not self.test_schema_path.exists():
            return []

        content = self.test_schema_path.read_text(encoding="utf-8")
        declares_foreign_key_table = any(
            self._test_schema_declares_table(content, table) for table in REQUIRED_LEGACY_FOREIGN_KEYS
        )
        if not declares_foreign_key_table or self._test_schema_enables_foreign_keys(content):
            return []
        return ["database_config_router.rs SQLite test connections must enable foreign key enforcement"]

    def _test_schema_declares_table(self, content: str, table: str) -> bool:
        pattern = rf"CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+{re.escape(table)}\s*\("
        return re.search(pattern, content, flags=re.IGNORECASE | re.DOTALL) is not None

    def _test_schema_has_required_index(self, content: str, table: str, required: dict[str, Any]) -> bool:
        name = str(required["name"])
        pattern = (
            rf"CREATE\s+(?P<unique>UNIQUE\s+)?INDEX\s+"
            rf"(?:IF\s+NOT\s+EXISTS\s+)?{re.escape(name)}\s+"
            rf"ON\s+{re.escape(table)}\s*\((?P<columns>[^)]*)\)"
        )
        for match in re.finditer(pattern, content, flags=re.IGNORECASE | re.DOTALL):
            found_unique = match.group("unique") is not None
            if found_unique is not bool(required["unique"]):
                continue
            columns = self._normalize_sql_columns(match.group("columns"))
            if columns == required["columns"]:
                return True
        return False

    def _test_schema_has_unique_constraint(self, content: str, table: str, columns: list[str]) -> bool:
        required_columns = [self._normalize_sql_identifier(column) for column in columns]
        if self._test_schema_has_unique_index(content, table, required_columns):
            return True

        body = self._test_schema_table_body(content, table)
        if body is None:
            return False

        if len(required_columns) == 1 and self._table_body_has_column_unique(body, required_columns[0]):
            return True

        return self._table_body_has_table_unique(body, required_columns)

    def _test_schema_has_unique_index(self, content: str, table: str, columns: list[str]) -> bool:
        pattern = (
            rf"CREATE\s+UNIQUE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?[a-zA-Z0-9_]+\s+"
            rf"ON\s+{re.escape(table)}\s*\((?P<columns>[^)]*)\)"
        )
        for match in re.finditer(pattern, content, flags=re.IGNORECASE | re.DOTALL):
            found_columns = self._normalize_sql_columns(match.group("columns"))
            if found_columns == columns:
                return True
        return False

    def _test_schema_table_body(self, content: str, table: str) -> str | None:
        pattern = rf"CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+{re.escape(table)}\s*\((?P<body>.*?)\)\s*\"#"
        match = re.search(pattern, content, flags=re.IGNORECASE | re.DOTALL)
        if match is None:
            return None
        return match.group("body")

    def _table_body_has_column_unique(self, body: str, column: str) -> bool:
        for line in body.splitlines():
            stripped = line.strip().rstrip(",")
            if not stripped:
                continue
            first_token = stripped.split(None, 1)[0].strip('"`[]').lower()
            if first_token == column and re.search(r"\bUNIQUE\b", stripped, flags=re.IGNORECASE):
                return True
        return False

    def _table_body_has_column_not_null(self, body: str, column: str) -> bool:
        definition = self._table_body_column_definition(body, column)
        return definition is not None and re.search(r"\bNOT\s+NULL\b", definition, flags=re.IGNORECASE) is not None

    def _table_body_has_table_unique(self, body: str, columns: list[str]) -> bool:
        pattern = r"(?:CONSTRAINT\s+[a-zA-Z0-9_]+\s+)?UNIQUE\s*\((?P<columns>[^)]*)\)"
        for match in re.finditer(pattern, body, flags=re.IGNORECASE | re.DOTALL):
            found_columns = self._normalize_sql_columns(match.group("columns"))
            if found_columns == columns:
                return True
        return False

    def _table_body_has_foreign_key(self, body: str, required: dict[str, Any]) -> bool:
        pattern = (
            rf"CONSTRAINT\s+{re.escape(str(required['name']))}\s+"
            rf"FOREIGN\s+KEY\s*\((?P<columns>[^)]*)\)\s+"
            rf"REFERENCES\s+{re.escape(str(required['references_table']))}\s*"
            rf"\((?P<references_columns>[^)]*)\)"
        )
        for match in re.finditer(pattern, body, flags=re.IGNORECASE | re.DOTALL):
            columns = self._normalize_sql_columns(match.group("columns"))
            references_columns = self._normalize_sql_columns(match.group("references_columns"))
            if columns == required["columns"] and references_columns == required["references_columns"]:
                return True
        return False

    def _test_schema_enables_foreign_keys(self, content: str) -> bool:
        return (
            re.search(r"\.foreign_keys\s*\(\s*true\s*\)", content, flags=re.IGNORECASE) is not None
            or re.search(r"PRAGMA\s+foreign_keys\s*=\s*ON\b", content, flags=re.IGNORECASE) is not None
        )

    def _table_body_column_definition(self, body: str, column: str) -> str | None:
        normalized_column = self._normalize_sql_identifier(column)
        for line in body.splitlines():
            stripped = line.strip().rstrip(",")
            if not stripped:
                continue
            first_token = stripped.split(None, 1)[0].strip('"`[]').lower()
            if first_token == normalized_column:
                return stripped
        return None

    def _normalize_sql_columns(self, columns: str) -> list[str]:
        return [self._normalize_sql_identifier(column) for column in columns.split(",")]

    def _normalize_sql_identifier(self, value: str) -> str:
        return value.strip().strip('"`[]').lower()

    def _test_schema_index_message(self, table: str, required: dict[str, Any]) -> str:
        kind = "unique index" if bool(required["unique"]) else "index"
        columns = ", ".join(str(column) for column in required["columns"])
        return (
            f"database_config_router.rs test schema must create {kind} "
            f"{required['name']} on {table}({columns})"
        )

    def _test_schema_unique_constraint_message(self, table: str, columns: list[str]) -> str:
        if len(columns) == 1:
            return f"database_config_router.rs test schema must make {table}.{columns[0]} unique"
        return (
            "database_config_router.rs test schema must make "
            f"{table}({', '.join(columns)}) unique"
        )

    def _test_schema_foreign_key_message(self, table: str, required: dict[str, Any]) -> str:
        columns = ", ".join(str(column) for column in required["columns"])
        references_columns = ", ".join(str(column) for column in required["references_columns"])
        return (
            f"database_config_router.rs test schema must create foreign key {required['name']} "
            f"on {table}({columns}) references {required['references_table']}({references_columns})"
        )

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

        messages: list[str] = []
        for name, expected in EXPECTED_API_PREFIXES.items():
            if prefixes.get(name) != expected:
                messages.append(f"api_prefixes.{name} must be {expected}")
        return messages

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
