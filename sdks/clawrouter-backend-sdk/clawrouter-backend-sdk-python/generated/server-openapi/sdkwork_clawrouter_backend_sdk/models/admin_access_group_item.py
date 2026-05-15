from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_capacity_pair import AdminCapacityPair
    from .admin_count_pair import AdminCountPair
    from .admin_usage_pair import AdminUsagePair


@dataclass
class AdminAccessGroupItem:
    """Persisted access group snapshot returned by the backend."""
    account_count: AdminCountPair
    billing_type: str
    capacity: AdminCapacityPair
    id: str
    name: str
    platform: str
    rate_multiplier: float
    status: str
    type: str
    usage: AdminUsagePair
