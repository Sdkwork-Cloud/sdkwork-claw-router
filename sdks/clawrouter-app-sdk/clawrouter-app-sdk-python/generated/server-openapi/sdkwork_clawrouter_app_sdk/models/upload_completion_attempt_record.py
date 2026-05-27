from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UploadCompletionAttemptRecord:
    """Upload completion attempt record schema exposed by Claw Router."""
    attempt_no: Optional[int] = None
    completion_status: Optional[str] = None
    created_at: Optional[str] = None
    error_code: Optional[str] = None
    error_message_masked: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    object_blob_id: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_request_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    upload_session_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
