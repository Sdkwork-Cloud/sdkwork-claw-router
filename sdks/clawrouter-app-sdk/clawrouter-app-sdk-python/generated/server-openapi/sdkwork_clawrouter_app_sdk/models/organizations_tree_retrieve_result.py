from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_tree_response import IamOrganizationTreeResponse


@dataclass
class OrganizationsTreeRetrieveResult:
    """Organizations tree retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[IamOrganizationTreeResponse] = None
    msg: Optional[str] = None
