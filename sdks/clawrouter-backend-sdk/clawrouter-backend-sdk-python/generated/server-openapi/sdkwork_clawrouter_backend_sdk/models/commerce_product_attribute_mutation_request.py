from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductAttributeMutationRequest:
    """Commerce product attribute mutation request schema exposed by Claw Router."""
    attribute_no: str
    filterable: bool
    name: str
    required: bool
    scope: str
    searchable: bool
    status: str
    value_type: str
