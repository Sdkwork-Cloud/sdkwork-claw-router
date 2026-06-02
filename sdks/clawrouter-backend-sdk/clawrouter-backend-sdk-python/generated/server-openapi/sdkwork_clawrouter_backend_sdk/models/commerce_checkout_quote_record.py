from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCheckoutQuoteRecord:
    """Commerce checkout quote record schema exposed by Claw Router."""
    checkout_session_id: str
    created_at: str
    currency_code: str
    discount_amount: str
    expires_at: str
    original_amount: str
    payable_amount: str
    quote_no: str
    shipping_amount: str
    tax_amount: str
    tenant_id: str
    id: Optional[str] = None
    organization_id: Optional[str] = None
