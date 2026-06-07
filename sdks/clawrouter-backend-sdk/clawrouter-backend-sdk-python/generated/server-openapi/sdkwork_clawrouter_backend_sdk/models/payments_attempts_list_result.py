from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_attempt_list_response import CommercePaymentAttemptListResponse


@dataclass
class PaymentsAttemptsListResult:
    """Payments attempts list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentAttemptListResponse] = None
    msg: Optional[str] = None
