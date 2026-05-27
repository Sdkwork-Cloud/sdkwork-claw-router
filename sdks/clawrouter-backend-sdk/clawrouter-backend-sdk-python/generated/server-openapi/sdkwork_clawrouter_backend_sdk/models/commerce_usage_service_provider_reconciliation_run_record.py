from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderReconciliationRunRecord:
    """Commerce usage service provider reconciliation run record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    difference_amount: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    matched_count: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mismatch_count: Optional[str] = None
    missing_external_count: Optional[str] = None
    missing_internal_count: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    run_no: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_external_amount: Optional[str] = None
    total_internal_amount: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
