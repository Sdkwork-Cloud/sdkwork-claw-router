from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentForumCommentRecord:
    """Content forum comment record schema exposed by Claw Router."""
    author_id: Optional[str] = None
    author_snapshot: Optional[Dict[str, str]] = None
    body: Optional[str] = None
    course_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    like_count: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    parent_id: Optional[str] = None
    post_id: Optional[str] = None
    root_id: Optional[str] = None
    status: Optional[str] = None
    target_id: Optional[str] = None
    target_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
