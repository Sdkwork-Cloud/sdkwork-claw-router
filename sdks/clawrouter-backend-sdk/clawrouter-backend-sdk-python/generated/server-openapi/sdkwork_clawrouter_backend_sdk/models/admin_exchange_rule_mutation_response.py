from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_exchange_rule_item import CommerceExchangeRuleItem


@dataclass
class AdminExchangeRuleMutationResponse:
    """Admin exchange rule mutation response schema exposed by Claw Router."""
    item: CommerceExchangeRuleItem
