from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRuntimeAssemblySummary:
    """Commerce payment runtime assembly summary schema exposed by Claw Router."""
    failed: int
    failed_provider_codes: List[str]
    registered: int
    registered_provider_codes: List[str]
    skipped: int
    skipped_provider_codes: List[str]
    total: int
