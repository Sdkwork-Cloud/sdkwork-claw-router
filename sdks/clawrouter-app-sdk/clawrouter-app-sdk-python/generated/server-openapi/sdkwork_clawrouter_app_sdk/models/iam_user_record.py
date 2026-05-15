from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamUserRecord:
    """Iam user record schema exposed by Claw Router."""
    avatar_url: Optional[str] = None
    created_at: Optional[str] = None
    display_name: Optional[str] = None
    email: Optional[str] = None
    id: Optional[str] = None
    phone: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    username: Optional[str] = None
