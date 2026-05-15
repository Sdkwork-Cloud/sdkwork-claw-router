from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_coupons_response import AdminCouponsResponse


@dataclass
class CouponsListResult:
    """Coupons list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCouponsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
