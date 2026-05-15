from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_community_link import ForumCommunityLink
    from .forum_overview_source import ForumOverviewSource
    from .forum_overview_stats import ForumOverviewStats


@dataclass
class ForumOverviewResponse:
    """Forum overview response schema exposed by Claw Router."""
    community_links: List[ForumCommunityLink]
    source: ForumOverviewSource
    stats: ForumOverviewStats
