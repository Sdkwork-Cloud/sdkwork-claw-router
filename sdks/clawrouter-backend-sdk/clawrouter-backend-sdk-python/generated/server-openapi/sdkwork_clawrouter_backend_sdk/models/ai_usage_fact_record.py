from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiUsageFactRecord:
    """Ai usage fact record schema exposed by Claw Router."""
    catalog_key: str
    uuid: str
    api_key_id: Optional[str] = None
    api_key_name_snapshot: Optional[str] = None
    audio_seconds: Optional[str] = None
    bandwidth_bytes: Optional[str] = None
    base_input_unit_price: Optional[str] = None
    base_output_unit_price: Optional[str] = None
    billable_quantity: Optional[str] = None
    billable_unit: Optional[str] = None
    billing_meter_code: Optional[str] = None
    billing_meter_id: Optional[str] = None
    billing_mode: Optional[str] = None
    billing_tier: Optional[str] = None
    billing_type: Optional[str] = None
    cache_read_unit_price: Optional[str] = None
    cached_tokens: Optional[str] = None
    channel_group_id: Optional[str] = None
    channel_group_snapshot: Optional[str] = None
    channel_id: Optional[str] = None
    character_count: Optional[str] = None
    completion_tokens: Optional[str] = None
    cost_amount: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    customer_charge_amount: Optional[str] = None
    decision_log_id: Optional[str] = None
    id: Optional[str] = None
    image_count: Optional[str] = None
    item_count: Optional[str] = None
    legacy_api_key_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    model: Optional[str] = None
    occurred_at: Optional[str] = None
    official_reference_amount: Optional[str] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_name_snapshot: Optional[str] = None
    owner_type: Optional[str] = None
    payload_hash: Optional[str] = None
    pricing_id: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    pricing_plan_id: Optional[str] = None
    pricing_rule_id: Optional[str] = None
    pricing_snapshot: Optional[Dict[str, str]] = None
    pricing_tier_id: Optional[str] = None
    prompt_tokens: Optional[str] = None
    provider_id: Optional[str] = None
    provider_native_model: Optional[str] = None
    rate_multiplier: Optional[str] = None
    reasoning_effort: Optional[str] = None
    reference_multiplier: Optional[str] = None
    region_code: Optional[str] = None
    request_count: Optional[str] = None
    request_id: Optional[str] = None
    requested_model_catalog_key: Optional[str] = None
    result_count: Optional[str] = None
    retention_until: Optional[str] = None
    settlement_id: Optional[str] = None
    settlement_status: Optional[str] = None
    status: Optional[str] = None
    storage_byte_hours: Optional[str] = None
    tenant_id: Optional[str] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
    unit_price_snapshot: Optional[str] = None
    upstream_cost_amount: Optional[str] = None
    usage_type: Optional[str] = None
    user_id: Optional[str] = None
    video_seconds: Optional[str] = None
