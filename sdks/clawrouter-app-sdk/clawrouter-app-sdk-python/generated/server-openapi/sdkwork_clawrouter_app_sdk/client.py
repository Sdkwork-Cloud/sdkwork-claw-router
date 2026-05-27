from .http_client import HttpClient, SdkConfig
from .api.commerce import CommerceApi
from .api.agents import AgentsApi
from .api.ai import AiApi
from .api.auth import AuthApi
from .api.chat import ChatApi
from .api.content import ContentApi
from .api.ecosystem import EcosystemApi
from .api.iam import IamApi
from .api.memory import MemoryApi
from .api.notification import NotificationApi
from .api.open_platform import OpenPlatformApi
from .api.platform import PlatformApi
from .api.system import SystemApi
from .api.runtime import RuntimeApi
from .api.sdk_reference import SdkReferenceApi


class SdkworkAppClient:
    """clawrouter-app-sdk SDK Client."""

    def __init__(self, config: SdkConfig):
        self._client = HttpClient(config)
        self.commerce: CommerceApi
        self.agents: AgentsApi
        self.ai: AiApi
        self.auth: AuthApi
        self.chat: ChatApi
        self.content: ContentApi
        self.ecosystem: EcosystemApi
        self.iam: IamApi
        self.memory: MemoryApi
        self.notification: NotificationApi
        self.open_platform: OpenPlatformApi
        self.platform: PlatformApi
        self.system: SystemApi
        self.runtime: RuntimeApi
        self.sdk_reference: SdkReferenceApi

        # Initialize API modules
        self.commerce = CommerceApi(self._client)
        self.agents = AgentsApi(self._client)
        self.ai = AiApi(self._client)
        self.auth = AuthApi(self._client)
        self.chat = ChatApi(self._client)
        self.content = ContentApi(self._client)
        self.ecosystem = EcosystemApi(self._client)
        self.iam = IamApi(self._client)
        self.memory = MemoryApi(self._client)
        self.notification = NotificationApi(self._client)
        self.open_platform = OpenPlatformApi(self._client)
        self.platform = PlatformApi(self._client)
        self.system = SystemApi(self._client)
        self.runtime = RuntimeApi(self._client)
        self.sdk_reference = SdkReferenceApi(self._client)

    def set_api_key(self, api_key: str) -> 'SdkworkAppClient':
        """Set API key for authentication."""
        self._client.set_api_key(api_key)
        return self

    def set_auth_token(self, token: str) -> 'SdkworkAppClient':
        """Set auth token for authentication."""
        self._client.set_auth_token(token)
        return self

    def set_access_token(self, token: str) -> 'SdkworkAppClient':
        """Set access token for authentication."""
        self._client.set_access_token(token)
        return self

    def set_header(self, key: str, value: str) -> 'SdkworkAppClient':
        """Set custom header."""
        self._client.set_header(key, value)
        return self

    @property
    def http(self) -> HttpClient:
        """Get the underlying HTTP client."""
        return self._client


def create_client(config: SdkConfig) -> SdkworkAppClient:
    """Create a new SDK client instance."""
    return SdkworkAppClient(config)
