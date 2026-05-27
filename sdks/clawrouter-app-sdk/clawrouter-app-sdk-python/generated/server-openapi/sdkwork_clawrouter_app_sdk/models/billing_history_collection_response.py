from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class BillingHistoryCollectionResponse:
    """Billing history collection response schema exposed by Claw Router."""
    items: List[Dict[str, Any]]
