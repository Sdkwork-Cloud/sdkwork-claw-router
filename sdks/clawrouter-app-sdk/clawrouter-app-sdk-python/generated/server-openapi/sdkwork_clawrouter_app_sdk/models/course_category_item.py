from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseCategoryItem:
    """Course category item schema exposed by Claw Router."""
    code: str
    course_count: str
    description: str
    icon_key: str
    id: str
    label: str
    name: str
    sort_weight: str
