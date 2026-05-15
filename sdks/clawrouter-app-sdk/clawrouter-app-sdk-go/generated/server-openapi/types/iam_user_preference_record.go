package types

// Iam user preference record schema exposed by Claw Router.
type IamUserPreferenceRecord struct {
	AppearanceConfig map[string]JsonValue `json:"appearance_config"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultConsolePath string `json:"default_console_path"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Language string `json:"language"`
	Metadata map[string]JsonValue `json:"metadata"`
	NotificationPreferences map[string]JsonValue `json:"notification_preferences"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ThemeMode string `json:"theme_mode"`
	Timezone string `json:"timezone"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
