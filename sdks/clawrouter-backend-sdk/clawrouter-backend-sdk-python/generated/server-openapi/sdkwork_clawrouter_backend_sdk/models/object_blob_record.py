from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ObjectBlobRecord:
    """Object blob record schema exposed by Claw Router."""
    bucket_id: Optional[str] = None
    content_sha256: Optional[str] = None
    content_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    encryption_mode: Optional[str] = None
    id: Optional[str] = None
    kms_key_ref: Optional[str] = None
    last_verified_at: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    object_key: Optional[str] = None
    organization_id: Optional[str] = None
    original_filename: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    physical_size_bytes: Optional[str] = None
    provider_id: Optional[str] = None
    retention_until: Optional[str] = None
    size_bytes: Optional[str] = None
    status: Optional[str] = None
    storage_class: Optional[str] = None
    storage_etag: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    version_id: Optional[str] = None
