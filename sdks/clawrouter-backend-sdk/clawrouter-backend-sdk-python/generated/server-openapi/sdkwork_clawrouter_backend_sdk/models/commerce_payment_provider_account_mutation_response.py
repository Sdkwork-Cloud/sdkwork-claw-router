from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_provider_account_item import CommercePaymentProviderAccountItem


@dataclass
class CommercePaymentProviderAccountMutationResponse:
    """Commerce payment provider account mutation response schema exposed by Claw Router."""
    item: CommercePaymentProviderAccountItem
