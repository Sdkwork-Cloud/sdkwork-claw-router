from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminRedemptionRecordItem:
    """Admin redemption record item schema exposed by Claw Router."""
    amount: str
    code: str
    id: str
    time: str
    user: str
    user_id: str
