package com.sdkwork.clawrouter.app;

import com.sdkwork.common.core.Types;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.api.AiApi;
import com.sdkwork.clawrouter.app.api.AuthApi;
import com.sdkwork.clawrouter.app.api.BillingApi;
import com.sdkwork.clawrouter.app.api.CommunicationApi;
import com.sdkwork.clawrouter.app.api.ContentApi;
import com.sdkwork.clawrouter.app.api.EcosystemApi;
import com.sdkwork.clawrouter.app.api.IamApi;
import com.sdkwork.clawrouter.app.api.PlatformApi;

public class SdkworkAppClient {
    private final HttpClient httpClient;
    private AiApi ai;
    private AuthApi auth;
    private BillingApi billing;
    private CommunicationApi communication;
    private ContentApi content;
    private EcosystemApi ecosystem;
    private IamApi iam;
    private PlatformApi platform;

    public SdkworkAppClient(String baseUrl) {
        this.httpClient = new HttpClient(baseUrl);
        this.ai = new AiApi(httpClient);
        this.auth = new AuthApi(httpClient);
        this.billing = new BillingApi(httpClient);
        this.communication = new CommunicationApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.platform = new PlatformApi(httpClient);
    }

    public SdkworkAppClient(Types.SdkConfig config) {
        this.httpClient = new HttpClient(config);
        this.ai = new AiApi(httpClient);
        this.auth = new AuthApi(httpClient);
        this.billing = new BillingApi(httpClient);
        this.communication = new CommunicationApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.platform = new PlatformApi(httpClient);
    }

    public AiApi getAi() {
        return this.ai;
    }

    public AuthApi getAuth() {
        return this.auth;
    }

    public BillingApi getBilling() {
        return this.billing;
    }

    public CommunicationApi getCommunication() {
        return this.communication;
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

    public PlatformApi getPlatform() {
        return this.platform;
    }

    public SdkworkAppClient setApiKey(String apiKey) {
        httpClient.setApiKey(apiKey);
        return this;
    }

    public SdkworkAppClient setAuthToken(String token) {
        httpClient.setAuthToken(token);
        return this;
    }

    public SdkworkAppClient setAccessToken(String token) {
        httpClient.setAccessToken(token);
        return this;
    }

    public SdkworkAppClient setHeader(String key, String value) {
        httpClient.setHeader(key, value);
        return this;
    }

    public HttpClient getHttpClient() {
        return httpClient;
    }
}
