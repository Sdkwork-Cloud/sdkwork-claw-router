from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingSenderIdentityRecord:
    """Messaging sender identity record schema exposed by Claw Router."""
    country_code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    display_name: Optional[str] = None
    domain_name: Optional[str] = None
    from_email: Optional[str] = None
    from_name: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    rejection_reason: Optional[str] = None
    reply_to: Optional[str] = None
    sender_id: Optional[str] = None
    sign_name: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    verified_at: Optional[str] = None
    version: Optional[str] = None
