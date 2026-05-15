from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SkillPackageItem:
    """Skill package item schema exposed by Claw Router."""
    artifact_ref: str
    artifact_size_bytes: int
    frameworks: List[str]
    id: str
    license_name: str
    published_at: str
    version: str
