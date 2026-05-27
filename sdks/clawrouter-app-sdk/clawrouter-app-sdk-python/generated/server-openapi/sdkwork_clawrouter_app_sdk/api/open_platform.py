from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import OpenPlatformQrAuthPasswordCreateRequest, OpenPlatformQrAuthScanCreateRequest, OpenPlatformQrAuthSessionCreateRequest, QrAuthSessionsCreateResult, QrAuthSessionsPasswordsCreateResult, QrAuthSessionsRetrieveResult, QrAuthSessionsScansCreateResult

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"

def serialize_path_parameter(value: Any, spec: Dict[str, Any]) -> str:
    if value is None:
        return ''

    style = str(spec.get('style') or 'simple')
    name = str(spec.get('name') or '')
    explode = bool(spec.get('explode'))
    if isinstance(value, (list, tuple)):
        return serialize_path_array(name, value, style, explode)
    if isinstance(value, dict):
        return serialize_path_object(name, value, style, explode)
    return path_prefix(name, style) + encode_path_value(serialize_path_primitive(value))


def serialize_path_array(name: str, values: Any, style: str, explode: bool) -> str:
    serialized = [encode_path_value(serialize_path_primitive(item)) for item in values if item is not None]
    if not serialized:
        return path_prefix(name, style)
    if style == 'matrix':
        return ''.join(f";{name}={item}" for item in serialized) if explode else f";{name}={','.join(serialized)}"
    return path_prefix(name, style) + ('.' if explode else ',').join(serialized)


def serialize_path_object(name: str, value: Dict[str, Any], style: str, explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return path_prefix(name, style)
    if style == 'matrix':
        if explode:
            return ''.join(f";{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
        return f";{name}={serialized}"
    if explode:
        separator = '.' if style == 'label' else ','
        serialized = separator.join(f"{encode_path_value(str(key))}={encode_path_value(serialize_path_primitive(entry_value))}" for key, entry_value in entries)
    else:
        serialized = ','.join(item for key, entry_value in entries for item in (encode_path_value(str(key)), encode_path_value(serialize_path_primitive(entry_value))))
    return path_prefix(name, style) + serialized


def path_prefix(name: str, style: str) -> str:
    if style == 'label':
        return '.'
    if style == 'matrix':
        return f";{name}"
    return ''


def encode_path_value(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def serialize_path_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)





class OpenPlatformApi:
    """open_platform open_platform API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.qr_auth = OpenPlatformQrAuthApi(client)


class OpenPlatformQrAuthApi:
    """open_platform open_platform.qr_auth API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.sessions = OpenPlatformQrAuthSessionsApi(client)


class OpenPlatformQrAuthSessionsApi:
    """open_platform open_platform.qr_auth.sessions API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.passwords = OpenPlatformQrAuthSessionsPasswordsApi(client)
        self.scans = OpenPlatformQrAuthSessionsScansApi(client)


    def create(self, body: OpenPlatformQrAuthSessionCreateRequest) -> QrAuthSessionsCreateResult:
        """Create open platform QR auth session"""
        return self._client.post(f"/app/v3/api/open_platform/qr_auth/sessions", json=body)

    def retrieve(self, session_key: str) -> QrAuthSessionsRetrieveResult:
        """Retrieve open platform QR auth session"""
        return self._client.get(f"/app/v3/api/open_platform/qr_auth/sessions/{serialize_path_parameter(session_key, {'name': 'sessionKey', 'style': 'simple', 'explode': False})}")

class OpenPlatformQrAuthSessionsPasswordsApi:
    """open_platform open_platform.qr_auth.sessions.passwords API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, session_key: str, body: OpenPlatformQrAuthPasswordCreateRequest) -> QrAuthSessionsPasswordsCreateResult:
        """Complete open platform QR auth by password"""
        return self._client.post(f"/app/v3/api/open_platform/qr_auth/sessions/{serialize_path_parameter(session_key, {'name': 'sessionKey', 'style': 'simple', 'explode': False})}/passwords", json=body)

class OpenPlatformQrAuthSessionsScansApi:
    """open_platform open_platform.qr_auth.sessions.scans API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, session_key: str, body: OpenPlatformQrAuthScanCreateRequest) -> QrAuthSessionsScansCreateResult:
        """Record open platform QR auth scan"""
        return self._client.post(f"/app/v3/api/open_platform/qr_auth/sessions/{serialize_path_parameter(session_key, {'name': 'sessionKey', 'style': 'simple', 'explode': False})}/scans", json=body)
