from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceWalletOverviewResponse:
    """Commerce wallet overview response schema exposed by Claw Router."""
    available_amount: str
    currency_code: str
    frozen_amount: str
