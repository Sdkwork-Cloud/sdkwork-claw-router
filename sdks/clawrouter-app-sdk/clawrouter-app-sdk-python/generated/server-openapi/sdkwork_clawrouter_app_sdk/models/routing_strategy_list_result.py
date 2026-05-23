from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .routing_strategy_snapshot import RoutingStrategySnapshot


@dataclass
class RoutingStrategyListResult:
    """Routing strategy list result schema exposed by Claw Router."""
    code: str
    data: Optional[RoutingStrategySnapshot] = None
    msg: Optional[str] = None
