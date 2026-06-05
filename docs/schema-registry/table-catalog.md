# 数据库表目录与表说明

生成来源：`docs/schema-registry/sdkwork-claw-router.tables.yaml`
source: docs/schema-registry/sdkwork-claw-router.tables.yaml
表总数：324
table-count: 324
本项目生成表：216

本文列出当前应用 schema registry 中登记的全部数据库表，并给出中文业务说明。`generated = no` 表示物理结构由外部系统或 Java 兼容实体拥有，当前应用只登记和读取契约。

## Domain 汇总

| domain | 表数量 | 说明 |
| --- | ---: | --- |
| `ai` | 84 | AI 中转与模型服务 |
| `commerce` | 85 | 交易、计费与结算 |
| `content` | 30 | 内容、文档与对象存储 |
| `iam` | 27 | 身份、访问与安全 |
| `integration` | 19 | 外部集成与服务商 |
| `legacy` | 24 | Java Plus 兼容 |
| `messaging` | 15 | 消息触达 |
| `ops` | 14 | 运维治理 |
| `promotion` | 18 | 营销促销 |
| `studio` | 6 | 工作台与应用市场 |
| `system` | 2 | 系统安装 |

## AI 中转与模型服务

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `ai_channel_group` | 中转站面向用户/API Key 的路由与计费分组，绑定价格计划和倍率。 | `tenant_entity` | `ai-routing-service` | yes |
| `ai_channel_group_member` | 维护分组可访问的上游账号池成员及优先级、权重。 | `relation_entity` | `ai-routing-service` | yes |
| `ai_channel_group_resource` | 维护分组可访问的资源或资源组，是 API Key 到资源授权的核心边。 | `relation_entity` | `ai-routing-service` | yes |
| `ai_channel_group_metric_snapshot` | 保存分组容量、额度和用量的指标快照。 | `projection` | `metrics-worker` | yes |
| `ai_provider` | 定义上游集成供应商类型，表示官方厂商、云厂商、聚合商或自建中转能力。 | `dictionary_entity` | `ai-routing-service` | yes |
| `ai_site` | 上游服务商站点/账号主体，承载上游服务商基础信息、Logo、域名和认证入口。 | `provider_account_secret_ref` | `ai-routing-service` | yes |
| `ai_site_service` | 上游服务商按区域或服务维度的部署配置，主要区分 base URL 和凭证引用。 | `credential_ref` | `ai-routing-service` | yes |
| `ai_channel` | 上游账号/渠道运行时配置，连接 provider、site、认证方式、区域和调度权重。 | `credential_ref` | `ai-routing-service` | yes |
| `ai_channel_credential` | 上游账号的具体凭证轮换单元，保存 base URL、secret ref、权重和健康状态。 | `credential_ref` | `ai-routing-service` | yes |
| `integration_provider_health_snapshot` | AI 中转与模型服务的投影快照，记录 供应商健康快照。 | `projection` | `ops-worker` | yes |
| `ai_model_vendor` | 稳定的模型或能力供应商字典，例如 OpenAI、Anthropic、Google、Kling。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_modality` | AI 能力模态字典，例如 LLM、图像、视频、音频、音乐和音效。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_api_endpoint` | 对外开放 API 资源字典，用于把请求路径抽象为可授权、可计费资源。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_vendor_modality` | 供应商与能力模态的关系，描述某 vendor 支持哪些能力。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_vendor_api_endpoint` | 供应商与 API 资源的关系，描述某 vendor 支持哪些 API。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_modality_api_endpoint` | 能力模态与 API 资源的关系，支持按模态筛选 API 能力。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_model_modality` | 模型与模态的关系，描述模型输入输出能力分类。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_model_api_endpoint` | 模型与 API 资源的关系，描述模型可被哪些 API 调用。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_resource` | 中转站统一资源抽象，覆盖模型、API、图片、视频、音频、音乐、音效和按次资源。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_resource_group` | 统一资源分组，用于维护 OpenAI、Claude、Gemini、Kling 等 API 资源集合。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_resource_group_item` | 资源分组成员关系，支持资源组嵌套和资源集合安装种子。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_channel_resource` | 上游账号/渠道支持的资源授权，是账号能力筛选和路由候选生成的核心边。 | `relation_entity` | `ai-routing-service` | yes |
| `ai_provider_object_route` | 对象类或非模型 API 的运行时路由绑定，支持无模型参数的 API 调用。 | `runtime_binding` | `gateway-runtime` | yes |
| `ai_config_version` | AI 路由配置版本，用于快照缓存刷新和分布式实例协调。 | `runtime_coordination` | `ai-routing-service` | yes |
| `ai_config_change_event` | AI 配置变更事件，用于触发运行时缓存和路由快照刷新。 | `runtime_coordination_event` | `ai-routing-service` | yes |
| `ai_model_family` | 模型家族字典，用于归类同系列模型和展示筛选。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_model` | 标准模型目录主表，保存模型 catalog key、vendor、能力、上下架和展示信息。 | `dictionary_entity` | `model-catalog-service` | yes |
| `ai_model_capability` | 模型能力补充表，保存 chat、embedding、tools 等能力标签。 | `relation_entity` | `model-catalog-service` | yes |
| `ai_model_catalog_source` | 模型目录来源配置，用于导入官方或第三方模型目录。 | `catalog_source` | `model-catalog-service` | yes |
| `ai_model_catalog_sync_run` | 模型目录同步任务执行记录。 | `event_log` | `model-catalog-service` | yes |
| `ai_billing_meter` | 计费计量单位字典，覆盖 token、请求次数、图片张数、音视频时长等。 | `dictionary_entity` | `pricing-service` | yes |
| `ai_model_pricing` | 模型与资源价格表，保存官方参考价、接入成本价、销售价等价格侧。 | `pricing` | `pricing-service` | yes |
| `ai_pricing_plan` | 价格计划主表，定义默认倍率、加价和价格基准。 | `tenant_entity` | `pricing-service` | yes |
| `ai_pricing_plan_binding` | 价格计划绑定关系，用于将账号、分组、租户或 SKU 绑定到价格计划。 | `relation_entity` | `pricing-service` | yes |
| `ai_pricing_rule` | 价格规则表，支持倍率、固定价格、阶梯价和表达式计费。 | `tenant_entity` | `pricing-service` | yes |
| `ai_pricing_tier` | 价格阶梯表，保存分段计费阈值和单价。 | `tenant_entity` | `pricing-service` | yes |
| `ai_pricing_import_snapshot` | 价格导入快照，记录官方价格或供应商账单价格同步过程。 | `event_log` | `pricing-sync-worker` | yes |
| `ai_model_rank_snapshot` | 模型排行和质量/成本/延迟指标投影，用于模型市场和推荐。 | `projection` | `analytics-worker` | yes |
| `ai_routing_policy` | 路由策略主表，定义全局、租户、组织、API Key 或分组作用域。 | `tenant_entity` | `routing-policy-service` | yes |
| `ai_routing_profile` | 路由策略配置档，承载一组规则版本。 | `tenant_entity` | `routing-policy-service` | yes |
| `ai_routing_rule` | 路由规则表，保存匹配条件、候选账号、fallback 和约束。 | `tenant_entity` | `routing-policy-service` | yes |
| `ai_routing_decision_log` | 运行时路由决策日志，记录请求选择了哪个上游账号及原因。 | `event_log` | `gateway-runtime` | yes |
| `ai_request_trace` | 网关请求链路跟踪表，记录 API Key、分组、模型、账号、状态码、TTFT 和耗时。 | `event_log` | `gateway-runtime` | yes |
| `ai_usage_fact` | AI 用量事实表，记录计费单位、用量、单价快照和上游成本。 | `ledger_source_fact` | `gateway-runtime` | yes |
| `ai_quota_policy` | AI 用量或模型访问限额策略。 | `tenant_entity` | `quota-service` | yes |
| `ai_prompt` | AI 中转与模型服务的租户级主数据，记录 prompt。 | `tenant_entity` | `prompt-service` | yes |
| `ai_prompt_version` | AI 中转与模型服务的租户级主数据，记录 提示词版本。 | `tenant_entity` | `prompt-service` | yes |
| `ai_prompt_binding` | AI 中转与模型服务的租户级主数据，记录 提示词绑定。 | `tenant_entity` | `prompt-service` | yes |
| `ai_mcp_server` | AI 中转与模型服务的租户级主数据，记录 MCP 服务。 | `tenant_entity` | `mcp-service` | yes |
| `ai_mcp_server_revision` | AI 中转与模型服务的租户级主数据，记录 MCP 服务修订。 | `tenant_entity` | `mcp-service` | yes |
| `ai_mcp_tool` | AI 中转与模型服务的租户级主数据，记录 MCP 工具。 | `tenant_entity` | `mcp-service` | yes |
| `ai_mcp_binding` | AI 中转与模型服务的租户级主数据，记录 MCP 绑定。 | `tenant_entity` | `mcp-service` | yes |
| `ai_agent` | AI 中转与模型服务的租户级主数据，记录 agent。 | `tenant_entity` | `agent-service` | yes |
| `ai_agent_version` | AI 中转与模型服务的租户级主数据，记录 Agent 版本。 | `tenant_entity` | `agent-service` | yes |
| `ai_agent_run` | AI 中转与模型服务的事件日志，记录 Agent 运行。 | `event_log` | `agent-runtime` | yes |
| `ai_agent_run_step` | AI 中转与模型服务的事件日志，记录 Agent 运行步骤。 | `event_log` | `agent-runtime` | yes |
| `ai_agent_memory` | AI 中转与模型服务的用户级数据，记录 Agent 记忆。 | `user_entity` | `agent-memory-service` | yes |
| `ai_chat_conversation` | AI 中转与模型服务的用户级数据，记录 聊天会话。 | `user_entity` | `chat-service` | yes |
| `ai_chat_turn` | AI 中转与模型服务的事件日志，记录 聊天轮次。 | `event_log` | `chat-service` | yes |
| `ai_chat_item` | AI 中转与模型服务的事件日志，记录 聊天条目。 | `event_log` | `chat-service` | yes |
| `ai_chat_message` | AI 中转与模型服务的事件日志，记录 聊天消息。 | `event_log` | `chat-service` | yes |
| `ai_chat_message_part` | AI 中转与模型服务的事件日志，记录 聊天消息片段。 | `event_log` | `chat-service` | yes |
| `ai_chat_context_snapshot` | AI 中转与模型服务的事件日志，记录 聊天上下文快照。 | `event_log` | `chat-runtime` | yes |
| `ai_agent_session` | AI 中转与模型服务的用户级数据，记录 Agent 会话。 | `user_entity` | `agent-runtime` | yes |
| `ai_memory_space` | AI 中转与模型服务的用户级数据，记录 记忆空间。 | `user_entity` | `memory-service` | yes |
| `ai_memory_space_binding` | AI 中转与模型服务的租户级主数据，记录 记忆空间绑定。 | `tenant_entity` | `memory-service` | yes |
| `ai_memory_entry` | AI 中转与模型服务的用户级数据，记录 记忆条目。 | `user_entity` | `memory-service` | yes |
| `ai_memory_embedding` | AI 中转与模型服务的租户级主数据，记录 记忆向量。 | `tenant_entity` | `memory-service` | yes |
| `ai_memory_event` | AI 中转与模型服务的事件日志，记录 记忆事件。 | `event_log` | `memory-service` | yes |
| `ai_memory_link` | AI 中转与模型服务的事件日志，记录 记忆链接。 | `event_log` | `memory-service` | yes |
| `ai_runtime_invocation` | AI 中转与模型服务的事件日志，记录 运行时调用。 | `event_log` | `ai-runtime` | yes |
| `ai_runtime_invocation_event` | AI 中转与模型服务的事件日志，记录 运行时调用事件。 | `event_log` | `ai-runtime` | yes |
| `ai_runtime_usage_link` | AI 中转与模型服务的事件日志，记录 运行时用量关联。 | `event_log` | `ai-runtime` | yes |
| `ai_runtime_artifact` | AI 中转与模型服务的事件日志，记录 运行时产物。 | `event_log` | `ai-runtime` | yes |
| `ai_agent_tool_binding` | AI 中转与模型服务的租户级主数据，记录 Agent 工具绑定。 | `tenant_entity` | `agent-service` | yes |
| `ai_agent_mcp_server` | AI 中转与模型服务的租户级主数据，记录 Agent MCP 服务绑定。 | `tenant_entity` | `agent-service` | yes |
| `ai_generation_session` | AI 中转与模型服务的用户级数据，记录 生成会话。 | `user_entity` | `generation-service` | yes |
| `ai_generation_job` | AI 中转与模型服务的事件日志，记录 生成任务。 | `event_log` | `generation-service` | yes |
| `ai_generation_asset` | AI 中转与模型服务的用户级数据，记录 生成资产。 | `user_entity` | `generation-service` | yes |
| `ai_generation_asset_action` | AI 中转与模型服务的事件日志，记录 生成资产操作。 | `event_log` | `generation-service` | yes |
| `ai_model_mapping_rule` | 模型映射规则主表，定义全局、vendor、账号或分组级模型别名映射。 | `rule_entity` | `ai-routing-service` | yes |
| `ai_model_mapping_rule_item` | 模型映射规则条目，保存源模型到目标模型的具体映射。 | `relation_entity` | `ai-routing-service` | yes |
| `ai_model_mapping_rule_binding` | 模型映射规则绑定，定义映射规则适用的账号、分组、vendor 或全局范围。 | `relation_entity` | `ai-routing-service` | yes |
| `ai_usage_service_provider_edge` | 将 AI 用量事实关联到服务商链路，用于服务商结算和成本分摊。 | `commercial_usage_edge_fact` | `gateway-runtime` | yes |

## 交易、计费与结算

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `commerce_idempotency_key` | 交易、计费与结算的外部兼容表，登记 幂等键 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_account` | 交易、计费与结算的外部兼容表，登记 账户 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_account_ledger_entry` | 交易、计费与结算的外部兼容表，登记 账户流水 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_account_hold` | 交易、计费与结算的外部兼容表，登记 账户冻结 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_billing_history` | 交易、计费与结算的外部兼容表，登记 计费历史 的现有物理结构供当前应用读取或映射。 | `read_model` | `sdkwork-appbase-commerce` | no |
| `commerce_product_category` | 交易、计费与结算的外部兼容表，登记 商品分类 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_spu` | 交易、计费与结算的外部兼容表，登记 商品 SPU 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_spu_category` | 交易、计费与结算的外部兼容表，登记 商品 SPU 分类 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_sku` | 交易、计费与结算的外部兼容表，登记 商品 SKU 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_attribute` | 交易、计费与结算的外部兼容表，登记 商品属性 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_category_attribute` | 交易、计费与结算的外部兼容表，登记 商品分类属性 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_attribute_value` | 交易、计费与结算的外部兼容表，登记 商品属性值 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_sku_attribute` | 交易、计费与结算的外部兼容表，登记 商品 SKU 属性 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_product_media` | 交易、计费与结算的外部兼容表，登记 商品媒体 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_price_list` | 交易、计费与结算的外部兼容表，登记 价格表 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_price_list_item` | 交易、计费与结算的外部兼容表，登记 价格表条目 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_inventory_stock` | 交易、计费与结算的外部兼容表，登记 库存 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_inventory_reservation` | 交易、计费与结算的外部兼容表，登记 库存预留 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_inventory_ledger` | 交易、计费与结算的外部兼容表，登记 库存流水 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_cart` | 交易、计费与结算的外部兼容表，登记 cart 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_cart_item` | 交易、计费与结算的外部兼容表，登记 购物车条目 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_user_address` | 交易、计费与结算的外部兼容表，登记 用户地址 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_checkout_session` | 交易、计费与结算的外部兼容表，登记 结算会话 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_checkout_line` | 交易、计费与结算的外部兼容表，登记 结算行 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_checkout_quote` | 交易、计费与结算的外部兼容表，登记 结算报价 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership_plan` | 交易、计费与结算的外部兼容表，登记 会员计划 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership_package_group` | 交易、计费与结算的外部兼容表，登记 会员套餐组 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership_package` | 交易、计费与结算的外部兼容表，登记 会员套餐 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership` | 交易、计费与结算的外部兼容表，登记 membership 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership_entitlement` | 交易、计费与结算的外部兼容表，登记 会员权益 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_membership_entitlement_usage` | 交易、计费与结算的外部兼容表，登记 会员权益用量 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_recharge_package` | 交易、计费与结算的外部兼容表，登记 充值套餐 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order` | 交易、计费与结算的外部兼容表，登记 order 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order_item` | 交易、计费与结算的外部兼容表，登记 订单明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order_amount_breakdown` | 交易、计费与结算的外部兼容表，登记 订单金额拆分 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order_address_snapshot` | 交易、计费与结算的外部兼容表，登记 订单地址快照 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order_event` | 交易、计费与结算的外部兼容表，登记 订单事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_order_cancellation` | 交易、计费与结算的外部兼容表，登记 订单取消 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_provider` | 交易、计费与结算的外部兼容表，登记 payment供应商 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_provider_account` | 交易、计费与结算的外部兼容表，登记 支付供应商账号 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_channel` | 交易、计费与结算的外部兼容表，登记 支付渠道 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_route_rule` | 交易、计费与结算的外部兼容表，登记 支付路由规则 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_provider_capability` | 交易、计费与结算的外部兼容表，登记 支付供应商能力 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_operation_attempt` | 交易、计费与结算的外部兼容表，登记 支付操作尝试 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_route_decision` | 交易、计费与结算的外部兼容表，登记 支付路由决策 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_capture` | 交易、计费与结算的外部兼容表，登记 支付扣款 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_webhook_delivery` | 交易、计费与结算的外部兼容表，登记 支付 Webhook 投递 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_statement` | 交易、计费与结算的外部兼容表，登记 支付账单 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_statement_item` | 交易、计费与结算的外部兼容表，登记 支付账单明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_reconciliation_item` | 交易、计费与结算的外部兼容表，登记 支付对账明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_fee` | 交易、计费与结算的外部兼容表，登记 支付费用 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_dispute` | 交易、计费与结算的外部兼容表，登记 支付争议 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_dispute_event` | 交易、计费与结算的外部兼容表，登记 支付争议事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_intent` | 交易、计费与结算的外部兼容表，登记 支付意图 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_attempt` | 交易、计费与结算的外部兼容表，登记 支付尝试 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_webhook_event` | 交易、计费与结算的外部兼容表，登记 支付 Webhook 事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_reconciliation_run` | 交易、计费与结算的外部兼容表，登记 支付对账批次 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_payment_method` | 交易、计费与结算的外部兼容表，登记 支付方式 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_refund` | 交易、计费与结算的外部兼容表，登记 refund 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_refund_item` | 交易、计费与结算的外部兼容表，登记 退款明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_refund_attempt` | 交易、计费与结算的外部兼容表，登记 退款尝试 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_refund_event` | 交易、计费与结算的外部兼容表，登记 退款事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_fulfillment_order` | 交易、计费与结算的外部兼容表，登记 履约单 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_fulfillment_item` | 交易、计费与结算的外部兼容表，登记 履约明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_shipment` | 交易、计费与结算的外部兼容表，登记 物流发货 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_shipment_tracking_event` | 交易、计费与结算的外部兼容表，登记 物流跟踪事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_digital_delivery` | 交易、计费与结算的外部兼容表，登记 数字交付 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_exchange_rule` | 交易、计费与结算的外部兼容表，登记 换货规则 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_invoice_title` | 交易、计费与结算的外部兼容表，登记 发票抬头 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_invoice` | 交易、计费与结算的外部兼容表，登记 invoice 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_invoice_item` | 交易、计费与结算的外部兼容表，登记 发票明细 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_invoice_event` | 交易、计费与结算的外部兼容表，登记 发票事件 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_invoice_provider_attempt` | 交易、计费与结算的外部兼容表，登记 发票服务尝试 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-commerce` | no |
| `commerce_usage_settlement` | 交易、计费与结算的账务投影，记录 用量结算。 | `ledger_projection` | `settlement-worker` | yes |
| `commerce_usage_pricing_plan` | 交易、计费与结算的字典主数据，记录 用量价格计划。 | `dictionary_entity` | `pricing-service` | yes |
| `commerce_usage_statement` | 交易、计费与结算的投影快照，记录 用量账单。 | `projection` | `billing-worker` | yes |
| `commerce_usage_statement_item` | 交易、计费与结算的投影快照，记录 用量账单明细。 | `projection` | `billing-worker` | yes |
| `commerce_settlement_export` | 交易、计费与结算的导出审计，记录 结算导出。 | `export_audit` | `billing-export-service` | yes |
| `commerce_usage_service_provider_statement` | 交易、计费与结算的服务商账单，记录 usageservice供应商statement。 | `commercial_provider_statement` | `billing-worker` | yes |
| `commerce_usage_service_provider_adjustment` | 交易、计费与结算的服务商账务调整，记录 usageservice供应商adjustment。 | `commercial_provider_adjustment` | `billing-worker` | yes |
| `commerce_usage_service_provider_reconciliation_run` | 交易、计费与结算的服务商对账批次，记录 usageservice供应商reconciliationrun。 | `commercial_provider_reconciliation_run` | `reconciliation-worker` | yes |
| `commerce_usage_service_provider_reconciliation_item` | 交易、计费与结算的服务商对账明细，记录 usageservice供应商reconciliationitem。 | `commercial_provider_reconciliation_item` | `reconciliation-worker` | yes |
| `commerce_service_provider_exposure_snapshot` | 交易、计费与结算的服务商风险敞口快照，记录 服务商风险敞口快照。 | `commercial_provider_exposure_snapshot` | `settlement-worker` | yes |
| `analytics_service_provider_daily` | 交易、计费与结算的服务商日统计投影，记录 服务商日统计。 | `commercial_provider_daily_projection` | `analytics-worker` | yes |
| `analytics_service_provider_edge_daily` | 交易、计费与结算的服务商关系日统计投影，记录 服务商关系日统计。 | `commercial_provider_edge_daily_projection` | `analytics-worker` | yes |

## 内容、文档与对象存储

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `content_announcement` | 内容、文档与对象存储的内容主数据，记录 公告。 | `content_entity` | `content-service` | yes |
| `content_doc_page` | 内容、文档与对象存储的内容主数据，记录 文档页面。 | `content_entity` | `docs-service` | yes |
| `content_openapi_snapshot` | 内容、文档与对象存储的投影快照，记录 OpenAPI 快照。 | `projection` | `api-docs-pipeline` | yes |
| `content_sdk_release` | 内容、文档与对象存储的内容主数据，记录 SDK 发布。 | `content_entity` | `sdk-release-pipeline` | yes |
| `content_forum_post` | 内容、文档与对象存储的外部兼容表，登记 论坛帖子 的现有物理结构供当前应用读取或映射。 | `retired_projection` | `legacy-static-fixture` | no |
| `content_forum_comment` | 内容、文档与对象存储的外部兼容表，登记 论坛评论 的现有物理结构供当前应用读取或映射。 | `retired_projection` | `legacy-static-fixture` | no |
| `content_reaction` | 内容、文档与对象存储的事件日志，记录 reaction。 | `event_log` | `content-engagement-service` | yes |
| `content_course` | 内容、文档与对象存储的内容主数据，记录 course。 | `content_entity` | `course-service` | yes |
| `content_course_section` | 内容、文档与对象存储的内容主数据，记录 课程章节。 | `content_entity` | `course-service` | yes |
| `content_course_lesson` | 内容、文档与对象存储的内容主数据，记录 课程课时。 | `content_entity` | `course-service` | yes |
| `content_course_relation` | 内容、文档与对象存储的关系绑定，记录 课程关系。 | `relation_entity` | `course-service` | yes |
| `content_course_application` | 内容、文档与对象存储的用户内容申请，记录 课程申请。 | `user_content_application` | `course-service` | yes |
| `object_provider` | 内容、文档与对象存储的对象存储供应商，记录 供应商。 | `object_storage_provider` | `storage-service` | yes |
| `object_bucket` | 内容、文档与对象存储的对象存储桶，记录 bucket。 | `object_storage_bucket` | `storage-service` | yes |
| `storage_default_bucket_policy` | 内容、文档与对象存储的对象存储路由策略，记录 默认桶策略。 | `object_storage_routing_policy` | `storage-service` | yes |
| `storage_quota_policy` | 内容、文档与对象存储的存储配额策略，记录 限额策略。 | `storage_quota_policy` | `storage-service` | yes |
| `storage_quota_reservation` | 内容、文档与对象存储的存储配额预留，记录 配额预留。 | `storage_quota_reservation` | `storage-service` | yes |
| `storage_usage_counter` | 内容、文档与对象存储的存储用量计数器，记录 用量计数器。 | `storage_usage_counter` | `storage-service` | yes |
| `storage_usage_ledger` | 内容、文档与对象存储的存储用量流水，记录 用量流水。 | `storage_usage_ledger` | `storage-service` | yes |
| `storage_usage_snapshot` | 内容、文档与对象存储的存储用量快照，记录 用量快照。 | `storage_usage_snapshot` | `storage-service` | yes |
| `storage_reconciliation_run` | 内容、文档与对象存储的存储对账批次，记录 对账批次。 | `storage_reconciliation_run` | `storage-service` | yes |
| `storage_reconciliation_item` | 内容、文档与对象存储的存储对账明细，记录 对账明细。 | `storage_reconciliation_item` | `storage-service` | yes |
| `storage_gc_job` | 内容、文档与对象存储的存储清理任务，记录 垃圾清理任务。 | `storage_garbage_collection_job` | `storage-service` | yes |
| `object_blob` | 内容、文档与对象存储的对象文件，记录 blob。 | `object_blob` | `storage-service` | yes |
| `media_resource` | 内容、文档与对象存储的media resource，记录 媒体资源。 | `media_resource` | `storage-service` | yes |
| `object_tag` | 内容、文档与对象存储的对象标签，记录 tag。 | `object_tag` | `storage-service` | yes |
| `upload_session` | 内容、文档与对象存储的上传会话，记录 会话。 | `object_upload_session` | `storage-service` | yes |
| `upload_part` | 内容、文档与对象存储的分片上传，记录 part。 | `object_upload_part` | `storage-service` | yes |
| `upload_presign_grant` | 内容、文档与对象存储的预签授权，记录 presigngrant。 | `object_upload_presign_grant` | `storage-service` | yes |
| `upload_completion_attempt` | 内容、文档与对象存储的上传完成尝试，记录 completionattempt。 | `object_upload_completion_attempt` | `storage-service` | yes |

## 身份、访问与安全

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `iam_tenant` | 身份、访问与安全的租户根数据，记录 租户。 | `tenant_root` | `sdkwork-appbase-iam` | yes |
| `iam_organization` | 身份、访问与安全的租户级主数据，记录 组织。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_organization_member` | 身份、访问与安全的租户级主数据，记录 组织成员。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_user` | 身份、访问与安全的租户级主数据，记录 user。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_user_identity` | 身份、访问与安全的租户级主数据，记录 用户身份。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_credential` | 身份、访问与安全的租户级主数据，记录 凭证。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_session` | 身份、访问与安全的租户级主数据，记录 会话。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_mfa_factor` | 身份、访问与安全的租户级主数据，记录 MFA 因子。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_device` | 身份、访问与安全的租户级主数据，记录 设备。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_role` | 身份、访问与安全的租户级主数据，记录 角色。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_permission` | 身份、访问与安全的全局主数据，记录 权限。 | `global_entity` | `sdkwork-appbase-iam` | yes |
| `iam_policy` | 身份、访问与安全的租户级主数据，记录 策略。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_role_permission` | 身份、访问与安全的租户级主数据，记录 角色权限。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_user_role` | 身份、访问与安全的租户级主数据，记录 用户角色。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_api_key` | 身份、访问与安全的租户级主数据，记录 API Key。 | `tenant_entity` | `sdkwork-appbase-iam` | yes |
| `iam_security_event` | 身份、访问与安全的事件日志，记录 安全事件。 | `event_log` | `sdkwork-appbase-iam` | yes |
| `iam_audit_event` | 身份、访问与安全的审计日志，记录 审计事件。 | `audit_log` | `sdkwork-appbase-iam` | yes |
| `iam_gateway_api_key` | 中转站对外 API Key 索引，保存密钥哈希、默认分组、策略和限额引用。 | `credential_index` | `api-key-service` | yes |
| `iam_gateway_api_key_channel_group` | 网关 API Key 到业务渠道分组的多绑定关系，用于表达该 Key 可路由到哪些 `ai_channel_group`，不得用于表达上游供应商账号池。 | `relation_entity` | `api-key-service` | yes |
| `iam_gateway_access_policy` | 保存网关 API Key 的访问能力、IP 白名单等访问控制策略。 | `tenant_entity` | `access-policy-service` | yes |
| `iam_gateway_risk_rule` | 身份、访问与安全的租户级主数据，记录 gatewayriskrule。 | `tenant_entity` | `risk-service` | yes |
| `iam_user_preference` | 身份、访问与安全的用户级数据，记录 用户偏好。 | `user_entity` | `user-preference-service` | yes |
| `iam_user_security_setting` | 身份、访问与安全的用户级数据，记录 用户安全设置。 | `user_entity` | `user-security-service` | yes |
| `iam_user_login_event` | 身份、访问与安全的事件日志，记录 用户登录事件。 | `event_log` | `auth-service` | yes |
| `iam_verification_scene_policy` | 身份、访问与安全的验证策略，记录 验证场景策略。 | `verification_policy` | `sdkwork-appbase-iam` | yes |
| `iam_verification_challenge` | 身份、访问与安全的验证挑战，记录 验证挑战。 | `verification_challenge` | `sdkwork-appbase-iam` | yes |
| `iam_verification_attempt` | 身份、访问与安全的验证尝试，记录 验证尝试。 | `verification_attempt` | `sdkwork-appbase-iam` | yes |

## 外部集成与服务商

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `integration_provider_account` | 外部集成与服务商的供应商账号凭证引用，记录 供应商账号。 | `provider_account_secret_ref` | `integration-service` | yes |
| `open_platform_provider` | 外部集成与服务商的字典主数据，记录 供应商。 | `dictionary_entity` | `open-platform-service` | yes |
| `open_platform_manifest` | 外部集成与服务商的字典主数据，记录 清单。 | `dictionary_entity` | `open-platform-service` | yes |
| `open_platform_account` | 外部集成与服务商的凭证引用配置，记录 账户。 | `credential_ref` | `open-platform-service` | yes |
| `open_platform_entry` | 外部集成与服务商的租户级主数据，记录 入口。 | `tenant_entity` | `open-platform-service` | yes |
| `open_platform_pay_binding` | 外部集成与服务商的关系绑定，记录 支付绑定。 | `relation_entity` | `open-platform-service` | yes |
| `integration_proxy` | 外部集成与服务商的凭证引用配置，记录 代理。 | `credential_ref` | `provider-service` | yes |
| `integration_webhook_endpoint` | 外部集成与服务商的Webhook 配置，记录 Webhook 端点。 | `webhook` | `webhook-service` | yes |
| `integration_service_provider` | 外部集成与服务商的服务商主体，记录 服务商。 | `commercial_provider_subject` | `service-provider-service` | yes |
| `integration_service_provider_edge` | 外部集成与服务商的服务商合同边，记录 服务商关系边。 | `commercial_provider_contract_edge` | `service-provider-service` | yes |
| `integration_service_provider_closure` | 外部集成与服务商的服务商层级闭包，记录 服务商层级闭包。 | `commercial_provider_tree_closure` | `service-provider-service` | yes |
| `integration_service_provider_member` | 外部集成与服务商的服务商成员关系，记录 服务商成员。 | `commercial_provider_member` | `service-provider-service` | yes |
| `integration_service_provider_subject_binding` | 外部集成与服务商的服务商主体绑定，记录 服务商主体绑定。 | `commercial_provider_subject_binding` | `service-provider-service` | yes |
| `integration_service_provider_contract` | 外部集成与服务商的服务商合同，记录 服务商合同。 | `commercial_provider_contract` | `service-provider-service` | yes |
| `integration_service_provider_finance_profile` | 外部集成与服务商的服务商财务配置，记录 服务商财务配置。 | `commercial_provider_finance_profile` | `service-provider-service` | yes |
| `integration_service_provider_price_plan` | 外部集成与服务商的服务商价格方案，记录 服务商价格方案。 | `commercial_provider_price_plan` | `pricing-service` | yes |
| `integration_service_provider_price_rule` | 外部集成与服务商的服务商价格规则，记录 服务商价格规则。 | `commercial_provider_price_rule` | `pricing-service` | yes |
| `integration_provider_invoice_import` | 外部集成与服务商的上游账单导入批次，记录 供应商账单导入批次。 | `upstream_provider_invoice_import` | `reconciliation-worker` | yes |
| `integration_provider_invoice_item` | 外部集成与服务商的上游账单明细，记录 供应商账单明细。 | `upstream_provider_invoice_item` | `reconciliation-worker` | yes |

## Java Plus 兼容

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `plus_user_address` | Java Plus 兼容的外部兼容表，登记 用户地址 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_app` | Java Plus 兼容的router owned standard，记录 app。 | `router_owned_standard` | `sdkwork-claw-product` | yes |
| `plus_category` | Java Plus 兼容的java compatible owned，记录 category。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_agent_skill_package` | Java Plus 兼容的java compatible owned，记录 Agent 技能包。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_agent_skill` | Java Plus 兼容的java compatible owned，记录 Agent 技能。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_user_agent_skill` | Java Plus 兼容的java compatible owned，记录 用户 Agent 技能。 | `java_compatible_owned` | `sdkwork-claw-router` | yes |
| `plus_feeds` | Java Plus 兼容的java compatible owned，记录 feeds。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_comments` | Java Plus 兼容的java compatible owned，记录 comments。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_content_vote` | Java Plus 兼容的java compatible owned，记录 内容投票。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_favorite` | Java Plus 兼容的java compatible owned，记录 favorite。 | `java_compatible_owned` | `spring-ai-plus-business-entity` | yes |
| `plus_department` | Java Plus 兼容的外部兼容表，登记 department 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_position` | Java Plus 兼容的外部兼容表，登记 position 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_member_card` | Java Plus 兼容的外部兼容表，登记 会员卡 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_member_level` | Java Plus 兼容的外部兼容表，登记 会员等级 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_card` | Java Plus 兼容的外部兼容表，登记 card 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_card_template` | Java Plus 兼容的外部兼容表，登记 卡模板 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_user_card` | Java Plus 兼容的外部兼容表，登记 用户卡 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_invitation_code` | Java Plus 兼容的外部兼容表，登记 邀请码 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_invitation_relation` | Java Plus 兼容的外部兼容表，登记 邀请关系 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_partner` | Java Plus 兼容的外部兼容表，登记 partner 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_usage_record` | Java Plus 兼容的外部兼容表，登记 usagerecord 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_channel` | Java Plus 兼容的外部兼容表，登记 channel 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_channel_account` | Java Plus 兼容的外部兼容表，登记 channel账户 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |
| `plus_channel_proxy` | Java Plus 兼容的外部兼容表，登记 channel代理 的现有物理结构供当前应用读取或映射。 | `legacy_compatible` | `spring-ai-plus-business-entity` | no |

## 消息触达

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `messaging_provider` | 消息触达的供应商字典，记录 供应商。 | `provider_dictionary` | `sdkwork-appbase-messaging` | yes |
| `messaging_provider_account` | 消息触达的供应商账号，记录 供应商账号。 | `provider_account` | `sdkwork-appbase-messaging` | yes |
| `messaging_provider_capability` | 消息触达的供应商能力，记录 供应商能力。 | `provider_capability` | `sdkwork-appbase-messaging` | yes |
| `messaging_sender_identity` | 消息触达的发送身份，记录 发送身份。 | `sender_identity` | `sdkwork-appbase-messaging` | yes |
| `messaging_template` | 消息触达的消息模板，记录 模板。 | `template` | `sdkwork-appbase-messaging` | yes |
| `messaging_template_version` | 消息触达的模板版本，记录 模板版本。 | `template_version` | `sdkwork-appbase-messaging` | yes |
| `messaging_template_variant` | 消息触达的模板变体，记录 模板变体。 | `template_variant` | `sdkwork-appbase-messaging` | yes |
| `messaging_template_binding` | 消息触达的模板绑定，记录 模板绑定。 | `template_binding` | `sdkwork-appbase-messaging` | yes |
| `messaging_route_rule` | 消息触达的路由规则，记录 routerule。 | `route_rule` | `sdkwork-appbase-messaging` | yes |
| `messaging_route_rule_target` | 消息触达的路由目标，记录 路由目标。 | `route_rule_target` | `sdkwork-appbase-messaging` | yes |
| `messaging_send_request` | 消息触达的发送请求，记录 发送请求。 | `send_request` | `sdkwork-appbase-messaging` | yes |
| `messaging_send_attempt` | 消息触达的发送尝试，记录 发送尝试。 | `send_attempt` | `sdkwork-appbase-messaging` | yes |
| `messaging_delivery_event` | 消息触达的投递事件，记录 投递事件。 | `delivery_event` | `sdkwork-appbase-messaging` | yes |
| `messaging_suppression` | 消息触达的触达抑制，记录 触达抑制。 | `suppression` | `sdkwork-appbase-messaging` | yes |
| `messaging_rate_limit_bucket` | 消息触达的rate limit bucket，记录 限流桶。 | `rate_limit_bucket` | `sdkwork-appbase-messaging` | yes |

## 运维治理

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `ops_referral_stat_snapshot` | 运维治理的投影快照，记录 推荐统计快照。 | `projection` | `marketing-analytics-worker` | yes |
| `ops_gateway_instance` | 运维治理的核心主数据，记录 网关实例。 | `core_entity` | `ops-service` | yes |
| `ops_gateway_heartbeat` | 运维治理的事件日志，记录 网关心跳。 | `event_log` | `ops-agent` | yes |
| `ops_config_snapshot` | 运维治理的快照，记录 配置快照。 | `snapshot` | `control-plane` | yes |
| `ops_audit_log` | 运维治理的审计日志，记录 审计日志。 | `audit_log` | `audit-service` | yes |
| `ops_outbox_event` | 运维治理的事务发件箱事件，记录 发件箱事件。 | `outbox_event` | `all-transactional-services` | yes |
| `ops_inbox_event` | 运维治理的inbox event，记录 收件箱事件。 | `inbox_event` | `all-event-consumers` | yes |
| `ops_job_execution` | 运维治理的事件日志，记录 任务执行。 | `event_log` | `job-runtime` | yes |
| `ops_alert_event` | 运维治理的事件日志，记录 告警事件。 | `event_log` | `alert-service` | yes |
| `ops_notification_message` | 运维治理的通知消息，记录 通知消息。 | `notification` | `notification-service` | yes |
| `ops_notification_recipient` | 运维治理的通知收件人，记录 通知收件人。 | `notification_recipient` | `notification-service` | yes |
| `ops_notification_delivery` | 运维治理的通知投递，记录 通知投递。 | `notification_delivery` | `notification-service` | yes |
| `ops_notification_preference` | 运维治理的通知偏好，记录 通知偏好。 | `notification_preference` | `notification-service` | yes |
| `ops_metric_snapshot` | 运维治理的投影快照，记录 指标快照。 | `projection` | `metrics-worker` | yes |

## 营销促销

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `promotion_offer` | 营销促销的外部兼容表，登记 offer 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_offer_version` | 营销促销的外部兼容表，登记 优惠版本 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_offer_presentation` | 营销促销的外部兼容表，登记 优惠展示配置 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_offer_scope` | 营销促销的外部兼容表，登记 优惠适用范围 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_offer_audience_rule` | 营销促销的外部兼容表，登记 优惠人群规则 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_offer_time_window` | 营销促销的外部兼容表，登记 优惠时间窗口 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_budget_account` | 营销促销的外部兼容表，登记 预算账户 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_budget_ledger_entry` | 营销促销的外部兼容表，登记 预算流水 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_coupon_stock` | 营销促销的外部兼容表，登记 优惠券库存 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_code` | 营销促销的外部兼容表，登记 code 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_code_redemption` | 营销促销的外部兼容表，登记 优惠码核销 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_user_coupon` | 营销促销的外部兼容表，登记 用户优惠券 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_discount_application` | 营销促销的外部兼容表，登记 优惠应用 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_discount_allocation` | 营销促销的外部兼容表，登记 优惠分摊 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_coupon_ledger_entry` | 营销促销的外部兼容表，登记 优惠券流水 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_external_binding` | 营销促销的外部兼容表，登记 外部绑定 的现有物理结构供当前应用读取或映射。 | `appbase_standard` | `sdkwork-appbase-promotion` | no |
| `promotion_external_operation` | 营销促销的外部兼容表，登记 外部操作 的现有物理结构供当前应用读取或映射。 | `external_operation_log` | `sdkwork-appbase-promotion` | no |
| `promotion_event_outbox` | 营销促销的外部兼容表，登记 事件发件箱 的现有物理结构供当前应用读取或映射。 | `event_log` | `sdkwork-appbase-promotion` | no |

## 工作台与应用市场

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `studio_catalog_action` | 工作台与应用市场的事件日志，记录 市场行为。 | `event_log` | `portal-content-service` | yes |
| `studio_catalog_asset` | 工作台与应用市场的租户级主数据，记录 市场资产。 | `tenant_entity` | `portal-content-service` | yes |
| `studio_catalog_artifact` | 工作台与应用市场的租户级主数据，记录 市场制品。 | `tenant_entity` | `portal-content-service` | yes |
| `studio_app_template` | 工作台与应用市场的租户级主数据，记录 应用模板。 | `tenant_entity` | `app-center-service` | yes |
| `studio_app_template_version` | 工作台与应用市场的租户级主数据，记录 应用模板版本。 | `tenant_entity` | `app-center-service` | yes |
| `studio_app_template_usage` | 工作台与应用市场的事件日志，记录 应用模板用量。 | `event_log` | `app-center-service` | yes |

## 系统安装

| 表名 | 说明 | profile | write_owner | generated |
| --- | --- | --- | --- | --- |
| `system_installation_state` | 记录应用数据库安装状态、种子版本和安装锁，用于 installer 幂等执行。 | `installation_state` | `database-installer` | yes |
| `system_schema_migration` | 记录 schema registry 或安装器执行过的数据库迁移批次。 | `installation_migration_log` | `database-installer` | yes |
