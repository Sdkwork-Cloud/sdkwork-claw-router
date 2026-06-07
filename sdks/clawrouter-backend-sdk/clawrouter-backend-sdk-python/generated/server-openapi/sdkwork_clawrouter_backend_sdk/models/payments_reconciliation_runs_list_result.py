from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_reconciliation_run_list_response import CommercePaymentReconciliationRunListResponse


@dataclass
class PaymentsReconciliationRunsListResult:
    """Payments reconciliation runs list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentReconciliationRunListResponse] = None
    msg: Optional[str] = None
