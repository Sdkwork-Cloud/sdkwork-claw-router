from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSkuAttributeItem:
    """Commerce product sku attribute item schema exposed by Claw Router."""
    attribute_id: str
    attribute_name: str
    attribute_value_id: Optional[str] = None
    custom_value: Optional[str] = None
    display_value: Optional[str] = None
    value_code: Optional[str] = None
