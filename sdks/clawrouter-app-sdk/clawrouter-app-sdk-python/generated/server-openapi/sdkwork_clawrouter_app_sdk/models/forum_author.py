from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class ForumAuthor:
    """Forum author schema exposed by Claw Router."""
    id: str
    is_following: bool
    name: str
    avatar: Optional[MediaResource] = None
    bio: Optional[str] = None
