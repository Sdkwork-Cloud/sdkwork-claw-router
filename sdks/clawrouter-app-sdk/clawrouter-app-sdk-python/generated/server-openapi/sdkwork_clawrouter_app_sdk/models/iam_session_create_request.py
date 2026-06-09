from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamSessionCreateRequest:
    """Iam session create request schema exposed by Claw Router."""
    code: Optional[str] = None
    device_id: Optional[str] = None
    device_name: Optional[str] = None
    device_type: Optional[str] = None
    email: Optional[str] = None
    grant_type: Optional[str] = None
    name: Optional[str] = None
    organization_code: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    tenant_code: Optional[str] = None
    username: Optional[str] = None
