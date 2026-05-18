from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPermissionRecord:
    """Iam permission record schema exposed by Claw Router."""
    action: Optional[str] = None
    code: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    name: Optional[str] = None
    resource: Optional[str] = None
