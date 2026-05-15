from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RedeemCodeRequest:
    """Redeem code request schema exposed by Claw Router."""
    code: str
