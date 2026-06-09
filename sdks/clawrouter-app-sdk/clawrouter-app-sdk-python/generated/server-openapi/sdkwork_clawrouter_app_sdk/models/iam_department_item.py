from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamDepartmentItem:
    """Iam department item schema exposed by Claw Router."""
    code: str
    created_at: str
    id: str
    name: str
    organization_id: str
    path: str
    status: str
    tenant_id: str
    updated_at: str
    parent_department_id: Optional[str] = None
