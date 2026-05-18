from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamMfaFactorRecord:
    """Iam mfa factor record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    factor_type: Optional[str] = None
    id: Optional[str] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
