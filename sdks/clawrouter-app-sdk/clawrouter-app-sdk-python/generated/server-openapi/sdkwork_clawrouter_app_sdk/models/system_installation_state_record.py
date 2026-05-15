from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SystemInstallationStateRecord:
    """System installation state record schema exposed by Claw Router."""
    catalog_version: Optional[str] = None
    database_engine: Optional[str] = None
    environment: Optional[str] = None
    id: Optional[str] = None
    installation_id: Optional[str] = None
    installed_at: Optional[str] = None
    last_checked_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    schema_version: Optional[str] = None
    seed_profile: Optional[str] = None
    status: Optional[str] = None
    upgraded_at: Optional[str] = None
