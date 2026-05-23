from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_exchange_rule_item import CommerceExchangeRuleItem


@dataclass
class AccountPointsExchangesRulesListResult:
    """Account points exchanges rules list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceExchangeRuleItem]] = None
    msg: Optional[str] = None
