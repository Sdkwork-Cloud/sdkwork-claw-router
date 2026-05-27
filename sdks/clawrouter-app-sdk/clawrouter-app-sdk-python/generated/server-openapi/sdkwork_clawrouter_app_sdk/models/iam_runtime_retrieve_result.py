from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .auth_runtime_settings_response import AuthRuntimeSettingsResponse


@dataclass
class IamRuntimeRetrieveResult:
    """Iam runtime retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AuthRuntimeSettingsResponse] = None
    msg: Optional[str] = None
