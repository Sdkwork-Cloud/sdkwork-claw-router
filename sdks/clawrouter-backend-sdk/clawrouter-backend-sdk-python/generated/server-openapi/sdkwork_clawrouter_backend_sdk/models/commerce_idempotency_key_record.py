from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceIdempotencyKeyRecord:
    """Commerce idempotency key record schema exposed by Claw Router."""
    created_at: str
    expires_at: str
    idempotency_key: str
    request_hash: str
    scope: str
    status: str
    tenant_id: str
    updated_at: str
    locked_until: Optional[str] = None
    organization_id: Optional[str] = None
    response_json: Optional[str] = None
