from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminUserItem:
    """Persisted admin user snapshot returned by the backend."""
    balance: str
    created_at: str
    email: str
    group: str
    id: str
    last_active: str
    last_used: str
    role: str
    status: str
    username: str
