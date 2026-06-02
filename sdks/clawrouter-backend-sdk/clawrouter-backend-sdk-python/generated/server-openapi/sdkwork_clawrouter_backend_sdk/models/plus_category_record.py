from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class PlusCategoryRecord:
    """Plus category record schema exposed by Claw Router."""
    code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    description: Optional[str] = None
    group_name: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    shop_id: Optional[str] = None
    sort_weight: Optional[int] = None
    status: Optional[int] = None
    tags: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    type: Optional[int] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
    visible: Optional[bool] = None
