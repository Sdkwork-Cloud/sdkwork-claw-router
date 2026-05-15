package backend

import (
    "github.com/sdkwork/clawrouter-backend-sdk/api"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type SdkworkBackendClient struct {
    http *sdkhttp.Client
    Ai *api.AiApi
    Billing *api.BillingApi
    Content *api.ContentApi
    Ecosystem *api.EcosystemApi
    Iam *api.IamApi
    Integration *api.IntegrationApi
    Platform *api.PlatformApi
    System *api.SystemApi
}

func NewSdkworkBackendClient(baseURL string) *SdkworkBackendClient {
    cfg := sdkhttp.NewDefaultConfig(baseURL)
    return NewSdkworkBackendClientWithConfig(cfg)
}

func NewSdkworkBackendClientWithConfig(config sdkhttp.Config) *SdkworkBackendClient {
    client := sdkhttp.NewClient(config)
    return &SdkworkBackendClient{
        http: client,
        Ai: api.NewAiApi(client),
        Billing: api.NewBillingApi(client),
        Content: api.NewContentApi(client),
        Ecosystem: api.NewEcosystemApi(client),
        Iam: api.NewIamApi(client),
        Integration: api.NewIntegrationApi(client),
        Platform: api.NewPlatformApi(client),
        System: api.NewSystemApi(client),
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
