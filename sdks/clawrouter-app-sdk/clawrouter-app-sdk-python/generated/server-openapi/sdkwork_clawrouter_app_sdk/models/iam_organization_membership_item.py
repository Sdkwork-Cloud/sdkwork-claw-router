from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamOrganizationMembershipItem:
    """Iam organization membership item schema exposed by Claw Router."""
    id: str
    joined_at: str
    left_at: str
    organization_id: str
    remark: str
    role_code: str
    status: str
    tenant_id: str
    user_id: str
