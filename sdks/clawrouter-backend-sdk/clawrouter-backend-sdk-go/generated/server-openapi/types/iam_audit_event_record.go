package types

// Iam audit event record schema exposed by Claw Router.
type IamAuditEventRecord struct {
	Action string `json:"action"`
	ActorUserId string `json:"actor_user_id"`
	AppId string `json:"app_id"`
	CreatedAt string `json:"created_at"`
	DetailJson map[string]JsonValue `json:"detail_json"`
	Environment string `json:"environment"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	RequestId string `json:"request_id"`
	ResourceId string `json:"resource_id"`
	ResourceType string `json:"resource_type"`
	ShardingKey string `json:"sharding_key"`
	TenantId string `json:"tenant_id"`
}
