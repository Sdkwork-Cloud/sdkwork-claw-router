from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_author import ForumAuthor
    from .media_resource import MediaResource


@dataclass
class ForumFeedItem:
    """Forum feed item schema exposed by Claw Router."""
    author: ForumAuthor
    category_id: str
    comment_count: str
    content: str
    content_type: str
    cover: MediaResource
    created_at: str
    id: str
    is_collected: bool
    is_hot: bool
    is_liked: bool
    is_recommended: bool
    is_top: bool
    like_count: str
    share_count: str
    summary: str
    tags: List[str]
    title: str
    updated_at: str
    view_count: str
