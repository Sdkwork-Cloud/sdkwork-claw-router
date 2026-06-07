from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentAttemptItem:
    """Commerce payment attempt item schema exposed by Claw Router."""
    amount: str
    attempt_no: str
    created_at: str
    currency_code: str
    id: str
    intent_id: str
    provider_code: str
    status: str
    external_trade_no: Optional[str] = None
    method_code: Optional[str] = None
    paid_at: Optional[str] = None
    updated_at: Optional[str] = None
