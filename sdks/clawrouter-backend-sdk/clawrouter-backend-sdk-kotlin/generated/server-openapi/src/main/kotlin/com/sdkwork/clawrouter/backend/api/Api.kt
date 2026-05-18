package com.sdkwork.clawrouter.backend.api

import com.sdkwork.clawrouter.backend.http.HttpClient

/**
 * API modules for clawrouter-backend-sdk
 */
class Api(private val client: HttpClient) {
    val agents: AgentsApi = AgentsApi(client)
    val ai: AiApi = AiApi(client)
    val billing: BillingApi = BillingApi(client)
    val content: ContentApi = ContentApi(client)
    val ecosystem: EcosystemApi = EcosystemApi(client)
    val iam: IamApi = IamApi(client)
    val integration: IntegrationApi = IntegrationApi(client)
    val platform: PlatformApi = PlatformApi(client)
    val system: SystemApi = SystemApi(client)
}
