from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_intent_list_response import CommercePaymentIntentListResponse


@dataclass
class PaymentsIntentsListResult:
    """Payments intents list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentIntentListResponse] = None
    msg: Optional[str] = None
