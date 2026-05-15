from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AccountConsumptionItem:
    """Account consumption item schema exposed by Claw Router."""
    color: str
    name: str
    percentage: float
    value: float
