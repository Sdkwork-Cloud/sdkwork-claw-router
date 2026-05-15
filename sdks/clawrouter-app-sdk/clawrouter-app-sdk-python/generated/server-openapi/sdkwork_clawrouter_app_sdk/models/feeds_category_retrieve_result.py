from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_feed_item import ForumFeedItem


@dataclass
class FeedsCategoryRetrieveResult:
    """Feeds category retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[List[ForumFeedItem]] = None
    message: Optional[str] = None
    msg: Optional[str] = None
