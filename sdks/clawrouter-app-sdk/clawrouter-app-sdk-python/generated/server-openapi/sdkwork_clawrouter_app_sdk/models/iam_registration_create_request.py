from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamRegistrationCreateRequest:
    """Iam registration create request schema exposed by Claw Router."""
    password: str
    username: str
    verification_code: str
    channel: Optional[str] = None
    confirm_password: Optional[str] = None
    email: Optional[str] = None
    organization_code: Optional[str] = None
    phone: Optional[str] = None
    tenant_code: Optional[str] = None
