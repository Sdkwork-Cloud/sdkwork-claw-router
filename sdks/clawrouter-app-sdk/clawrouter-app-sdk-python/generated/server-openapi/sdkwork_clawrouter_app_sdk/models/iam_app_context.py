from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamAppContext:
    """Iam app context schema exposed by Claw Router."""
    app_id: str
    auth_level: str
    data_scope: List[str]
    deployment_mode: str
    environment: str
    permission_scope: List[str]
    session_id: str
    tenant_id: str
    user_id: str
    organization_id: Optional[str] = None
