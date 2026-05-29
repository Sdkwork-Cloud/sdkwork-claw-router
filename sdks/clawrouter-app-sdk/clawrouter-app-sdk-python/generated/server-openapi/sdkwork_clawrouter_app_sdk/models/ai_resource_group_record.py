from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiResourceGroupRecord:
    """Ai resource group record schema exposed by Claw Router."""
    group_code: str
    group_name: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    group_type: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    selection_mode: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
