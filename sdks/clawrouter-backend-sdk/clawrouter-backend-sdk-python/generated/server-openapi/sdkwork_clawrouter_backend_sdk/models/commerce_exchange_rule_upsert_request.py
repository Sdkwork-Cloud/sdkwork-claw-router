from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceExchangeRuleUpsertRequest:
    """Commerce exchange rule upsert request schema exposed by Claw Router."""
    rate: str
    source_asset_type: str
    target_asset_type: str
    status: Optional[str] = None
