from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInvoiceTitleRecord:
    """Commerce invoice title record schema exposed by Claw Router."""
    created_at: str
    name: str
    owner_user_id: str
    tenant_id: str
    title_type: str
    updated_at: str
    tax_no: Optional[str] = None
