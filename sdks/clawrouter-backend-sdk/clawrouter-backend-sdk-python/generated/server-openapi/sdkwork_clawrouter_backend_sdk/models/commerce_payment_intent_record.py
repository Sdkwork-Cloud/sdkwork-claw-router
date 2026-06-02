from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentIntentRecord:
    """Commerce payment intent record schema exposed by Claw Router."""
    amount: str
    captured_amount: str
    created_at: str
    currency_code: str
    idempotency_key: str
    merchant_order_no: str
    order_id: str
    owner_user_id: str
    payment_method: str
    provider: str
    provider_code: str
    refunded_amount: str
    request_no: str
    scene_code: str
    status: str
    subject: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    metadata_json: Optional[str] = None
    next_action_json: Optional[str] = None
    organization_id: Optional[str] = None
    provider_native_json: Optional[str] = None
