from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentAttemptRecord:
    """Commerce payment attempt record schema exposed by Claw Router."""
    amount: str
    created_at: str
    currency_code: str
    order_id: str
    out_trade_no: str
    owner_user_id: str
    payment_intent_id: str
    provider: str
    status: str
    tenant_id: str
    updated_at: str
    callback_payload: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    paid_at: Optional[str] = None
