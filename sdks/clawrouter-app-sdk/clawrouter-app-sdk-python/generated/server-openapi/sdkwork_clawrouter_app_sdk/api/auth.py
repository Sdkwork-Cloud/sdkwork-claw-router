from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import IamCurrentSessionUpdateRequest, IamLoginQrCodeConfirmRequest, IamOauthSessionCreateRequest, IamPasswordResetCreateRequest, IamPasswordResetRequestCreateRequest, IamRegistrationCreateRequest, IamSessionCreateRequest, IamSessionRefreshRequest, IamVerificationCodeCreateRequest, IamVerificationCodeVerifyRequest, LoginQrCodesConfirmResult, LoginQrCodesCreateResult, LoginQrCodesRetrieveResult, OauthAuthorizationUrlsRetrieveResult, OauthSessionsCreateResult, PasswordResetRequestsCreateResult, PasswordResetsCreateResult, RegistrationsCreateResult, RuntimeSettingsRetrieveResult, SessionsCreateResult, SessionsCurrentDeleteResult, SessionsCurrentRetrieveResult, SessionsCurrentUpdateResult, SessionsRefreshResult, VerificationCodesCreateResult, VerificationCodesVerifyResult, VerificationPolicyRetrieveResult

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


def build_query_string(parameters: List[Dict[str, Any]]) -> str:
    pairs: List[str] = []
    for parameter in parameters:
        append_serialized_parameter(pairs, parameter)
    return '&'.join(pairs)


def append_serialized_parameter(pairs: List[str], parameter: Dict[str, Any]) -> None:
    value = parameter.get('value')
    if value is None:
        return

    name = str(parameter.get('name') or '')
    allow_reserved = bool(parameter.get('allow_reserved'))
    content_type = parameter.get('content_type')
    if content_type:
        import json

        pairs.append(f"{encode_query_component(name)}={encode_query_value(json.dumps(value, separators=(',', ':')), allow_reserved)}")
        return

    style = str(parameter.get('style') or 'form')
    explode = bool(parameter.get('explode'))
    if style == 'deepObject':
        append_deep_object_parameter(pairs, name, value, allow_reserved)
        return
    if isinstance(value, (list, tuple)):
        append_array_parameter(pairs, name, value, style, explode, allow_reserved)
        return
    if isinstance(value, dict):
        append_object_parameter(pairs, name, value, style, explode, allow_reserved)
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")


def append_array_parameter(
    pairs: List[str],
    name: str,
    value: Any,
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    values = [serialize_primitive(item) for item in value if item is not None]
    if not values:
        return

    if style == 'form' and explode:
        for item in values:
            pairs.append(f"{encode_query_component(name)}={encode_query_value(item, allow_reserved)}")
        return

    pairs.append(f"{encode_query_component(name)}={encode_query_value(','.join(values), allow_reserved)}")


def append_object_parameter(
    pairs: List[str],
    name: str,
    value: Dict[str, Any],
    style: str,
    explode: bool,
    allow_reserved: bool,
) -> None:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if not entries:
        return

    if style == 'form' and explode:
        for key, entry_value in entries:
            pairs.append(f"{encode_query_component(str(key))}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")
        return

    serialized = ','.join(
        item
        for key, entry_value in entries
        for item in (str(key), serialize_primitive(entry_value))
    )
    pairs.append(f"{encode_query_component(name)}={encode_query_value(serialized, allow_reserved)}")


def append_deep_object_parameter(pairs: List[str], name: str, value: Any, allow_reserved: bool) -> None:
    if not isinstance(value, dict):
        pairs.append(f"{encode_query_component(name)}={encode_query_value(serialize_primitive(value), allow_reserved)}")
        return

    for key, entry_value in value.items():
        if entry_value is None:
            continue
        pairs.append(f"{encode_query_component(f'{name}[{key}]')}={encode_query_value(serialize_primitive(entry_value), allow_reserved)}")


def serialize_primitive(value: Any) -> str:
    if isinstance(value, dict):
        import json

        return json.dumps(value, separators=(',', ':'))
    return str(value)


def encode_query_component(value: str) -> str:
    from urllib.parse import quote

    return quote(value, safe='')


def encode_query_value(value: str, allow_reserved: bool) -> str:
    from urllib.parse import quote

    return quote(value, safe=':/?#[]@!$&\'()*+,;=' if allow_reserved else '')

def build_request_headers(headers: Dict[str, Dict[str, Any]], cookies: Optional[Dict[str, Dict[str, Any]]] = None) -> Optional[Dict[str, str]]:
    request_headers: Dict[str, str] = {}
    for name, parameter in headers.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            request_headers[name] = serialized

    cookie_header = build_cookie_header(cookies or {})
    if cookie_header:
        request_headers['Cookie'] = (
            f"{request_headers['Cookie']}; {cookie_header}"
            if 'Cookie' in request_headers
            else cookie_header
        )

    return request_headers or None


def build_cookie_header(cookies: Dict[str, Dict[str, Any]]) -> Optional[str]:
    from urllib.parse import quote

    pairs: List[str] = []
    for name, parameter in cookies.items():
        serialized = serialize_parameter_value(parameter)
        if serialized is not None:
            pairs.append(f"{quote(str(name), safe='')}={quote(serialized, safe='')}")
    return '; '.join(pairs) if pairs else None


def serialize_parameter_value(parameter: Optional[Dict[str, Any]]) -> Optional[str]:
    value = None if parameter is None else parameter.get('value')
    if value is None:
        return None
    if parameter and parameter.get('content_type'):
        import json

        return json.dumps(value, separators=(',', ':'))
    if isinstance(value, (list, tuple)):
        return ','.join(serialize_header_primitive(item) for item in value if item is not None)
    if isinstance(value, dict):
        return serialize_header_object(value, bool(parameter and parameter.get('explode')))
    return serialize_header_primitive(value)


def serialize_header_object(value: Dict[str, Any], explode: bool) -> str:
    entries = [(key, entry_value) for key, entry_value in value.items() if entry_value is not None]
    if explode:
        return ','.join(f"{key}={serialize_header_primitive(entry_value)}" for key, entry_value in entries)
    return ','.join(item for key, entry_value in entries for item in (str(key), serialize_header_primitive(entry_value)))


def serialize_header_primitive(value: Any) -> str:
    return str(value)


class AuthApi:
    """auth auth API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.oauth_authorization_urls = AuthOauthAuthorizationUrlsApi(client)
        self.oauth_sessions = AuthOauthSessionsApi(client)
        self.password_reset_requests = AuthPasswordResetRequestsApi(client)
        self.password_resets = AuthPasswordResetsApi(client)
        self.login_qr_codes = AuthLoginQrCodesApi(client)
        self.registrations = AuthRegistrationsApi(client)
        self.runtime_settings = AuthRuntimeSettingsApi(client)
        self.sessions = AuthSessionsApi(client)
        self.verification_codes = AuthVerificationCodesApi(client)
        self.verification_policy = AuthVerificationPolicyApi(client)


class AuthOauthAuthorizationUrlsApi:
    """auth auth.oauth_authorization_urls API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, provider: str, redirect_uri: str, state: Optional[str] = None, scope: Optional[str] = None) -> OauthAuthorizationUrlsRetrieveResult:
        """Retrieve OAuth authorization URL"""
        query = build_query_string([
            {'name': 'provider', 'value': provider, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'redirect_uri', 'value': redirect_uri, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'state', 'value': state, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'scope', 'value': scope, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/auth/oauth_authorization_urls", query))

class AuthOauthSessionsApi:
    """auth auth.oauth_sessions API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: IamOauthSessionCreateRequest) -> OauthSessionsCreateResult:
        """Create OAuth IAM session"""
        return self._client.post(f"/app/v3/api/auth/oauth_sessions", json=body)

class AuthPasswordResetRequestsApi:
    """auth auth.password_reset_requests API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: IamPasswordResetRequestCreateRequest) -> PasswordResetRequestsCreateResult:
        """Create password reset request"""
        return self._client.post(f"/app/v3/api/auth/password_reset_requests", json=body)

class AuthPasswordResetsApi:
    """auth auth.password_resets API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: IamPasswordResetCreateRequest) -> PasswordResetsCreateResult:
        """Create password reset"""
        return self._client.post(f"/app/v3/api/auth/password_resets", json=body)

class AuthLoginQrCodesApi:
    """auth auth.login_qr_codes API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self) -> LoginQrCodesCreateResult:
        """Create QR login code"""
        return self._client.post(f"/app/v3/api/auth/qr_login_codes")

    def confirm(self, body: IamLoginQrCodeConfirmRequest) -> LoginQrCodesConfirmResult:
        """Confirm QR login code"""
        return self._client.post(f"/app/v3/api/auth/qr_login_codes/confirm", json=body)

    def retrieve(self, qr_key: str) -> LoginQrCodesRetrieveResult:
        """Retrieve QR login status"""
        return self._client.get(f"/app/v3/api/auth/qr_login_codes/{serialize_path_parameter(qr_key, {'name': 'qrKey', 'style': 'simple', 'explode': False})}")

class AuthRegistrationsApi:
    """auth auth.registrations API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: IamRegistrationCreateRequest, x_request_id: Optional[str] = None) -> RegistrationsCreateResult:
        """Create IAM registration"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/auth/registrations", json=body, headers=request_headers)

class AuthRuntimeSettingsApi:
    """auth auth.runtime_settings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self, tenant_code: Optional[str] = None, organization_code: Optional[str] = None) -> RuntimeSettingsRetrieveResult:
        """Retrieve public IAM auth runtime settings"""
        query = build_query_string([
            {'name': 'tenant_code', 'value': tenant_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
            {'name': 'organization_code', 'value': organization_code, 'style': 'form', 'explode': True, 'allow_reserved': False},
        ])
        return self._client.get(_append_query_string(f"/app/v3/api/auth/runtime_settings", query))

class AuthSessionsApi:
    """auth auth.sessions API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.current = AuthSessionsCurrentApi(client)


    def create(self, body: IamSessionCreateRequest, x_request_id: Optional[str] = None) -> SessionsCreateResult:
        """Create IAM session"""
        request_headers = build_request_headers(
            {
                'X-Request-Id': {'value': x_request_id, 'style': 'simple', 'explode': False},
            },
            {}
        )
        return self._client.post(f"/app/v3/api/auth/sessions", json=body, headers=request_headers)

    def refresh(self, body: IamSessionRefreshRequest) -> SessionsRefreshResult:
        """Refresh IAM session"""
        return self._client.post(f"/app/v3/api/auth/sessions/refresh", json=body)

class AuthSessionsCurrentApi:
    """auth auth.sessions.current API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def delete(self) -> SessionsCurrentDeleteResult:
        """Delete current IAM session"""
        return self._client.delete(f"/app/v3/api/auth/sessions/current")

    def retrieve(self) -> SessionsCurrentRetrieveResult:
        """Retrieve current IAM session"""
        return self._client.get(f"/app/v3/api/auth/sessions/current")

    def update(self, body: IamCurrentSessionUpdateRequest) -> SessionsCurrentUpdateResult:
        """Update current IAM session"""
        return self._client.patch(f"/app/v3/api/auth/sessions/current", json=body)

class AuthVerificationCodesApi:
    """auth auth.verification_codes API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: IamVerificationCodeCreateRequest) -> VerificationCodesCreateResult:
        """Create verification code"""
        return self._client.post(f"/app/v3/api/auth/verification_codes", json=body)

    def verify(self, body: IamVerificationCodeVerifyRequest) -> VerificationCodesVerifyResult:
        """Verify verification code"""
        return self._client.post(f"/app/v3/api/auth/verification_codes/verify", json=body)

class AuthVerificationPolicyApi:
    """auth auth.verification_policy API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> VerificationPolicyRetrieveResult:
        """Retrieve public IAM verification policy"""
        return self._client.get(f"/app/v3/api/auth/verification_policy")
