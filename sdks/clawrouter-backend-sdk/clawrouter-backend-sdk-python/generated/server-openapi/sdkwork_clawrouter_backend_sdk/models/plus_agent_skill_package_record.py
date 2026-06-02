from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class PlusAgentSkillPackageRecord:
    """Plus agent skill package record schema exposed by Claw Router."""
    category_id: Optional[str] = None
    cover: Optional[MediaResource] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    description: Optional[str] = None
    enabled: Optional[bool] = None
    featured: Optional[bool] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    latest_published_at: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    package_key: Optional[str] = None
    sort_weight: Optional[int] = None
    summary: Optional[str] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
