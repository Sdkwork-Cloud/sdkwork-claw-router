from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationAgentRunSnapshot:
    """Generation agent run snapshot schema exposed by Claw Router."""
    id: str
    request_id: str
    source: str
    status: str
