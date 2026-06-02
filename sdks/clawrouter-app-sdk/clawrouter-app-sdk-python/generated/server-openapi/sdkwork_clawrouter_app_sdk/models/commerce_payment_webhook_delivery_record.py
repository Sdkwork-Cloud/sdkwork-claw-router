from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentWebhookDeliveryRecord:
    """Commerce payment webhook delivery record schema exposed by Claw Router."""
    created_at: str
    delivery_no: str
    delivery_status: str
    event_id: str
    nonce: str
    payload_digest: str
    provider_code: str
    received_at: str
    tenant_id: str
    updated_at: str
    verification_status: str
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    headers_json: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    normalized_event_id: Optional[str] = None
    organization_id: Optional[str] = None
    payload_ref: Optional[str] = None
    processed_at: Optional[str] = None
    provider_account_id: Optional[str] = None
    request_timestamp: Optional[str] = None
    signature: Optional[str] = None
    signature_algorithm: Optional[str] = None
    source_ip: Optional[str] = None
    user_agent: Optional[str] = None
    verified_at: Optional[str] = None
