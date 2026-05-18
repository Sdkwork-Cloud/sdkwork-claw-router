from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationAgentUsageFactMetadata:
    """Generation agent usage fact metadata schema exposed by Claw Router."""
    agent_id: str
    agent_version_id: str
    metering_source: str
    run_id: str
    step_id: str
    mcp_server_id: Optional[str] = None
    skill_id: Optional[str] = None
    tool_id: Optional[str] = None
