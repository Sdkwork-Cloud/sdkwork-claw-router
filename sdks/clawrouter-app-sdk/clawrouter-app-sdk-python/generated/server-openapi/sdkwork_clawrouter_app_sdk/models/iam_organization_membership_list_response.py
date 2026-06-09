from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_membership_item import IamOrganizationMembershipItem


@dataclass
class IamOrganizationMembershipListResponse:
    """Iam organization membership list response schema exposed by Claw Router."""
    items: List[IamOrganizationMembershipItem]
