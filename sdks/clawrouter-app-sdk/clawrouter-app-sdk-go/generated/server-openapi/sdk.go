package app

import (
    "github.com/sdkwork/clawrouter-app-sdk/api"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type SdkworkAppClient struct {
    http *sdkhttp.Client
    Ai *api.AiApi
    Auth *api.AuthApi
    Billing *api.BillingApi
    Communication *api.CommunicationApi
    Content *api.ContentApi
    Ecosystem *api.EcosystemApi
    Iam *api.IamApi
    Platform *api.PlatformApi
}

func NewSdkworkAppClient(baseURL string) *SdkworkAppClient {
    cfg := sdkhttp.NewDefaultConfig(baseURL)
    return NewSdkworkAppClientWithConfig(cfg)
}

func NewSdkworkAppClientWithConfig(config sdkhttp.Config) *SdkworkAppClient {
    client := sdkhttp.NewClient(config)
    return &SdkworkAppClient{
        http: client,
        Ai: api.NewAiApi(client),
        Auth: api.NewAuthApi(client),
        Billing: api.NewBillingApi(client),
        Communication: api.NewCommunicationApi(client),
        Content: api.NewContentApi(client),
        Ecosystem: api.NewEcosystemApi(client),
        Iam: api.NewIamApi(client),
        Platform: api.NewPlatformApi(client),
    }
}

func (c *SdkworkAppClient) SetApiKey(apiKey string) *SdkworkAppClient {
    c.http.SetApiKey(apiKey)
    return c
}

func (c *SdkworkAppClient) SetAuthToken(token string) *SdkworkAppClient {
    c.http.SetAuthToken(token)
    return c
}

func (c *SdkworkAppClient) SetAccessToken(token string) *SdkworkAppClient {
    c.http.SetAccessToken(token)
    return c
}

func (c *SdkworkAppClient) SetHeader(key string, value string) *SdkworkAppClient {
    c.http.SetHeader(key, value)
    return c
}

func (c *SdkworkAppClient) Http() *sdkhttp.Client {
    return c.http
}
