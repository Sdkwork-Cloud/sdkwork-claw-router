from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_app_config_standard import AdminAppConfigStandard
    from .admin_app_portal_config import AdminAppPortalConfig


@dataclass
class AdminAppConfig:
    """Admin app config schema exposed by Claw Router."""
    standard: AdminAppConfigStandard
    portal: Optional[AdminAppPortalConfig] = None
