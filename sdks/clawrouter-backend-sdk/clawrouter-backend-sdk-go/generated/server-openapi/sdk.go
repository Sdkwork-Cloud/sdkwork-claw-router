package backend

import (
    "github.com/sdkwork/clawrouter-backend-sdk/api"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type SdkworkBackendClient struct {
    http *sdkhttp.Client
    Agents *api.AgentsApi
    Ai *api.AiApi
    Commerce *api.CommerceApi
    Content *api.ContentApi
    Ecosystem *api.EcosystemApi
    Iam *api.IamApi
    Integration *api.IntegrationApi
    Mcp *api.McpApi
    Messaging *api.MessagingApi
    OpenPlatform *api.OpenPlatformApi
    Platform *api.PlatformApi
    System *api.SystemApi
    Prompts *api.PromptsApi
    ServiceProviders *api.ServiceProvidersApi
    Storage *api.StorageApi
}

func NewSdkworkBackendClient(baseURL string) *SdkworkBackendClient {
    cfg := sdkhttp.NewDefaultConfig(baseURL)
    return NewSdkworkBackendClientWithConfig(cfg)
}

func NewSdkworkBackendClientWithConfig(config sdkhttp.Config) *SdkworkBackendClient {
    client := sdkhttp.NewClient(config)
    return &SdkworkBackendClient{
        http: client,
        Agents: api.NewAgentsApi(client),
        Ai: api.NewAiApi(client),
        Commerce: api.NewCommerceApi(client),
        Content: api.NewContentApi(client),
        Ecosystem: api.NewEcosystemApi(client),
        Iam: api.NewIamApi(client),
        Integration: api.NewIntegrationApi(client),
        Mcp: api.NewMcpApi(client),
        Messaging: api.NewMessagingApi(client),
        OpenPlatform: api.NewOpenPlatformApi(client),
        Platform: api.NewPlatformApi(client),
        System: api.NewSystemApi(client),
        Prompts: api.NewPromptsApi(client),
        ServiceProviders: api.NewServiceProvidersApi(client),
        Storage: api.NewStorageApi(client),
    }
}

func (c *SdkworkBackendClient) SetApiKey(apiKey string) *SdkworkBackendClient {
    c.http.SetApiKey(apiKey)
    return c
}

func (c *SdkworkBackendClient) SetAuthToken(token string) *SdkworkBackendClient {
    c.http.SetAuthToken(token)
    return c
}

func (c *SdkworkBackendClient) SetAccessToken(token string) *SdkworkBackendClient {
    c.http.SetAccessToken(token)
    return c
}

func (c *SdkworkBackendClient) SetHeader(key string, value string) *SdkworkBackendClient {
    c.http.SetHeader(key, value)
    return c
}

func (c *SdkworkBackendClient) Http() *sdkhttp.Client {
    return c.http
}
