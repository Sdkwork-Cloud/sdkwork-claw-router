package com.sdkwork.clawrouter.app

import com.sdkwork.common.core.SdkConfig
import com.sdkwork.clawrouter.app.http.HttpClient
import com.sdkwork.clawrouter.app.api.CommerceApi
import com.sdkwork.clawrouter.app.api.AgentsApi
import com.sdkwork.clawrouter.app.api.AiApi
import com.sdkwork.clawrouter.app.api.AuthApi
import com.sdkwork.clawrouter.app.api.ChatApi
import com.sdkwork.clawrouter.app.api.ContentApi
import com.sdkwork.clawrouter.app.api.EcosystemApi
import com.sdkwork.clawrouter.app.api.IamApi
import com.sdkwork.clawrouter.app.api.MemoryApi
import com.sdkwork.clawrouter.app.api.NotificationApi
import com.sdkwork.clawrouter.app.api.OpenPlatformApi
import com.sdkwork.clawrouter.app.api.PlatformApi
import com.sdkwork.clawrouter.app.api.SystemApi
import com.sdkwork.clawrouter.app.api.RuntimeApi
import com.sdkwork.clawrouter.app.api.SdkReferenceApi

class SdkworkAppClient {
    private val httpClient: HttpClient

    lateinit var commerce: CommerceApi
    lateinit var agents: AgentsApi
    lateinit var ai: AiApi
    lateinit var auth: AuthApi
    lateinit var chat: ChatApi
    lateinit var content: ContentApi
    lateinit var ecosystem: EcosystemApi
    lateinit var iam: IamApi
    lateinit var memory: MemoryApi
    lateinit var notification: NotificationApi
    lateinit var openPlatform: OpenPlatformApi
    lateinit var platform: PlatformApi
    lateinit var system: SystemApi
    lateinit var runtime: RuntimeApi
    lateinit var sdkReference: SdkReferenceApi

    constructor(baseUrl: String) {
        this.httpClient = HttpClient(baseUrl)
        commerce = CommerceApi(httpClient)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        auth = AuthApi(httpClient)
        chat = ChatApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        memory = MemoryApi(httpClient)
        notification = NotificationApi(httpClient)
        openPlatform = OpenPlatformApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
        runtime = RuntimeApi(httpClient)
        sdkReference = SdkReferenceApi(httpClient)
    }

    constructor(config: SdkConfig) {
        this.httpClient = HttpClient(config)
        commerce = CommerceApi(httpClient)
        agents = AgentsApi(httpClient)
        ai = AiApi(httpClient)
        auth = AuthApi(httpClient)
        chat = ChatApi(httpClient)
        content = ContentApi(httpClient)
        ecosystem = EcosystemApi(httpClient)
        iam = IamApi(httpClient)
        memory = MemoryApi(httpClient)
        notification = NotificationApi(httpClient)
        openPlatform = OpenPlatformApi(httpClient)
        platform = PlatformApi(httpClient)
        system = SystemApi(httpClient)
        runtime = RuntimeApi(httpClient)
        sdkReference = SdkReferenceApi(httpClient)
    }

    fun setApiKey(apiKey: String): SdkworkAppClient {
        httpClient.setApiKey(apiKey)
        return this
    }

    fun setAuthToken(token: String): SdkworkAppClient {
        httpClient.setAuthToken(token)
        return this
    }

    fun setAccessToken(token: String): SdkworkAppClient {
        httpClient.setAccessToken(token)
        return this
    }

    fun setHeader(key: String, value: String): SdkworkAppClient {
        httpClient.setHeader(key, value)
        return this
    }
}
