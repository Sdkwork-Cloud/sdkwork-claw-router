from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_organization_tree_item import IamOrganizationTreeItem


@dataclass
class IamOrganizationTreeResponse:
    """Iam organization tree response schema exposed by Claw Router."""
    items: List[IamOrganizationTreeItem]
