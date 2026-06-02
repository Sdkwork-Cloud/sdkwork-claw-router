from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInvoiceProviderAttemptRecord:
    """Commerce invoice provider attempt record schema exposed by Claw Router."""
    attempt_no: str
    created_at: str
    invoice_id: str
    provider_code: str
    status: str
    tenant_id: str
    updated_at: str
    failed_at: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_invoice_id: Optional[str] = None
    submitted_at: Optional[str] = None
    succeeded_at: Optional[str] = None
