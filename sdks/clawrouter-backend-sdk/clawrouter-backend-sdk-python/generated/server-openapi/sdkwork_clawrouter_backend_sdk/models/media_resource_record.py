from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MediaResourceRecord:
    """Media resource record schema exposed by Claw Router."""
    access_json: Optional[Dict[str, str]] = None
    ai_json: Optional[Dict[str, str]] = None
    alt_text: Optional[str] = None
    bucket_id: Optional[str] = None
    checksum_json: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    duration_seconds: Optional[str] = None
    file_name: Optional[str] = None
    height: Optional[int] = None
    id: Optional[str] = None
    kind: Optional[str] = None
    media_resource_no: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mime_type: Optional[str] = None
    object_blob_id: Optional[str] = None
    object_key: Optional[str] = None
    object_version: Optional[str] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    renditions_json: Optional[Dict[str, str]] = None
    size_bytes: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uri: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    width: Optional[int] = None
