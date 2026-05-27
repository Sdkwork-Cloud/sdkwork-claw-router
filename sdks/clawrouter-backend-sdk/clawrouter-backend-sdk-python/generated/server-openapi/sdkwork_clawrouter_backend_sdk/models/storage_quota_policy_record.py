from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageQuotaPolicyRecord:
    """Storage quota policy record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    enforcement: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    quota_limit_bytes: Optional[str] = None
    request_id: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    single_file_limit_bytes: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
