from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_intent_response import CommercePaymentIntentResponse


@dataclass
class PaymentsIntentsCreateResult:
    """Payments intents create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentIntentResponse] = None
    msg: Optional[str] = None
