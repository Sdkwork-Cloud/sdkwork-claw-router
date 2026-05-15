from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPricingPlanRecord:
    """Ai pricing plan record schema exposed by Claw Router."""
    base_price_side: str
    currency: str
    effective_from: str
    organization_id: str
    plan_code: str
    plan_name: str
    status: str
    tenant_id: str
    uuid: str
    base_pricing_scope: Optional[str] = None
    billing_mode: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_markup_amount: Optional[str] = None
    default_multiplier: Optional[str] = None
    default_reference_price_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    effective_to: Optional[str] = None
    fallback_mode: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    min_charge_amount: Optional[str] = None
    plan_scope: Optional[str] = None
    price_version: Optional[str] = None
    priority: Optional[int] = None
    rounding_mode: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
