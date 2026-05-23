from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_list_response import CommercePaymentProviderListResponse


@dataclass
class PaymentsProvidersListResult:
    """Payments providers list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentProviderListResponse] = None
    msg: Optional[str] = None
