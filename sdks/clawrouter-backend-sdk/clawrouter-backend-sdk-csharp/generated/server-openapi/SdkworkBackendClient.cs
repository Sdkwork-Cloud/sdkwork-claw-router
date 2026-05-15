using System;
using SDKwork.Common.Core;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;
using Sdkwork.ClawRouter.Backend.Api;

namespace Sdkwork.ClawRouter.Backend
{
    public class SdkworkBackendClient
    {
        private readonly SdkHttpClient _httpClient;

        public AiApi Ai { get; }
        public BillingApi Billing { get; }
        public ContentApi Content { get; }
        public EcosystemApi Ecosystem { get; }
        public IamApi Iam { get; }
        public IntegrationApi Integration { get; }
        public PlatformApi Platform { get; }
        public SystemApi System { get; }

        public SdkworkBackendClient(string baseUrl)
        {
            _httpClient = new SdkHttpClient(baseUrl);
            Ai = new AiApi(_httpClient);
            Billing = new BillingApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Integration = new IntegrationApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
        }

        public SdkworkBackendClient(SdkConfig config)
        {
            _httpClient = new SdkHttpClient(config);
            Ai = new AiApi(_httpClient);
            Billing = new BillingApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Integration = new IntegrationApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
        }

        public SdkworkBackendClient SetApiKey(string apiKey)
        {
            _httpClient.SetApiKey(apiKey);
            return this;
        }

        public SdkworkBackendClient SetAuthToken(string token)
        {
            _httpClient.SetAuthToken(token);
            return this;
        }

        public SdkworkBackendClient SetAccessToken(string token)
        {
            _httpClient.SetAccessToken(token);
            return this;
        }

        public SdkworkBackendClient SetHeader(string key, string value)
        {
            _httpClient.SetHeader(key, value);
            return this;
        }
    }
}
