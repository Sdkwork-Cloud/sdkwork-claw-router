from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_payment_attempts_response import AdminPaymentAttemptsResponse


@dataclass
class PaymentsAttemptsListResult:
    """Payments attempts list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminPaymentAttemptsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
