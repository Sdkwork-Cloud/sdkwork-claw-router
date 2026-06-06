from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentVersionItem:
    """Agent version item schema exposed by Claw Router."""
    created_at: str
    id: str
    mcp_policy: Dict[str, str]
    memory_policy: Dict[str, str]
    release_status: str
    runtime_policy: Dict[str, str]
    skill_policy: Dict[str, str]
    system_prompt: str
    tool_policy: Dict[str, str]
    updated_at: str
    version_no: str
    model: Optional[str] = None
