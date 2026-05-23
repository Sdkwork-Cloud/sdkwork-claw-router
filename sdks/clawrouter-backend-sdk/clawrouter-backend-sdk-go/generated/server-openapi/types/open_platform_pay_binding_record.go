package types

// Open platform pay binding record schema exposed by Claw Router.
type OpenPlatformPayBindingRecord struct {
	AccountId string `json:"account_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Mode string `json:"mode"`
	OrganizationId string `json:"organization_id"`
	PaymentAccountId string `json:"payment_account_id"`
	PaymentChannelId string `json:"payment_channel_id"`
	Scene string `json:"scene"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
