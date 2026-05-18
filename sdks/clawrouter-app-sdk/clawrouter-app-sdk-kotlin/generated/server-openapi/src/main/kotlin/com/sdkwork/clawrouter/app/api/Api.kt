package com.sdkwork.clawrouter.app.api

import com.sdkwork.clawrouter.app.http.HttpClient

/**
 * API modules for clawrouter-app-sdk
 */
class Api(private val client: HttpClient) {
    val agents: AgentsApi = AgentsApi(client)
    val ai: AiApi = AiApi(client)
    val auth: AuthApi = AuthApi(client)
    val billing: BillingApi = BillingApi(client)
    val communication: CommunicationApi = CommunicationApi(client)
    val content: ContentApi = ContentApi(client)
    val ecosystem: EcosystemApi = EcosystemApi(client)
    val iam: IamApi = IamApi(client)
    val platform: PlatformApi = PlatformApi(client)
}
