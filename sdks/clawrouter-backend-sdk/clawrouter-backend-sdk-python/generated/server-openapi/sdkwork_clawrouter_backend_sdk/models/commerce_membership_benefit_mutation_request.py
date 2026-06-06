from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CommerceMembershipBenefitMutationRequest:
    """Commerce membership benefit mutation request schema exposed by Claw Router."""
    name: str
    benefit_key: Optional[str] = None
    claimed: Optional[bool] = None
    description: Optional[str] = None
    icon: Optional[MediaResource] = None
    id: Optional[str] = None
    type: Optional[str] = None
    usage_limit: Optional[str] = None
    used_count: Optional[str] = None
