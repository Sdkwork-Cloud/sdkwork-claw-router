from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingCollectionResponse:
    """Messaging collection response schema exposed by Claw Router."""
    items: List[Dict[str, str]]
    page: int
    page_size: int
    total: int
