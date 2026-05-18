from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .auth_runtime_settings_response import AuthRuntimeSettingsResponse


@dataclass
class RuntimeSettingsRetrieveResult:
    """Runtime settings retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AuthRuntimeSettingsResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
