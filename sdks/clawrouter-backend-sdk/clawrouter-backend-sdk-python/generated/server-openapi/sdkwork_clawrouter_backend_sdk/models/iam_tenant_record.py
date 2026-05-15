from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamTenantRecord:
    """Iam tenant record schema exposed by Claw Router."""
    code: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    name: Optional[str] = None
    status: Optional[str] = None
    updated_at: Optional[str] = None
