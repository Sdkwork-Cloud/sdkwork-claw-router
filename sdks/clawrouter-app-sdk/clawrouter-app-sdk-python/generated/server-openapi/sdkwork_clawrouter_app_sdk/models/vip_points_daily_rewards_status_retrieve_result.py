from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_vip_daily_reward_status_response import CommerceVipDailyRewardStatusResponse


@dataclass
class VipPointsDailyRewardsStatusRetrieveResult:
    """Vip points daily rewards status retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceVipDailyRewardStatusResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
