from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentRuntimeAssemblySummary:
    """Commerce payment runtime assembly summary schema exposed by Claw Router."""
    failed: str
    failed_provider_codes: List[str]
    registered: str
    registered_provider_codes: List[str]
    skipped: str
    skipped_provider_codes: List[str]
    total: str
