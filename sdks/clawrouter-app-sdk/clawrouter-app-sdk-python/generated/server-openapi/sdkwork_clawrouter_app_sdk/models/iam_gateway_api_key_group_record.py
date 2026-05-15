from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamGatewayApiKeyGroupRecord:
    """Iam gateway api key group record schema exposed by Claw Router."""
    allowed_origin: Optional[Dict[str, str]] = None
    billing_type: Optional[str] = None
    capacity_limit: Optional[str] = None
    code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_policy_id: Optional[str] = None
    default_quota_policy_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    environment: Optional[str] = None
    group_type: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    official_price_multiplier: Optional[str] = None
    organization_id: Optional[str] = None
    price_reference_mode: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    pricing_plan_id: Optional[str] = None
    provider_code: Optional[str] = None
    rate_multiplier: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
