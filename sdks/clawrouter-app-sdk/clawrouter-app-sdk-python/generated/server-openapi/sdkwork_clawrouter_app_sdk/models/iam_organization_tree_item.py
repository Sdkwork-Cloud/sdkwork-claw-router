from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamOrganizationTreeItem:
    """Iam organization tree item schema exposed by Claw Router."""
    children: List[Dict[str, str]]
    code: str
    created_at: str
    id: str
    name: str
    path: str
    status: str
    tenant_id: str
    updated_at: str
    parent_id: Optional[str] = None
