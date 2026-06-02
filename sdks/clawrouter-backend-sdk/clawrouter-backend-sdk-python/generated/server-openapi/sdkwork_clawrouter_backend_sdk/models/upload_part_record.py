from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UploadPartRecord:
    """Upload part record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    part_etag: Optional[str] = None
    part_number: Optional[int] = None
    part_sha256: Optional[str] = None
    presigned_url_expires_at: Optional[str] = None
    size_bytes: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    upload_session_id: Optional[str] = None
    uploaded_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
