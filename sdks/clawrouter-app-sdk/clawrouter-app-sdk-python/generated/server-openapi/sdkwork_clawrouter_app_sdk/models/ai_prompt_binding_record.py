from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPromptBindingRecord:
    """Ai prompt binding record schema exposed by Claw Router."""
    binding_role: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    enabled: Optional[bool] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    policy_json: Optional[Dict[str, str]] = None
    priority: Optional[int] = None
    prompt_id: Optional[str] = None
    prompt_version_id: Optional[str] = None
    snapshot_json: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
