from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_billing_record_item import AdminBillingRecordItem


@dataclass
class AdminBillingRecordsResponse:
    """Admin billing records response schema exposed by Claw Router."""
    items: List[AdminBillingRecordItem]
