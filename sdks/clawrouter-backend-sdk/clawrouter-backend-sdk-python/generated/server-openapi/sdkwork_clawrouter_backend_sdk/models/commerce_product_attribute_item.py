from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductAttributeItem:
    """Commerce product attribute item schema exposed by Claw Router."""
    attribute_no: str
    filterable: bool
    id: str
    name: str
    required: bool
    scope: str
    searchable: bool
    status: str
    value_type: str
