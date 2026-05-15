from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsAuditLogRecord:
    """Ops audit log record schema exposed by Claw Router."""
    action: Optional[str] = None
    after_hash: Optional[str] = None
    approval_id: Optional[str] = None
    before_hash: Optional[str] = None
    change_summary: Optional[Dict[str, str]] = None
    client_ip_hash: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    operator_id: Optional[str] = None
    operator_name_snapshot: Optional[str] = None
    operator_type: Optional[str] = None
    organization_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    risk_level: Optional[str] = None
    target_id: Optional[str] = None
    target_type: Optional[str] = None
    target_uuid: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_agent_hash: Optional[str] = None
    uuid: Optional[str] = None
