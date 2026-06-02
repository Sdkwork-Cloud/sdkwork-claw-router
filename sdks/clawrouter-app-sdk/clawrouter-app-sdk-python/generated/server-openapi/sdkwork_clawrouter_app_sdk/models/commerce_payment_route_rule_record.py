from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRouteRuleRecord:
    """Commerce payment route rule record schema exposed by Claw Router."""
    channel_id: str
    created_at: str
    priority: str
    rule_no: str
    status: str
    tenant_id: str
    updated_at: str
    amount_max: Optional[str] = None
    amount_min: Optional[str] = None
    client_platform: Optional[str] = None
    country_code: Optional[str] = None
    currency_code: Optional[str] = None
    ends_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    purchase_type: Optional[str] = None
    risk_level: Optional[str] = None
    starts_at: Optional[str] = None
    user_segment: Optional[str] = None
