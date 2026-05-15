from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .update_routing_strategy_response import UpdateRoutingStrategyResponse


@dataclass
class RoutingStrategyUpdateResult:
    """Routing strategy update result schema exposed by Claw Router."""
    code: str
    data: Optional[UpdateRoutingStrategyResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
