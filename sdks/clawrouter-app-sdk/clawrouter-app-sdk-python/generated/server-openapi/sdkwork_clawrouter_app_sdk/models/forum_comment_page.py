from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_comment_item import ForumCommentItem


@dataclass
class ForumCommentPage:
    """Forum comment page schema exposed by Claw Router."""
    content: List[ForumCommentItem]
    items: List[ForumCommentItem]
    page: str
    size: str
    total_elements: str
