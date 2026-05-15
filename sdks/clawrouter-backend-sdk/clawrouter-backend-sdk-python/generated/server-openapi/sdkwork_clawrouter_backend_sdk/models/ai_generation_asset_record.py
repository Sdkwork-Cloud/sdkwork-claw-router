from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiGenerationAssetRecord:
    """Ai generation asset record schema exposed by Claw Router."""
    active_index: Optional[int] = None
    asset_type: Optional[str] = None
    asset_url: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    download_count: Optional[str] = None
    duration_seconds: Optional[str] = None
    expire_at: Optional[str] = None
    favorite: Optional[bool] = None
    file_size: Optional[str] = None
    height: Optional[int] = None
    id: Optional[str] = None
    job_id: Optional[str] = None
    last_accessed_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mime_type: Optional[str] = None
    model_snapshot: Optional[str] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    parameter_snapshot: Optional[Dict[str, str]] = None
    prompt_snapshot: Optional[str] = None
    share_token_hash: Optional[str] = None
    shared: Optional[bool] = None
    status: Optional[str] = None
    storage_key: Optional[str] = None
    storage_provider: Optional[str] = None
    tenant_id: Optional[str] = None
    thumbnail_url: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
    width: Optional[int] = None
