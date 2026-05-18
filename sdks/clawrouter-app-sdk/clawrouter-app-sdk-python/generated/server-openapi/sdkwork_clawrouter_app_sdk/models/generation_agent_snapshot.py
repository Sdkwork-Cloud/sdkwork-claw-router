from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationAgentSnapshot:
    """Generation agent snapshot schema exposed by Claw Router."""
    id: str
    name: str
    version_id: str
    model: Optional[str] = None
