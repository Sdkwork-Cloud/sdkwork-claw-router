from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamRolePermissionRecord:
    """Iam role permission record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    id: Optional[str] = None
    permission_id: Optional[str] = None
    role_id: Optional[str] = None
    tenant_id: Optional[str] = None
