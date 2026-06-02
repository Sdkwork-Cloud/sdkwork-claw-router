from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentCaptureRecord:
    """Commerce payment capture record schema exposed by Claw Router."""
    amount: str
    capture_no: str
    created_at: str
    currency_code: str
    final_capture: str
    idempotency_key: str
    payment_attempt_id: str
    provider_code: str
    request_no: str
    status: str
    tenant_id: str
    updated_at: str
    failed_at: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    id: Optional[str] = None
    native_capture_id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    submitted_at: Optional[str] = None
    succeeded_at: Optional[str] = None
