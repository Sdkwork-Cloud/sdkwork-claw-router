from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSiteSettingsResponse:
    """Admin site settings response schema exposed by Claw Router."""
    accent_color: str
    brand_color: str
    custom_css: str
    description: str
    docs_url: str
    favicon_url: str
    footer_copyright: str
    icon_url: str
    icp_record_number: str
    icp_record_url: str
    logo_url: str
    police_record_number: str
    police_record_url: str
    privacy_url: str
    seo_description: str
    seo_title: str
    short_name: str
    site_name: str
    support_url: str
    terms_url: str
