from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class IamUserResponse:
    """Iam user response schema exposed by Claw Router."""
    avatar: MediaResource
    display_name: str
    email: str
    id: str
    is_verified: bool
    language: str
    last_login: str
    last_login_ip: str
    password_last_changed: str
    phone: str
    registered_at: str
    status: str
    third_party_bound: str
    two_factor_enabled: bool
    username: str
