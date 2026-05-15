from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceBillingExportRecord:
    """Commerce billing export record schema exposed by Claw Router."""
    approved_by: Optional[str] = None
    audit_log_id: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    download_count: Optional[str] = None
    expire_at: Optional[str] = None
    export_no: Optional[str] = None
    export_type: Optional[str] = None
    file_hash: Optional[str] = None
    file_manifest: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    statement_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
