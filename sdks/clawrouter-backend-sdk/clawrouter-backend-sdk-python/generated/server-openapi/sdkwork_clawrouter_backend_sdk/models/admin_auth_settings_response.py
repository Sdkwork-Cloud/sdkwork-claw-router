from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_auth_verification_policy import AdminAuthVerificationPolicy


@dataclass
class AdminAuthSettingsResponse:
    """Admin auth settings response schema exposed by Claw Router."""
    left_rail_mode: str
    login_methods: List[str]
    oauth_login_enabled: bool
    oauth_providers: List[str]
    qr_login_enabled: bool
    recovery_methods: List[str]
    register_methods: List[str]
    verification_policy: AdminAuthVerificationPolicy
    oauth_region: Optional[str] = None
