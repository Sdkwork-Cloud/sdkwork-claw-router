from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AccountSecuritySummary:
    """Account security summary schema exposed by Claw Router."""
    ip_whitelist_count: int
    mfa_enabled: bool
    qps_limit: int
