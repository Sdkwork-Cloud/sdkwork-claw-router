from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_comment_item import ForumCommentItem


@dataclass
class CommentsLikesCreateResult:
    """Comments likes create result schema exposed by Claw Router."""
    code: str
    data: Optional[ForumCommentItem] = None
    message: Optional[str] = None
    msg: Optional[str] = None
