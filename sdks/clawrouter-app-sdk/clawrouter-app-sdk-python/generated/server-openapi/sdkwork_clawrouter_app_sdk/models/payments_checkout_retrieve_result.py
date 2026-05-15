from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .checkout_status_response import CheckoutStatusResponse


@dataclass
class PaymentsCheckoutRetrieveResult:
    """Payments checkout retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CheckoutStatusResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
