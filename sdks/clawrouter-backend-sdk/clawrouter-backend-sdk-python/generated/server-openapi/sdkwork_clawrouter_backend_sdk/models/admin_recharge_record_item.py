from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminRechargeRecordItem:
    """Admin recharge record item schema exposed by Claw Router."""
    amount: str
    id: str
    method: str
    status: str
    time: str
    trade_no: str
    usd_credited: str
    user: str
    user_id: str
