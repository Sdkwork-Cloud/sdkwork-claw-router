from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumCreateFeedRequest:
    """Forum create feed request schema exposed by Claw Router."""
    content: str
    category_id: Optional[int] = None
    images: Optional[List[str]] = None
    source: Optional[str] = None
    source_url: Optional[str] = None
    tags: Optional[List[str]] = None
    title: Optional[str] = None
