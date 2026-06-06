from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_author import ForumAuthor


@dataclass
class ForumCommentItem:
    """Forum comment item schema exposed by Claw Router."""
    author: ForumAuthor
    comment_id: str
    content: str
    content_id: str
    content_type: str
    created_at: str
    is_top: bool
    likes: str
    reply_count: str
    status: str
    user_id: str
    parent_id: Optional[str] = None
