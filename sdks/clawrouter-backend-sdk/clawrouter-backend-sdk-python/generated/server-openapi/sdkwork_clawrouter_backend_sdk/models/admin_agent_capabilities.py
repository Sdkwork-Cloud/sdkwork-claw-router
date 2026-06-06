from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAgentCapabilities:
    """Admin agent capabilities schema exposed by Claw Router."""
    mcp_server_count: str
    memory_enabled: bool
    skill_binding_count: str
