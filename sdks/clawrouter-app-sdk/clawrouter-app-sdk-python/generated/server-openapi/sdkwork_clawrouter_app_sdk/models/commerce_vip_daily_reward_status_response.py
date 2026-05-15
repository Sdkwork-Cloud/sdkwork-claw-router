from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceVipDailyRewardStatusResponse:
    """Commerce vip daily reward status response schema exposed by Claw Router."""
    available: bool
    claimed_today: bool
