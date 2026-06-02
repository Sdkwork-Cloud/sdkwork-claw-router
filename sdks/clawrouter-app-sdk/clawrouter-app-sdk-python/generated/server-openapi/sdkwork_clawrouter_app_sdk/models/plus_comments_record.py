from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusCommentsRecord:
    """Plus comments record schema exposed by Claw Router."""
    author: Optional[Dict[str, str]] = None
    content: Optional[str] = None
    content_id: Optional[str] = None
    content_type: Optional[int] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    device_info: Optional[str] = None
    id: Optional[str] = None
    ip_address: Optional[str] = None
    is_top: Optional[bool] = None
    likes: Optional[int] = None
    organization_id: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    reply_count: Optional[int] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
