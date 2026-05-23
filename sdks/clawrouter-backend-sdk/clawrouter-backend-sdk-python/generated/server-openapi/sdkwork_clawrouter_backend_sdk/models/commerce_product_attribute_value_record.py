from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductAttributeValueRecord:
    """Commerce product attribute value record schema exposed by Claw Router."""
    attribute_id: str
    created_at: str
    display_value: str
    status: str
    tenant_id: str
    updated_at: str
    value_code: str
    organization_id: Optional[str] = None
