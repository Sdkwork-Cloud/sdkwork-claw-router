from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPricingTierRecord:
    """Ai pricing tier record schema exposed by Claw Router."""
    billing_meter_code: str
    effective_from: str
    organization_id: str
    sort_order: int
    status: str
    tenant_id: str
    tier_code: str
    uuid: str
    audio_unit_price: Optional[str] = None
    billing_meter_id: Optional[str] = None
    billing_mode: Optional[str] = None
    cache_read_unit_price: Optional[str] = None
    cache_write_unit_price: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    image_unit_price: Optional[str] = None
    included_quantity: Optional[str] = None
    input_unit_price: Optional[str] = None
    max_quantity: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    min_quantity: Optional[str] = None
    model_pricing_id: Optional[str] = None
    multiplier: Optional[str] = None
    output_unit_price: Optional[str] = None
    per_request_price: Optional[str] = None
    price_item_type: Optional[str] = None
    pricing_rule_id: Optional[str] = None
    quantity_step: Optional[str] = None
    quantity_unit: Optional[str] = None
    result_selector: Optional[str] = None
    tier_label: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
    video_unit_price: Optional[str] = None
