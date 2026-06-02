from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageUsageLedgerRecord:
    """Storage usage ledger record schema exposed by Claw Router."""
    app_id: Optional[str] = None
    business_domain: Optional[str] = None
    created_at: Optional[str] = None
    delta_file_count: Optional[str] = None
    delta_logical_bytes: Optional[str] = None
    delta_physical_bytes: Optional[str] = None
    delta_reserved_bytes: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    reason: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    space_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_event_type: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
