from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_account_delete_response import CommercePaymentProviderAccountDeleteResponse


@dataclass
class PaymentsProviderAccountsDeleteResult:
    """Payments provider accounts delete result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentProviderAccountDeleteResponse] = None
    msg: Optional[str] = None
