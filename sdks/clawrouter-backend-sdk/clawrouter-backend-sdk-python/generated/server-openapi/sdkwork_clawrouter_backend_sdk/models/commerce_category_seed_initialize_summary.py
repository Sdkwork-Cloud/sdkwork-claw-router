from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCategorySeedInitializeSummary:
    """Commerce category seed initialize summary schema exposed by Claw Router."""
    config_key: str
    dataset: str
    install_default_enabled: bool
    requested: int
    skipped: int
    target_table: str
    upserted: int
