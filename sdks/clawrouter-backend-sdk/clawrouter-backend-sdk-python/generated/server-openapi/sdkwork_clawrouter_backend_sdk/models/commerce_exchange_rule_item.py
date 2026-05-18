from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceExchangeRuleItem:
    """Commerce exchange rule item schema exposed by Claw Router."""
    id: str
    rate: str
    source_asset_type: str
    status: str
    target_asset_type: str
