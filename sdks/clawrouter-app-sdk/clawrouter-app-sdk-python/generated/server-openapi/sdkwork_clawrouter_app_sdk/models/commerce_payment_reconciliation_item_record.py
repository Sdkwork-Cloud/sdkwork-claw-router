from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentReconciliationItemRecord:
    """Commerce payment reconciliation item record schema exposed by Claw Router."""
    created_at: str
    difference_type: str
    match_status: str
    provider_code: str
    reconciliation_run_id: str
    resolution_status: str
    tenant_id: str
    updated_at: str
    currency_code: Optional[str] = None
    difference_amount: Optional[str] = None
    id: Optional[str] = None
    internal_amount: Optional[str] = None
    internal_status: Optional[str] = None
    organization_id: Optional[str] = None
    payment_attempt_id: Optional[str] = None
    provider_amount: Optional[str] = None
    provider_status: Optional[str] = None
    refund_attempt_id: Optional[str] = None
    refund_id: Optional[str] = None
    resolution_note: Optional[str] = None
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    statement_id: Optional[str] = None
    statement_item_id: Optional[str] = None
