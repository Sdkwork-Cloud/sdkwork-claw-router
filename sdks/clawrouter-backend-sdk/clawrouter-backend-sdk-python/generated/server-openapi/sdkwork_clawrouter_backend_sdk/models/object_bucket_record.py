from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ObjectBucketRecord:
    """Object bucket record schema exposed by Claw Router."""
    bucket_name: Optional[str] = None
    bucket_region: Optional[str] = None
    created_at: Optional[str] = None
    data_residency_region: Optional[str] = None
    data_scope: Optional[str] = None
    default_encryption_mode: Optional[str] = None
    default_storage_class: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    kms_key_ref: Optional[str] = None
    lifecycle_enabled: Optional[bool] = None
    logical_scope: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    object_key_prefix: Optional[str] = None
    object_lock_enabled: Optional[bool] = None
    organization_id: Optional[str] = None
    provider_id: Optional[str] = None
    public_access_blocked: Optional[bool] = None
    request_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    versioning_enabled: Optional[bool] = None
