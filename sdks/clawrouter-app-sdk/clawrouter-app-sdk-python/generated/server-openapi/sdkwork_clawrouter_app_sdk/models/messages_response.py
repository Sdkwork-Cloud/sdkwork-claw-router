from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .message import Message


@dataclass
class MessagesResponse:
    """Messages response schema exposed by Claw Router."""
    items: List[Message]
