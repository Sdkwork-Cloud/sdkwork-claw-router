from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseSectionMutationRequest:
    """Admin course section mutation request schema exposed by Claw Router."""
    description: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    section_no: Optional[str] = None
    sort_order: Optional[str] = None
    status: Optional[str] = None
    title: Optional[str] = None
