from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusFavoriteRecord:
    """Plus favorite record schema exposed by Claw Router."""
    content_id: Optional[str] = None
    content_type: Optional[int] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    folder_id: Optional[str] = None
    id: Optional[str] = None
    image: Optional[Dict[str, str]] = None
    is_private: Optional[bool] = None
    last_viewed_at: Optional[str] = None
    organization_id: Optional[str] = None
    remark: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    tags: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
    view_count: Optional[int] = None
