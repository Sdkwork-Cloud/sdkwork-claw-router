from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_account_list_response import CommercePaymentProviderAccountListResponse


@dataclass
class PaymentsProviderAccountsListResult:
    """Payments provider accounts list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentProviderAccountListResponse] = None
    msg: Optional[str] = None
