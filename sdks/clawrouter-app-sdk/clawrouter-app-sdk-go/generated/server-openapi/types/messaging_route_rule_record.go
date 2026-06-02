package types

// Messaging route rule record schema exposed by Claw Router.
type MessagingRouteRuleRecord struct {
	AppId string `json:"app_id"`
	Channel string `json:"channel"`
	CountryCode string `json:"country_code"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeliveryPurpose string `json:"delivery_purpose"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	FailoverPolicy map[string]JsonValue `json:"failover_policy"`
	Id string `json:"id"`
	Locale string `json:"locale"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	RuleCode string `json:"rule_code"`
	SceneCode string `json:"scene_code"`
	SelectionPolicy map[string]JsonValue `json:"selection_policy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserSegment string `json:"user_segment"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}
