from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipPurchaseRequest:
    """Commerce vip purchase request schema exposed by Claw Router."""
    pack_id: str
    request_no: str
    remarks: Optional[str] = None
