package types

// Ops notification recipient record schema exposed by Claw Router.
type OpsNotificationRecipientRecord struct {
	AppId string `json:"app_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	RecipientRoleCode string `json:"recipient_role_code"`
	RecipientUserId string `json:"recipient_user_id"`
	RecipientValue string `json:"recipient_value"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
