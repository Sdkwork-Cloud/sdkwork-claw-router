from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_mcp_tool_item import AdminMcpToolItem


@dataclass
class AdminMcpDiscoveryResponse:
    """Admin mcp discovery response schema exposed by Claw Router."""
    checked_at: str
    discovered_count: int
    server_id: int
    tools: List[AdminMcpToolItem]
