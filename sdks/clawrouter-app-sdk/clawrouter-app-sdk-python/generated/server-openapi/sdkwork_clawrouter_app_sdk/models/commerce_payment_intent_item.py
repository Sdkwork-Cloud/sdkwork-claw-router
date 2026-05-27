from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentIntentItem:
    """Commerce payment intent item schema exposed by Claw Router."""
    amount: str
    created_at: str
    currency_code: str
    id: str
    intent_no: str
    order_id: str
    status: str
    subject_type: str
    updated_at: str
    checkout_session_id: Optional[str] = None
    method_code: Optional[str] = None
    provider_code: Optional[str] = None
