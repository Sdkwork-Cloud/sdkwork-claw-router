from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_attempt_response import CommercePaymentAttemptResponse


@dataclass
class PaymentsAttemptsRetrieveResult:
    """Payments attempts retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentAttemptResponse] = None
    msg: Optional[str] = None
