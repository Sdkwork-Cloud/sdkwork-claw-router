from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminTransactionRecordItem:
    """Admin transaction record item schema exposed by Claw Router."""
    amount: str
    balance: str
    description: str
    id: str
    status: str
    time: str
    type: str
    user_id: str
