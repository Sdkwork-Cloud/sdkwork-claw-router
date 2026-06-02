from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UploadSessionRecord:
    """Upload session record schema exposed by Claw Router."""
    aborted_at: Optional[str] = None
    bucket_id: Optional[str] = None
    completed_at: Optional[str] = None
    completed_bytes: Optional[str] = None
    completed_part_count: Optional[int] = None
    content_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    expected_sha256: Optional[str] = None
    expected_size_bytes: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    logical_scope: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    object_key: Optional[str] = None
    organization_id: Optional[str] = None
    original_filename: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    part_count: Optional[int] = None
    part_size_bytes: Optional[str] = None
    provider_id: Optional[str] = None
    request_id: Optional[str] = None
    s3_upload_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    upload_mode: Optional[str] = None
    upload_session_no: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
