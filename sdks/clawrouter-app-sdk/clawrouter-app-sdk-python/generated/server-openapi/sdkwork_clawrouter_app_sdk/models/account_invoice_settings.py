from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AccountInvoiceSettings:
    """Account invoice settings schema exposed by Claw Router."""
    invoice_type: str
    org_full: str
    payment_method: str
    tax_id: str
