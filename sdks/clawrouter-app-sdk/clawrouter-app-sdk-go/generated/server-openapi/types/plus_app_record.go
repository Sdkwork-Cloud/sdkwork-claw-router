package types

// Plus app record schema exposed by Claw Router.
type PlusAppRecord struct {
	AccessUrl string `json:"access_url"`
	AppType string `json:"app_type"`
	Artifact MediaResource `json:"artifact"`
	BundleId string `json:"bundle_id"`
	Config map[string]JsonValue `json:"config"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	Description string `json:"description"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	InstallConfig map[string]JsonValue `json:"install_config"`
	InstallPlatforms map[string]JsonValue `json:"install_platforms"`
	InstallSkill map[string]JsonValue `json:"install_skill"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PackageName string `json:"package_name"`
	Platforms map[string]JsonValue `json:"platforms"`
	ProjectId string `json:"project_id"`
	ReleaseNotes map[string]JsonValue `json:"release_notes"`
	ResourceList map[string]JsonValue `json:"resource_list"`
	Status int `json:"status"`
	StoreUrl string `json:"store_url"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
	Version string `json:"version"`
}
