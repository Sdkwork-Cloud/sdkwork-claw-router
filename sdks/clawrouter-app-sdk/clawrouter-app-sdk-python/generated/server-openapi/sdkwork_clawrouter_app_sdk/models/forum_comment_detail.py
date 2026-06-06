from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_author import ForumAuthor
    from .forum_comment_item import ForumCommentItem


@dataclass
class ForumCommentDetail:
    """Forum comment detail schema exposed by Claw Router."""
    author: ForumAuthor
    comment_id: str
    content: str
    content_id: str
    content_type: str
    created_at: str
    device_info: str
    ip_address: str
    is_top: bool
    likes: str
    replies: List[ForumCommentItem]
    reply_count: str
    status: str
    updated_at: str
    user_id: str
    parent_id: Optional[str] = None
