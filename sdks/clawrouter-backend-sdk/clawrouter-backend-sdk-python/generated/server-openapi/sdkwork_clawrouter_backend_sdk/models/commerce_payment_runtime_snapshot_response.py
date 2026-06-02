from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_runtime_assembly_event import CommercePaymentRuntimeAssemblyEvent
    from .commerce_payment_runtime_assembly_summary import CommercePaymentRuntimeAssemblySummary


@dataclass
class CommercePaymentRuntimeSnapshotResponse:
    """Commerce payment runtime snapshot response schema exposed by Claw Router."""
    environment: str
    events: List[CommercePaymentRuntimeAssemblyEvent]
    recorded_at: str
    summary: CommercePaymentRuntimeAssemblySummary
