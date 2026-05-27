from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UploadPresignGrantRecord:
    """Upload presign grant record schema exposed by Claw Router."""
    bucket_id: Optional[str] = None
    canonical_headers: Optional[Dict[str, str]] = None
    consumed_at: Optional[str] = None
    created_at: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    method: Optional[str] = None
    object_key: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    signed_headers: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    upload_part_id: Optional[str] = None
    upload_session_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
