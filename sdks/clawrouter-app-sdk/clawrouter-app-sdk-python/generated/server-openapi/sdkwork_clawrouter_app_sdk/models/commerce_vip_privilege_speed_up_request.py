from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipPrivilegeSpeedUpRequest:
    """Commerce vip privilege speed up request schema exposed by Claw Router."""
    privilege_code: str
    request_no: str
    remarks: Optional[str] = None
