from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamRoleBindingItem:
    """Iam role binding item schema exposed by Claw Router."""
    condition_json: str
    created_at: str
    effect: str
    id: str
    principal_id: str
    principal_kind: str
    role_id: str
    scope_id: str
    scope_kind: str
    status: str
    tenant_id: str
    updated_at: str
