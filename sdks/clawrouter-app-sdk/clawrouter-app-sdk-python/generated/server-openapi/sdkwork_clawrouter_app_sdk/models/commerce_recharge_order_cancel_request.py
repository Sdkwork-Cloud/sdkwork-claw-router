from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargeOrderCancelRequest:
    """Commerce recharge order cancel request schema exposed by Claw Router."""
    reason: Optional[str] = None
