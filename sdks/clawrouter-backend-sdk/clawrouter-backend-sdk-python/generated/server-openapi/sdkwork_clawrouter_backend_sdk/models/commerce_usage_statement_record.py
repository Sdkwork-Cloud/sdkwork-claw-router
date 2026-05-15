from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageStatementRecord:
    """Commerce usage statement record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    currency: Optional[str] = None
    due_at: Optional[str] = None
    export_id: Optional[str] = None
    generated_at: Optional[str] = None
    id: Optional[str] = None
    invoice_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    paid_at: Optional[str] = None
    payment_status: Optional[str] = None
    period: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    rebuild_version: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    statement_no: Optional[str] = None
    statement_status: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_cost: Optional[str] = None
    total_requests: Optional[str] = None
    total_tokens: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
