from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumAuthor:
    """Forum author schema exposed by Claw Router."""
    id: int
    is_following: bool
    name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
