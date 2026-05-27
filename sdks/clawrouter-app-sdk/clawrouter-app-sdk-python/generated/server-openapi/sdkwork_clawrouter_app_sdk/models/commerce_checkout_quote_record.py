from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCheckoutQuoteRecord:
    """Commerce checkout quote record schema exposed by Claw Router."""
    checkout_session_id: str
    created_at: str
    currency_code: str
    expires_at: str
    original_amount: str
    payable_amount: str
    quote_no: str
    tenant_id: str
    organization_id: Optional[str] = None
