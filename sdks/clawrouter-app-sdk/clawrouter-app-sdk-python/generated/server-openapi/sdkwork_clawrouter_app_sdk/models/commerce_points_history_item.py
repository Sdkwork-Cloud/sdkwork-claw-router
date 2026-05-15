from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePointsHistoryItem:
    """Commerce points history item schema exposed by Claw Router."""
    amount: int
    balance_after: int
    business_type: str
    created_at: str
    direction: str
    id: str
