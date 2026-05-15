from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_comment_statistics import ForumCommentStatistics


@dataclass
class CommentsStatisticsListResult:
    """Comments statistics list result schema exposed by Claw Router."""
    code: str
    data: Optional[ForumCommentStatistics] = None
    message: Optional[str] = None
    msg: Optional[str] = None
