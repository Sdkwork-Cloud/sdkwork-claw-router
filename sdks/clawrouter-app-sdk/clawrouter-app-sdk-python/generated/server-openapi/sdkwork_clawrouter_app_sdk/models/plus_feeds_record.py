from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusFeedsRecord:
    """Plus feeds record schema exposed by Claw Router."""
    author: Optional[Dict[str, str]] = None
    category_id: Optional[str] = None
    comment_count: Optional[str] = None
    content_id: Optional[str] = None
    content_type: Optional[int] = None
    cover_resources: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    favorite_count: Optional[str] = None
    id: Optional[str] = None
    is_hot: Optional[bool] = None
    is_recommended: Optional[bool] = None
    is_top: Optional[bool] = None
    like_count: Optional[str] = None
    organization_id: Optional[str] = None
    publish_time: Optional[str] = None
    resource_list: Optional[Dict[str, str]] = None
    share_count: Optional[str] = None
    sort_order: Optional[int] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    status: Optional[int] = None
    summary: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
    view_count: Optional[str] = None
