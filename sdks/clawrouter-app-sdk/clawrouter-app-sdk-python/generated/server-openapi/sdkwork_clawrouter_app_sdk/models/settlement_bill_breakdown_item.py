from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SettlementBillBreakdownItem:
    """Settlement bill breakdown item schema exposed by Claw Router."""
    cost: str
    models: List[str]
    usage: str
