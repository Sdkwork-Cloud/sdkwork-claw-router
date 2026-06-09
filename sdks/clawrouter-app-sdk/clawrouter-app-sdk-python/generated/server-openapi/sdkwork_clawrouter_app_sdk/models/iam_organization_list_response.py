from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_item import IamOrganizationItem


@dataclass
class IamOrganizationListResponse:
    """Iam organization list response schema exposed by Claw Router."""
    items: List[IamOrganizationItem]
