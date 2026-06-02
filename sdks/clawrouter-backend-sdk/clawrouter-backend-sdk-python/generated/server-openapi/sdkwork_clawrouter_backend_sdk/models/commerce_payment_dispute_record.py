from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentDisputeRecord:
    """Commerce payment dispute record schema exposed by Claw Router."""
    amount: str
    created_at: str
    currency_code: str
    dispute_no: str
    native_dispute_id: str
    opened_at: str
    payment_attempt_id: str
    provider_code: str
    status: str
    tenant_id: str
    updated_at: str
    closed_at: Optional[str] = None
    evidence_due_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    reason_code: Optional[str] = None
