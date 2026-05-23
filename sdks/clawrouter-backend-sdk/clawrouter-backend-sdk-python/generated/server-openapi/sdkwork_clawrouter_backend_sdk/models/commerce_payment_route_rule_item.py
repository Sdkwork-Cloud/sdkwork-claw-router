from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRouteRuleItem:
    """Commerce payment route rule item schema exposed by Claw Router."""
    country_code: str
    created_at: str
    currency_code: str
    fallback_enabled: bool
    id: str
    method_code: str
    priority: int
    rule_no: str
    scene_code: str
    status: str
    updated_at: str
    channel_id: Optional[str] = None
    fallback_channel_id: Optional[str] = None
