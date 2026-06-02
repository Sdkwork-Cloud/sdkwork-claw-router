from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusContentVoteRecord:
    """Plus content vote record schema exposed by Claw Router."""
    client_ip: Optional[str] = None
    content_id: Optional[str] = None
    content_type: Optional[int] = None
    created_at: Optional[str] = None
    data_scope: Optional[int] = None
    device_info: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    rating: Optional[str] = None
    source: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    v: Optional[str] = None
