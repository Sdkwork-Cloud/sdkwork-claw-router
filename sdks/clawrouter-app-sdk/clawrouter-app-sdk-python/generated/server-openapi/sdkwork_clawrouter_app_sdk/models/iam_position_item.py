from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamPositionItem:
    """Iam position item schema exposed by Claw Router."""
    code: str
    created_at: str
    department_id: str
    id: str
    name: str
    organization_id: str
    position_kind: str
    rank_level: str
    status: str
    tenant_id: str
    updated_at: str
