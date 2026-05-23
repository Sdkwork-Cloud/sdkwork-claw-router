from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AgentSessionCreateRequest:
    """Agent session create request schema exposed by Claw Router."""
    agent_version_id: Optional[str] = None
    approval_policy: Optional[str] = None
    chat_conversation_id: Optional[str] = None
    cwd: Optional[str] = None
    default_model: Optional[str] = None
    memory_space_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    permission_mode: Optional[str] = None
    runtime: Optional[str] = None
    sandbox_policy: Optional[str] = None
    session_kind: Optional[str] = None
    source_surface: Optional[str] = None
    title: Optional[str] = None
