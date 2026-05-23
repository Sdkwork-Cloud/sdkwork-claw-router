from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .forum_overview_response import ForumOverviewResponse


@dataclass
class FeedsOverviewRetrieveResult:
    """Feeds overview retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[ForumOverviewResponse] = None
    msg: Optional[str] = None
