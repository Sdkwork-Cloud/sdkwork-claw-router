from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_route_rule_item import CommercePaymentRouteRuleItem


@dataclass
class CommercePaymentRouteRuleListResponse:
    """Commerce payment route rule list response schema exposed by Claw Router."""
    items: List[CommercePaymentRouteRuleItem]
    page: int
    page_size: int
    total: int
