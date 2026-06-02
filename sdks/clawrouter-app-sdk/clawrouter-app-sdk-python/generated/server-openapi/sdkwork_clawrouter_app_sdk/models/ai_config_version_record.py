from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiConfigVersionRecord:
    """Ai config version record schema exposed by Claw Router."""
    config_scope: str
    config_version: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    changed_object_id: Optional[str] = None
    changed_object_type: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    published_at: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
