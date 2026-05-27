from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageGcJobRecord:
    """Storage gc job record schema exposed by Claw Router."""
    completed_at: Optional[str] = None
    created_at: Optional[str] = None
    cursor_token: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    job_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    request_id: Optional[str] = None
    requested_by: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
