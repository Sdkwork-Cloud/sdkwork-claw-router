from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRechargeSettingsUpdateRequest:
    """Commerce recharge settings update request schema exposed by Claw Router."""
    base_currency_code: str
    base_points_per_cny: str
    currency_to_cny_rates: Dict[str, str]
