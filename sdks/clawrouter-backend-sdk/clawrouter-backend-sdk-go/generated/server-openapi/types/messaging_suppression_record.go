package types

// Messaging suppression record schema exposed by Claw Router.
type MessagingSuppressionRecord struct {
	Channel string `json:"channel"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EndsAt string `json:"ends_at"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Note string `json:"note"`
	OrganizationId string `json:"organization_id"`
	ReasonCode string `json:"reason_code"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	Source string `json:"source"`
	StartsAt string `json:"starts_at"`
	Status string `json:"status"`
	TargetHash string `json:"target_hash"`
	TargetMasked string `json:"target_masked"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
