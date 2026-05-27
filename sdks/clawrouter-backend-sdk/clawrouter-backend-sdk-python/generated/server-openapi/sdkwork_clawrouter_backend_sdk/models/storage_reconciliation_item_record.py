from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageReconciliationItemRecord:
    """Storage reconciliation item record schema exposed by Claw Router."""
    actual_hash: Optional[str] = None
    actual_size_bytes: Optional[str] = None
    bucket_id: Optional[str] = None
    created_at: Optional[str] = None
    expected_hash: Optional[str] = None
    expected_size_bytes: Optional[str] = None
    id: Optional[str] = None
    issue_type: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    object_blob_id: Optional[str] = None
    object_key: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    repair_payload: Optional[Dict[str, str]] = None
    repair_status: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    run_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
