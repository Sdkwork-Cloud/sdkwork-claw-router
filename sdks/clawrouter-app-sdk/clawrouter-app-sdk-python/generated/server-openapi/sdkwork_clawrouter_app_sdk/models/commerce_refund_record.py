from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceRefundRecord:
    """Commerce refund record schema exposed by Claw Router."""
    amount: str
    created_at: str
    idempotency_key: str
    payment_attempt_id: str
    refund_no: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    currency_code: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    payment_intent_id: Optional[str] = None
    provider_code: Optional[str] = None
    reason: Optional[str] = None
