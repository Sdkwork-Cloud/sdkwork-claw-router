from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPositionAssignmentItem:
    """Iam position assignment item schema exposed by Claw Router."""
    created_at: str
    department_assignment_id: str
    effective_from: str
    effective_to: str
    id: str
    is_primary: bool
    organization_id: str
    position_id: str
    status: str
    tenant_id: str
    updated_at: str
    user_id: str
