from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CourseOverviewSource:
    """Course overview source schema exposed by Claw Router."""
    observed_at: str
    source_description: str
    source_label: str
    source_tables: List[str]
