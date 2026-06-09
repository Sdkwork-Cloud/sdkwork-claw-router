from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_list_response import IamOrganizationListResponse


@dataclass
class OrganizationsListResult:
    """Organizations list result schema exposed by Claw Router."""
    code: str
    data: Optional[IamOrganizationListResponse] = None
    msg: Optional[str] = None
