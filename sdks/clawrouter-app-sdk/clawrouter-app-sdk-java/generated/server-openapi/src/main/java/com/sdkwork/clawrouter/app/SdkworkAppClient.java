package com.sdkwork.clawrouter.app;

import com.sdkwork.common.core.Types;
import com.sdkwork.clawrouter.app.http.HttpClient;
import com.sdkwork.clawrouter.app.api.AgentsApi;
import com.sdkwork.clawrouter.app.api.AiApi;
import com.sdkwork.clawrouter.app.api.ChatApi;
import com.sdkwork.clawrouter.app.api.ContentApi;
import com.sdkwork.clawrouter.app.api.EcosystemApi;
import com.sdkwork.clawrouter.app.api.IamApi;
import com.sdkwork.clawrouter.app.api.MemoryApi;
import com.sdkwork.clawrouter.app.api.NotificationApi;
import com.sdkwork.clawrouter.app.api.PlatformApi;
import com.sdkwork.clawrouter.app.api.SystemApi;
import com.sdkwork.clawrouter.app.api.CommerceApi;
import com.sdkwork.clawrouter.app.api.RuntimeApi;
import com.sdkwork.clawrouter.app.api.SdkReferenceApi;

public class SdkworkAppClient {
    private final HttpClient httpClient;
    private AgentsApi agents;
    private AiApi ai;
    private ChatApi chat;
    private ContentApi content;
    private EcosystemApi ecosystem;
    private IamApi iam;
    private MemoryApi memory;
    private NotificationApi notification;
    private PlatformApi platform;
    private SystemApi system;
    private CommerceApi commerce;
    private RuntimeApi runtime;
    private SdkReferenceApi sdkReference;

    public SdkworkAppClient(String baseUrl) {
        this.httpClient = new HttpClient(baseUrl);
        this.agents = new AgentsApi(httpClient);
        this.ai = new AiApi(httpClient);
        this.chat = new ChatApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.memory = new MemoryApi(httpClient);
        this.notification = new NotificationApi(httpClient);
        this.platform = new PlatformApi(httpClient);
        this.system = new SystemApi(httpClient);
        this.commerce = new CommerceApi(httpClient);
        this.runtime = new RuntimeApi(httpClient);
        this.sdkReference = new SdkReferenceApi(httpClient);
    }

    public SdkworkAppClient(Types.SdkConfig config) {
        this.httpClient = new HttpClient(config);
        this.agents = new AgentsApi(httpClient);
        this.ai = new AiApi(httpClient);
        this.chat = new ChatApi(httpClient);
        this.content = new ContentApi(httpClient);
        this.ecosystem = new EcosystemApi(httpClient);
        this.iam = new IamApi(httpClient);
        this.memory = new MemoryApi(httpClient);
        this.notification = new NotificationApi(httpClient);
        this.platform = new PlatformApi(httpClient);
        this.system = new SystemApi(httpClient);
        this.commerce = new CommerceApi(httpClient);
        this.runtime = new RuntimeApi(httpClient);
        this.sdkReference = new SdkReferenceApi(httpClient);
    }

    public AgentsApi getAgents() {
        return this.agents;
    }

    public AiApi getAi() {
        return this.ai;
    }

    public ChatApi getChat() {
        return this.chat;
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

    public MemoryApi getMemory() {
        return this.memory;
    }

    public NotificationApi getNotification() {
        return this.notification;
    }

    public PlatformApi getPlatform() {
        return this.platform;
    }

    public SystemApi getSystem() {
        return this.system;
    }

    public CommerceApi getCommerce() {
        return this.commerce;
    }

    public RuntimeApi getRuntime() {
        return this.runtime;
    }

    public SdkReferenceApi getSdkReference() {
        return this.sdkReference;
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
