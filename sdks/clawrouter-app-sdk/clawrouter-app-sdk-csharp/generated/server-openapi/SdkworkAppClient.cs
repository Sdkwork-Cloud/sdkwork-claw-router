using System;
using SDKwork.Common.Core;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;
using Sdkwork.ClawRouter.App.Api;

namespace Sdkwork.ClawRouter.App
{
    public class SdkworkAppClient
    {
        private readonly SdkHttpClient _httpClient;

        public AgentsApi Agents { get; }
        public AiApi Ai { get; }
        public AuthApi Auth { get; }
        public BillingApi Billing { get; }
        public CommunicationApi Communication { get; }
        public ContentApi Content { get; }
        public EcosystemApi Ecosystem { get; }
        public IamApi Iam { get; }
        public PlatformApi Platform { get; }

        public SdkworkAppClient(string baseUrl)
        {
            _httpClient = new SdkHttpClient(baseUrl);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Auth = new AuthApi(_httpClient);
            Billing = new BillingApi(_httpClient);
            Communication = new CommunicationApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
        }

        public SdkworkAppClient(SdkConfig config)
        {
            _httpClient = new SdkHttpClient(config);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Auth = new AuthApi(_httpClient);
            Billing = new BillingApi(_httpClient);
            Communication = new CommunicationApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
        }

        public SdkworkAppClient SetApiKey(string apiKey)
        {
            _httpClient.SetApiKey(apiKey);
            return this;
        }

        public SdkworkAppClient SetAuthToken(string token)
        {
            _httpClient.SetAuthToken(token);
            return this;
        }

        public SdkworkAppClient SetAccessToken(string token)
        {
            _httpClient.SetAccessToken(token);
            return this;
        }

        public SdkworkAppClient SetHeader(string key, string value)
        {
            _httpClient.SetHeader(key, value);
            return this;
        }
    }
}
