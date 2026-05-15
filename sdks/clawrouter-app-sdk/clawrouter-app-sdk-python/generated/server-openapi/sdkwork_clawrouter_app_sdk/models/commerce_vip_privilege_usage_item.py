from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipPrivilegeUsageItem:
    """Commerce vip privilege usage item schema exposed by Claw Router."""
    period_key: str
    privilege_code: str
    quota_count: int
    used_count: int
