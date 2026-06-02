from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRouteDecisionRecord:
    """Commerce payment route decision record schema exposed by Claw Router."""
    amount: str
    channel_id: str
    created_at: str
    currency_code: str
    method_code: str
    payment_attempt_id: str
    payment_intent_id: str
    provider_code: str
    scene_code: str
    tenant_id: str
    country_code: Optional[str] = None
    decision_reason: Optional[str] = None
    fallback_from_channel_id: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    risk_level: Optional[str] = None
    route_rule_id: Optional[str] = None
