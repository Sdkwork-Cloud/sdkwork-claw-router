from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_membership_list_response import IamOrganizationMembershipListResponse


@dataclass
class OrganizationMembershipsListResult:
    """Organization memberships list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamOrganizationMembershipListResponse] = None
    msg: Optional[str] = None
