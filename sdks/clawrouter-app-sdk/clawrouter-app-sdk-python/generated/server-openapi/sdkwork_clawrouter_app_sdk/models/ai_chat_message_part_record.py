from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatMessagePartRecord:
    """Ai chat message part record schema exposed by Claw Router."""
    asset_id: Optional[str] = None
    created_at: Optional[str] = None
    file_name: Optional[str] = None
    file_size: Optional[str] = None
    id: Optional[str] = None
    item_id: Optional[str] = None
    json_content: Optional[Dict[str, str]] = None
    legal_hold: Optional[bool] = None
    media_resource_id: Optional[str] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mime_type: Optional[str] = None
    object_blob_id: Optional[str] = None
    organization_id: Optional[str] = None
    part_no: Optional[int] = None
    part_type: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_part_id: Optional[str] = None
    request_id: Optional[str] = None
    resource_snapshot: Optional[Dict[str, str]] = None
    retention_until: Optional[str] = None
    sha256: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    text_content: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
