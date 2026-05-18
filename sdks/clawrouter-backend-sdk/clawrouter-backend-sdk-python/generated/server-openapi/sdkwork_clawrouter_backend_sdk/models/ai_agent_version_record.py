from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentVersionRecord:
    """Ai agent version record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    config_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    mcp_policy: Optional[Dict[str, str]] = None
    memory_policy: Optional[Dict[str, str]] = None
    metadata: Optional[Dict[str, str]] = None
    model_policy: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    published_by: Optional[str] = None
    release_status: Optional[str] = None
    runtime_policy: Optional[Dict[str, str]] = None
    skill_policy: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    system_prompt: Optional[str] = None
    tenant_id: Optional[str] = None
    tool_policy: Optional[Dict[str, str]] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    version_no: Optional[str] = None
