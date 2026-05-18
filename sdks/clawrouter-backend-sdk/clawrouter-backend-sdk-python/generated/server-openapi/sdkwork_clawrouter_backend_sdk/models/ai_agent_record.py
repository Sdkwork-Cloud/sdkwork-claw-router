from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentRecord:
    """Ai agent record schema exposed by Claw Router."""
    agent_code: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_version_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    description: Optional[str] = None
    governance_status: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    owner_user_id: Optional[str] = None
    published_at: Optional[str] = None
    published_by: Optional[str] = None
    status: Optional[str] = None
    template_source: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
