from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_records_response import AdminRechargeRecordsResponse


@dataclass
class VipRechargeListResult:
    """Vip recharge list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRechargeRecordsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
