package com.sdkwork.clawrouter.backend

import com.sdkwork.common.core.SdkConfig
import com.sdkwork.clawrouter.backend.http.HttpClient
import com.sdkwork.clawrouter.backend.api.AgentsApi
import com.sdkwork.clawrouter.backend.api.AiApi
import com.sdkwork.clawrouter.backend.api.CommerceApi
import com.sdkwork.clawrouter.backend.api.ContentApi
import com.sdkwork.clawrouter.backend.api.EcosystemApi
import com.sdkwork.clawrouter.backend.api.IamApi
import com.sdkwork.clawrouter.backend.api.IntegrationApi
import com.sdkwork.clawrouter.backend.api.McpApi
import com.sdkwork.clawrouter.backend.api.MessagingApi
import com.sdkwork.clawrouter.backend.api.OpenPlatformApi
import com.sdkwork.clawrouter.backend.api.PlatformApi
import com.sdkwork.clawrouter.backend.api.SystemApi
import com.sdkwork.clawrouter.backend.api.PromptsApi
import com.sdkwork.clawrouter.backend.api.ServiceProvidersApi
import com.sdkwork.clawrouter.backend.api.SitesApi
import com.sdkwork.clawrouter.backend.api.StorageApi

open class SdkworkBackendClient {
    private val httpClient: HttpClient

    lateinit var agents: AgentsApi
    lateinit var ai: AiApi
    lateinit var commerce: CommerceApi
    lateinit var content: ContentApi
    lateinit var ecosystem: EcosystemApi
    lateinit var iam: IamApi
    lateinit var integration: IntegrationApi
    lateinit var mcp: McpApi
    lateinit var messaging: MessagingApi
    lateinit var openPlatform: OpenPlatformApi
    lateinit var platform: PlatformApi
    lateinit var system: SystemApi
    lateinit var prompts: PromptsApi
    lateinit var serviceProviders: ServiceProvidersApi
    lateinit var sites: SitesApi
    lateinit var storage: StorageApi

    constructor(baseUrl: String) {
        this.httpClient = HttpClient(baseUrl)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        commerce = CommerceApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        integration = IntegrationApi(httpClient)
        mcp = McpApi(httpClient)
        messaging = MessagingApi(httpClient)
        openPlatform = OpenPlatformApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
        prompts = PromptsApi(httpClient)
        serviceProviders = ServiceProvidersApi(httpClient)
        sites = SitesApi(httpClient)
        storage = StorageApi(httpClient)
    }

    constructor(config: SdkConfig) {
        this.httpClient = HttpClient(config)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        commerce = CommerceApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        integration = IntegrationApi(httpClient)
        mcp = McpApi(httpClient)
        messaging = MessagingApi(httpClient)
        openPlatform = OpenPlatformApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
        prompts = PromptsApi(httpClient)
        serviceProviders = ServiceProvidersApi(httpClient)
        sites = SitesApi(httpClient)
        storage = StorageApi(httpClient)
    }
    fun setAuthToken(token: String): SdkworkBackendClient {
        httpClient.setAuthToken(token)
        return this
    }

    fun setAccessToken(token: String): SdkworkBackendClient {
        httpClient.setAccessToken(token)
        return this
    }

    fun setHeader(key: String, value: String): SdkworkBackendClient {
        httpClient.setHeader(key, value)
        return this
    }
}
