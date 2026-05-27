from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentIntentCreateRequest:
    """Commerce payment intent create request schema exposed by Claw Router."""
    amount: str
    currency_code: str
    method_code: str
    order_id: str
    subject_type: str
    checkout_session_id: Optional[str] = None
    client_request_no: Optional[str] = None
    note: Optional[str] = None
