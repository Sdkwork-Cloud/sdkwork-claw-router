from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamDepartmentAssignmentItem:
    """Iam department assignment item schema exposed by Claw Router."""
    assignment_kind: str
    created_at: str
    department_id: str
    effective_from: str
    effective_to: str
    id: str
    is_primary: bool
    organization_id: str
    organization_membership_id: str
    status: str
    tenant_id: str
    updated_at: str
    user_id: str
