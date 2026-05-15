from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceWalletAccountItem:
    """Commerce wallet account item schema exposed by Claw Router."""
    asset_type: str
    available_amount: str
    currency_code: str
    frozen_amount: str
    id: str
    status: str
