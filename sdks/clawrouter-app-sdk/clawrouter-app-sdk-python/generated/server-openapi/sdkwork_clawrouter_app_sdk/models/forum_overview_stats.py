from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ForumOverviewStats:
    """Forum overview stats schema exposed by Claw Router."""
    member_count: str
    online_members: str
    total_comments: str
    total_posts: str
