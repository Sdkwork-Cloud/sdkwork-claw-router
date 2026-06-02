from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_runtime_snapshot_response import CommercePaymentRuntimeSnapshotResponse


@dataclass
class PaymentsRuntimeSnapshotRetrieveResult:
    """Payments runtime snapshot retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentRuntimeSnapshotResponse] = None
    msg: Optional[str] = None
