from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsConfigSnapshotRecord:
    """Ops config snapshot record schema exposed by Claw Router."""
    config_hash: Optional[str] = None
    config_payload: Optional[Dict[str, str]] = None
    config_scope: Optional[str] = None
    config_type: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    published_at: Optional[str] = None
    published_by: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    rollback_from_snapshot_id: Optional[str] = None
    snapshot_no: Optional[str] = None
    source_ids: Optional[Dict[str, str]] = None
    source_table: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
