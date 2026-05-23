from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_comment_detail import ForumCommentDetail


@dataclass
class CommentsRetrieveResult:
    """Comments retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[ForumCommentDetail] = None
    msg: Optional[str] = None
