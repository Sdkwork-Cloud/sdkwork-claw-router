from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminPromptBindingItem:
    """Admin prompt binding item schema exposed by Claw Router."""
    binding_role: str
    created_at: str
    enabled: bool
    id: int
    organization_id: int
    owner_id: int
    owner_type: str
    policy_json: Dict[str, str]
    priority: int
    prompt_id: int
    snapshot_json: Dict[str, str]
    tenant_id: int
    updated_at: str
    uuid: str
    prompt_version_id: Optional[int] = None
