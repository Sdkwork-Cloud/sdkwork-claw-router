from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentAnnouncementRecord:
    """Content announcement record schema exposed by Claw Router."""
    announcement_type: Optional[str] = None
    audience_filter: Optional[Dict[str, str]] = None
    content: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    pinned: Optional[bool] = None
    published_at: Optional[str] = None
    status: Optional[str] = None
    target_scope: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
