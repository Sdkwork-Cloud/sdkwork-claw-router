from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_route_rule_list_response import CommercePaymentRouteRuleListResponse


@dataclass
class PaymentsRouteRulesListResult:
    """Payments route rules list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentRouteRuleListResponse] = None
    msg: Optional[str] = None
