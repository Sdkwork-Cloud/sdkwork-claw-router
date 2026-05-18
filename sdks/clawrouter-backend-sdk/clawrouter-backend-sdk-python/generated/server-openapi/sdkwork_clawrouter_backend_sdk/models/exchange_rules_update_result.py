from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_exchange_rule_mutation_response import AdminExchangeRuleMutationResponse


@dataclass
class ExchangeRulesUpdateResult:
    """Exchange rules update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminExchangeRuleMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
