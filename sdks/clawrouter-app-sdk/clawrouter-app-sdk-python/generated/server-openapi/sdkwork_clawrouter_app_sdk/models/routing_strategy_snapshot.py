from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RoutingStrategySnapshot:
    """Routing strategy snapshot schema exposed by Claw Router."""
    mapping_rules: List[Dict[str, Any]]
    strategy: str
