from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelMappingRuleRecord:
    """Ai model mapping rule record schema exposed by Claw Router."""
    enabled: bool
    mapping_mode: str
    match_type: str
    organization_id: str
    source_vendor_code: str
    status: str
    target_vendor_code: str
    tenant_id: str
    uuid: str
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    source_vendor_id: Optional[str] = None
    target_vendor_id: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
