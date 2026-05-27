from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductMediaRecord:
    """Commerce product media record schema exposed by Claw Router."""
    created_at: str
    media_type: str
    owner_id: str
    owner_type: str
    status: str
    tenant_id: str
    updated_at: str
    url: str
    alt_text: Optional[str] = None
    organization_id: Optional[str] = None
