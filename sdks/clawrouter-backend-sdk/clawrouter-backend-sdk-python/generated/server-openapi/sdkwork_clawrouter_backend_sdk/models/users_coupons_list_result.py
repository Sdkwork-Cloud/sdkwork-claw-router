from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_redemption_records_response import AdminRedemptionRecordsResponse


@dataclass
class UsersCouponsListResult:
    """Users coupons list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRedemptionRecordsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
