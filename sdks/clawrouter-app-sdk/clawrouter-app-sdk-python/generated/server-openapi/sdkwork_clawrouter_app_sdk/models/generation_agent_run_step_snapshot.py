from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationAgentRunStepSnapshot:
    """Generation agent run step snapshot schema exposed by Claw Router."""
    id: str
    index: int
    status: str
    title: str
    type: str
