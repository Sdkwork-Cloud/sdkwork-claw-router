from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_record_item import AdminRechargeRecordItem


@dataclass
class RechargesRecordsRetrieveResult:
    """Recharges records retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRechargeRecordItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
