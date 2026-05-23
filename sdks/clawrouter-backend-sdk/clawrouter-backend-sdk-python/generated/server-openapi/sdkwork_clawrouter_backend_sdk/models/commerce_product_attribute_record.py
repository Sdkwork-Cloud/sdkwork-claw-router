from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductAttributeRecord:
    """Commerce product attribute record schema exposed by Claw Router."""
    attribute_no: str
    created_at: str
    filterable: bool
    name: str
    required: bool
    scope: str
    searchable: bool
    status: str
    tenant_id: str
    updated_at: str
    value_type: str
    organization_id: Optional[str] = None
