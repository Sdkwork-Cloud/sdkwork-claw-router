from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelMappingRuleItemRecord:
    """Ai model mapping rule item record schema exposed by Claw Router."""
    enabled: bool
    organization_id: str
    rule_id: str
    sort_order: int
    source_model: str
    status: str
    target_model: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    rule_uuid: Optional[str] = None
    source_catalog_key: Optional[str] = None
    target_catalog_key: Optional[str] = None
    target_provider_model: Optional[str] = None
    target_provider_native_model: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
