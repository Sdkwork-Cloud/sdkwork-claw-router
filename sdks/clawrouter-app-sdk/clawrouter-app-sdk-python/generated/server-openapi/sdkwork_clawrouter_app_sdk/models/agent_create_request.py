from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentCreateRequest:
    """Agent create request schema exposed by Claw Router."""
    name: str
    code: Optional[str] = None
    description: Optional[str] = None
    mcp_policy: Optional[Dict[str, str]] = None
    memory_policy: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    runtime_policy: Optional[Dict[str, str]] = None
    skill_policy: Optional[Dict[str, str]] = None
    system_prompt: Optional[str] = None
    tool_policy: Optional[Dict[str, str]] = None
