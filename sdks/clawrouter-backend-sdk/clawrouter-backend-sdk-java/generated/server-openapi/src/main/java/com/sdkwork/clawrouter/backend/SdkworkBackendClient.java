package com.sdkwork.clawrouter.backend;

import com.sdkwork.common.core.Types;
import com.sdkwork.clawrouter.backend.http.HttpClient;
import com.sdkwork.clawrouter.backend.api.AgentsApi;
import com.sdkwork.clawrouter.backend.api.AiApi;
import com.sdkwork.clawrouter.backend.api.BillingApi;
import com.sdkwork.clawrouter.backend.api.ContentApi;
import com.sdkwork.clawrouter.backend.api.EcosystemApi;
import com.sdkwork.clawrouter.backend.api.IamApi;
import com.sdkwork.clawrouter.backend.api.IntegrationApi;
import com.sdkwork.clawrouter.backend.api.PlatformApi;
import com.sdkwork.clawrouter.backend.api.SystemApi;

public class SdkworkBackendClient {
    private final HttpClient httpClient;
    private AgentsApi agents;
    private AiApi ai;
    private BillingApi billing;
    private ContentApi content;
    private EcosystemApi ecosystem;
    private IamApi iam;
    private IntegrationApi integration;
    private PlatformApi platform;
    private SystemApi system;

    public SdkworkBackendClient(String baseUrl) {
        this.httpClient = new HttpClient(baseUrl);
        this.agents = new AgentsApi(httpClient);
        this.ai = new AiApi(httpClient);
        this.billing = new BillingApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.integration = new IntegrationApi(httpClient);
        this.platform = new PlatformApi(httpClient);
        this.system = new SystemApi(httpClient);
    }

    public SdkworkBackendClient(Types.SdkConfig config) {
        this.httpClient = new HttpClient(config);
        this.agents = new AgentsApi(httpClient);
        this.ai = new AiApi(httpClient);
        this.billing = new BillingApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.integration = new IntegrationApi(httpClient);
        this.platform = new PlatformApi(httpClient);
        this.system = new SystemApi(httpClient);
    }

    public AgentsApi getAgents() {
        return this.agents;
    }

    public AiApi getAi() {
        return this.ai;
    }

    public BillingApi getBilling() {
        return this.billing;
    }

    public ContentApi getContent() {
        return this.content;
    }

    public EcosystemApi getEcosystem() {
        return this.ecosystem;
    }

    public IamApi getIam() {
        return this.iam;
    }

    public IntegrationApi getIntegration() {
        return this.integration;
    }

    public PlatformApi getPlatform() {
        return this.platform;
    }

    public SystemApi getSystem() {
        return this.system;
    }

    public SdkworkBackendClient setApiKey(String apiKey) {
        httpClient.setApiKey(apiKey);
        return this;
    }

    public SdkworkBackendClient setAuthToken(String token) {
        httpClient.setAuthToken(token);
        return this;
    }

    public SdkworkBackendClient setAccessToken(String token) {
        httpClient.setAccessToken(token);
        return this;
    }

    public SdkworkBackendClient setHeader(String key, String value) {
        httpClient.setHeader(key, value);
        return this;
    }

    public HttpClient getHttpClient() {
        return httpClient;
    }
}
