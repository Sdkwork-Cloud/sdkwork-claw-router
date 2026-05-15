from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamOrganizationMemberRecord:
    """Iam organization member record schema exposed by Claw Router."""
    id: Optional[str] = None
    joined_at: Optional[str] = None
    organization_id: Optional[str] = None
    role_code: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
