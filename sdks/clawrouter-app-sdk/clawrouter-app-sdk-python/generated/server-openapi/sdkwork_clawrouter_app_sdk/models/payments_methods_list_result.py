from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_method_list_response import CommercePaymentMethodListResponse


@dataclass
class PaymentsMethodsListResult:
    """Payments methods list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentMethodListResponse] = None
    msg: Optional[str] = None
