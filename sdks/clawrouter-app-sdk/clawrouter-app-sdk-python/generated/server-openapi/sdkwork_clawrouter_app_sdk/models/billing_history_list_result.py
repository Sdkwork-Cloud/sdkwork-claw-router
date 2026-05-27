from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .billing_history_collection_response import BillingHistoryCollectionResponse


@dataclass
class BillingHistoryListResult:
    """Billing history list result schema exposed by Claw Router."""
    code: str
    data: Optional[BillingHistoryCollectionResponse] = None
    msg: Optional[str] = None
