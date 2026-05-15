from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsagePricingPlanRecord:
    """Commerce usage pricing plan record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    included_quota: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    overage_pricing_id: Optional[str] = None
    plan_code: Optional[str] = None
    plan_name: Optional[str] = None
    pricing_mode: Optional[str] = None
    product_id: Optional[str] = None
    rate_multiplier: Optional[str] = None
    sku_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    vip_level_id: Optional[str] = None
