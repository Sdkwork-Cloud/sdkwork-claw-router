from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiResourceGroupItemRecord:
    """Ai resource group item record schema exposed by Claw Router."""
    item_type: str
    organization_id: str
    resource_group_id: str
    status: str
    tenant_id: str
    uuid: str
    child_resource_group_code: Optional[str] = None
    child_resource_group_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    item_role: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    resource_code: Optional[str] = None
    resource_group_code: Optional[str] = None
    resource_id: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
