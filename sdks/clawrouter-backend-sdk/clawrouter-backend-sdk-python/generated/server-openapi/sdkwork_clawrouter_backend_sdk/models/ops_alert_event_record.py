from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsAlertEventRecord:
    """Ops alert event record schema exposed by Claw Router."""
    alert_no: Optional[str] = None
    alert_status: Optional[str] = None
    created_at: Optional[str] = None
    first_seen_at: Optional[str] = None
    id: Optional[str] = None
    last_seen_at: Optional[str] = None
    legal_hold: Optional[bool] = None
    message: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    retention_until: Optional[str] = None
    severity: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
