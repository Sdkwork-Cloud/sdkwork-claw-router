from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageUsageSnapshotRecord:
    """Storage usage snapshot record schema exposed by Claw Router."""
    app_id: Optional[str] = None
    business_domain: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    file_count: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    reserved_bytes: Optional[str] = None
    retained_bytes: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    snapshot_at: Optional[str] = None
    snapshot_type: Optional[str] = None
    space_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trash_bytes: Optional[str] = None
    updated_at: Optional[str] = None
    used_logical_bytes: Optional[str] = None
    used_physical_bytes: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
