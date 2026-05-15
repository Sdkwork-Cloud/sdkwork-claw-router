from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamUserIdentityRecord:
    """Iam user identity record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    email: Optional[str] = None
    id: Optional[str] = None
    provider: Optional[str] = None
    subject: Optional[str] = None
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
