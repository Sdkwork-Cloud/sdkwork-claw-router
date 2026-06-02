from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPromptRecord:
    """Ai prompt record schema exposed by Claw Router."""
    category_code: Optional[str] = None
    category_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deprecated_at: Optional[str] = None
    description: Optional[str] = None
    id: Optional[str] = None
    latest_version_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    prompt_key: Optional[str] = None
    prompt_type: Optional[str] = None
    published_at: Optional[str] = None
    published_version_id: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
