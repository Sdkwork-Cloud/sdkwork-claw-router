from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageDefaultBucketPolicyRecord:
    """Storage default bucket policy record schema exposed by Claw Router."""
    bucket_id: Optional[str] = None
    bucket_logical_scope: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    logical_scope: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    reason: Optional[str] = None
    request_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    updated_by: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
