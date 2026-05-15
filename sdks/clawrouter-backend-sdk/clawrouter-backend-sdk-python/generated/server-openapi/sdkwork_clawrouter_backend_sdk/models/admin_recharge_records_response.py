from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_record_item import AdminRechargeRecordItem


@dataclass
class AdminRechargeRecordsResponse:
    """Admin recharge records response schema exposed by Claw Router."""
    items: List[AdminRechargeRecordItem]
