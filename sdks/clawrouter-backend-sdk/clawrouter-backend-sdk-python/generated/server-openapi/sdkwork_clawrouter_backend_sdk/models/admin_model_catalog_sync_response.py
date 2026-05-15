from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_ai_model_item import AdminAiModelItem
    from .admin_model_vendor_item import AdminModelVendorItem


@dataclass
class AdminModelCatalogSyncResponse:
    """Admin model catalog sync response schema exposed by Claw Router."""
    accepted_count: int
    capability_count: int
    catalog_version: str
    dry_run: bool
    family_count: int
    meter_count: int
    mode: str
    model_count: int
    models: List[AdminAiModelItem]
    price_count: int
    ranking_count: int
    source: str
    source_hash: str
    synced: bool
    vendor_codes: List[str]
    vendor_count: int
    vendors: List[AdminModelVendorItem]
    catalog_root: Optional[str] = None
    requested_catalog_version: Optional[str] = None
    snapshot_id: Optional[str] = None
    sync_run_id: Optional[str] = None
