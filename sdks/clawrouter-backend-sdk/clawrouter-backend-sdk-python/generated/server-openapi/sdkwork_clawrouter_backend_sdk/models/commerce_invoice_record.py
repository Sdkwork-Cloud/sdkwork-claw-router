from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class CommerceInvoiceRecord:
    """Commerce invoice record schema exposed by Claw Router."""
    created_at: str
    order_id: str
    owner_user_id: str
    payment_id: str
    status: str
    tenant_id: str
    title_id: str
    updated_at: str
    document: Optional[MediaResource] = None
    id: Optional[str] = None
    invoice_code: Optional[str] = None
    invoice_no: Optional[str] = None
    issued_at: Optional[str] = None
    organization_id: Optional[str] = None
