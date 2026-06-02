from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_recharge_settings_response import AdminRechargeSettingsResponse


@dataclass
class RechargesSettingsUpdateResult:
    """Recharges settings update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminRechargeSettingsResponse] = None
    msg: Optional[str] = None
