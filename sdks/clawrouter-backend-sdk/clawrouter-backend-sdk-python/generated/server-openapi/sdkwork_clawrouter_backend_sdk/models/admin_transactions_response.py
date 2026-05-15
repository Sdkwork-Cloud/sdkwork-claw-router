from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_transaction_record_item import AdminTransactionRecordItem


@dataclass
class AdminTransactionsResponse:
    """Admin transactions response schema exposed by Claw Router."""
    items: List[AdminTransactionRecordItem]
