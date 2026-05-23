from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentIntentRecord:
    """Commerce payment intent record schema exposed by Claw Router."""
    amount: str
    created_at: str
    currency_code: str
    idempotency_key: str
    order_id: str
    owner_user_id: str
    provider: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
