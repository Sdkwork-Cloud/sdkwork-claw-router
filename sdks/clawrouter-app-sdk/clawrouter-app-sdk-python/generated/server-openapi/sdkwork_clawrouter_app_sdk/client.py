from .http_client import HttpClient, SdkConfig
from .api.agents import AgentsApi
from .api.ai import AiApi
from .api.auth import AuthApi
from .api.chat import ChatApi
from .api.content import ContentApi
from .api.ecosystem import EcosystemApi
from .api.iam import IamApi
from .api.memory import MemoryApi
from .api.notification import NotificationApi
from .api.platform import PlatformApi
from .api.runtime import RuntimeApi
from .api.sdk_reference import SdkReferenceApi
from .api.system import SystemApi


class SdkworkAppClient:
    """clawrouter-app-sdk SDK Client."""

    def __init__(self, config: SdkConfig):
        self._client = HttpClient(config)
        self.agents: AgentsApi
        self.ai: AiApi
        self.auth: AuthApi
        self.chat: ChatApi
        self.content: ContentApi
        self.ecosystem: EcosystemApi
        self.iam: IamApi
        self.memory: MemoryApi
        self.notification: NotificationApi
        self.platform: PlatformApi
        self.runtime: RuntimeApi
        self.sdk_reference: SdkReferenceApi
        self.system: SystemApi

        # Initialize API modules
        self.agents = AgentsApi(self._client)
        self.ai = AiApi(self._client)
        self.auth = AuthApi(self._client)
        self.chat = ChatApi(self._client)
        self.content = ContentApi(self._client)
        self.ecosystem = EcosystemApi(self._client)
        self.iam = IamApi(self._client)
        self.memory = MemoryApi(self._client)
        self.notification = NotificationApi(self._client)
        self.platform = PlatformApi(self._client)
        self.runtime = RuntimeApi(self._client)
        self.sdk_reference = SdkReferenceApi(self._client)
        self.system = SystemApi(self._client)
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
