from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationAgentRunCreateRequest:
    """Generation agent run create request schema exposed by Claw Router."""
    prompt: str
    selected_model: Optional[str] = None
