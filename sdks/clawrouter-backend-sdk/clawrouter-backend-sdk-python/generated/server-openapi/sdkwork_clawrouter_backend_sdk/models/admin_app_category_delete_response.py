from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAppCategoryDeleteResponse:
    """Admin app category delete response schema exposed by Claw Router."""
    deleted: bool
