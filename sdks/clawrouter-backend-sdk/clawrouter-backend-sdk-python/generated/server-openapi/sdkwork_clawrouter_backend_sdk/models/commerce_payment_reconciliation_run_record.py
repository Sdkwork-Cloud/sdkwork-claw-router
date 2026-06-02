from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentReconciliationRunRecord:
    """Commerce payment reconciliation run record schema exposed by Claw Router."""
    created_at: str
    difference_amount: str
    idempotency_key: str
    matched_count: str
    mismatched_count: str
    missing_internal_count: str
    missing_provider_count: str
    period_end: str
    period_start: str
    provider_code: str
    request_no: str
    run_no: str
    settlement_currency: str
    status: str
    tenant_id: str
    total_internal_amount: str
    total_provider_amount: str
    updated_at: str
    completed_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    report_file_ref: Optional[str] = None
    started_at: Optional[str] = None
