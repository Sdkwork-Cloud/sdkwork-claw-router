from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_reconciliation_run_item import CommercePaymentReconciliationRunItem


@dataclass
class CommercePaymentReconciliationRunListResponse:
    """Commerce payment reconciliation run list response schema exposed by Claw Router."""
    items: List[CommercePaymentReconciliationRunItem]
    page: str
    page_size: str
    total: str
