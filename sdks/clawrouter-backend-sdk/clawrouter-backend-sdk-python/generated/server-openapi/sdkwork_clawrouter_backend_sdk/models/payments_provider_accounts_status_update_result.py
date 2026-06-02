from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_account_mutation_response import CommercePaymentProviderAccountMutationResponse


@dataclass
class PaymentsProviderAccountsStatusUpdateResult:
    """Payments provider accounts status update result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentProviderAccountMutationResponse] = None
    msg: Optional[str] = None
