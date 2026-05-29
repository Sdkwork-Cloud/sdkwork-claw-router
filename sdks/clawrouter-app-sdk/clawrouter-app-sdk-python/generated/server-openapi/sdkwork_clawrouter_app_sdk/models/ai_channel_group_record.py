from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelGroupRecord:
    """Ai channel group record schema exposed by Claw Router."""
    group_code: str
    group_name: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    allowed_origin: Optional[Dict[str, str]] = None
    billing_type: Optional[str] = None
    capacity_limit: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    environment: Optional[str] = None
    group_type: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    official_price_multiplier: Optional[str] = None
    price_reference_mode: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    pricing_plan_id: Optional[str] = None
    provider_code: Optional[str] = None
    quota_policy_id: Optional[str] = None
    rate_limit_policy_id: Optional[str] = None
    rate_multiplier: Optional[str] = None
    routing_policy_id: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
