from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelPricingRecord:
    """Ai model pricing record schema exposed by Claw Router."""
    billing_meter_code: str
    billing_mode: str
    catalog_key: str
    currency: str
    effective_from: str
    model: str
    organization_id: str
    price_side: str
    region_code: str
    status: str
    tenant_id: str
    unit_price: str
    unit_size: str
    uuid: str
    vendor_code: str
    billing_meter_id: Optional[str] = None
    billing_type: Optional[str] = None
    channel_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    import_snapshot_id: Optional[str] = None
    included_quantity: Optional[str] = None
    markup_amount: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metering_mode: Optional[str] = None
    min_charge_amount: Optional[str] = None
    minimum_quantity: Optional[str] = None
    model_id: Optional[str] = None
    observed_at: Optional[str] = None
    platform_code: Optional[str] = None
    price_item_type: Optional[str] = None
    price_origin: Optional[str] = None
    price_version: Optional[str] = None
    pricing_formula_mode: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    pricing_plan_id: Optional[str] = None
    pricing_scope: Optional[str] = None
    pricing_scope_id: Optional[str] = None
    priority: Optional[int] = None
    provider_code: Optional[str] = None
    provider_model: Optional[str] = None
    published_at: Optional[str] = None
    quantity_formula: Optional[str] = None
    quantity_source: Optional[str] = None
    quantity_step: Optional[str] = None
    reference_multiplier: Optional[str] = None
    reference_price_id: Optional[str] = None
    reference_price_side: Optional[str] = None
    result_selector: Optional[str] = None
    rounding_mode: Optional[str] = None
    service_tier: Optional[str] = None
    source_hash: Optional[str] = None
    source_price_id: Optional[str] = None
    source_url: Optional[str] = None
    unit: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
