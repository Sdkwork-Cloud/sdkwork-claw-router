from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipPackItem:
    """Commerce vip pack item schema exposed by Claw Router."""
    code: str
    currency_code: str
    id: str
    name: str
    price_amount: str
    status: str
