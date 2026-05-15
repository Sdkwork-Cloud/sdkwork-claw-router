from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamSecurityEventRecord:
    """Iam security event record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    detail_json: Optional[Dict[str, str]] = None
    event_type: Optional[str] = None
    id: Optional[str] = None
    session_id: Optional[str] = None
    severity: Optional[str] = None
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
