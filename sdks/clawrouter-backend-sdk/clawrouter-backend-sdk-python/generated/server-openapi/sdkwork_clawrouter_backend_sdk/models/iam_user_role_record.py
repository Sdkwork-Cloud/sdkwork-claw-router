from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamUserRoleRecord:
    """Iam user role record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    role_id: Optional[str] = None
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
