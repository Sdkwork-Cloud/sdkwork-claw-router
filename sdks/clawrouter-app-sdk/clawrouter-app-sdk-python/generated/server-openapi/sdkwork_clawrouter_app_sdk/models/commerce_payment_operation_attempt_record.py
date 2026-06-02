from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentOperationAttemptRecord:
    """Commerce payment operation attempt record schema exposed by Claw Router."""
    created_at: str
    idempotency_key: str
    operation_code: str
    operation_no: str
    provider_code: str
    request_digest: str
    sdkwork_resource_id: str
    sdkwork_resource_type: str
    started_at: str
    status: str
    tenant_id: str
    channel_id: Optional[str] = None
    completed_at: Optional[str] = None
    http_status: Optional[str] = None
    id: Optional[str] = None
    native_refund_id: Optional[str] = None
    native_request_id: Optional[str] = None
    native_trade_id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_error_code: Optional[str] = None
    provider_error_message: Optional[str] = None
    response_digest: Optional[str] = None
    retryable: Optional[str] = None
