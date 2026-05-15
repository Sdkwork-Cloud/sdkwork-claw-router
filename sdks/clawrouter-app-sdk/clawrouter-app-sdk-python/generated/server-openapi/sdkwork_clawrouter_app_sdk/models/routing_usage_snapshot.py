from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RoutingUsageSnapshot:
    """Routing usage snapshot schema exposed by Claw Router."""
    chart_data: List[Dict[str, Any]]
    model_stats: List[Dict[str, Any]]
