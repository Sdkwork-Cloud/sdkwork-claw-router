from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_redemption_record_item import AdminRedemptionRecordItem


@dataclass
class AdminRedemptionRecordsResponse:
    """Admin redemption records response schema exposed by Claw Router."""
    items: List[AdminRedemptionRecordItem]
