from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamApiKeyRecord:
    """Iam api key record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    key_hash: Optional[str] = None
    name: Optional[str] = None
    permission_scope_json: Optional[Dict[str, str]] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
