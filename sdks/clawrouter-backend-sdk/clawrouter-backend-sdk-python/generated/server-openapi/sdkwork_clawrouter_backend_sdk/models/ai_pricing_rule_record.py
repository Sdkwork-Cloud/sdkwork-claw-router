from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPricingRuleRecord:
    """Ai pricing rule record schema exposed by Claw Router."""
    billing_meter_code: str
    effective_from: str
    formula_mode: str
    organization_id: str
    pricing_plan_id: str
    priority: int
    rule_code: str
    status: str
    tenant_id: str
    uuid: str
    billing_meter_id: Optional[str] = None
    billing_mode: Optional[str] = None
    billing_type: Optional[str] = None
    capability_code: Optional[str] = None
    channel_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_to: Optional[str] = None
    expression: Optional[str] = None
    expression_hash: Optional[str] = None
    fallback_mode: Optional[str] = None
    family_code: Optional[str] = None
    id: Optional[str] = None
    included_quantity: Optional[str] = None
    markup_amount: Optional[str] = None
    match_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metering_mode: Optional[str] = None
    minimum_quantity: Optional[str] = None
    model: Optional[str] = None
    model_id: Optional[str] = None
    multiplier: Optional[str] = None
    platform_code: Optional[str] = None
    price_item_type: Optional[str] = None
    price_side: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    provider_code: Optional[str] = None
    provider_model: Optional[str] = None
    quantity_formula: Optional[str] = None
    quantity_source: Optional[str] = None
    quantity_step: Optional[str] = None
    reference_price_side: Optional[str] = None
    reference_pricing_id: Optional[str] = None
    reference_pricing_scope: Optional[str] = None
    region: Optional[str] = None
    result_selector: Optional[str] = None
    rule_name: Optional[str] = None
    service_tier: Optional[str] = None
    unit: Optional[str] = None
    unit_price_override: Optional[str] = None
    unit_size: Optional[str] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
