from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentWebhookEventRecord:
    """Commerce payment webhook event record schema exposed by Claw Router."""
    created_at: str
    event_id: str
    idempotency_key: str
    nonce: str
    out_trade_no: str
    payload_digest: str
    provider: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    id: Optional[str] = None
    message: Optional[str] = None
    organization_id: Optional[str] = None
    processed_at: Optional[str] = None
    request_timestamp: Optional[str] = None
    signature: Optional[str] = None
    transaction_id: Optional[str] = None
