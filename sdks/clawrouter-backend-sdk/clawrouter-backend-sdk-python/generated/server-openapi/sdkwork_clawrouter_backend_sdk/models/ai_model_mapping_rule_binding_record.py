from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelMappingRuleBindingRecord:
    """Ai model mapping rule binding record schema exposed by Claw Router."""
    binding_type: str
    enabled: bool
    organization_id: str
    rule_id: str
    sort_order: int
    status: str
    tenant_id: str
    uuid: str
    binding_code: Optional[str] = None
    binding_id: Optional[str] = None
    binding_name_snapshot: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    rule_uuid: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
