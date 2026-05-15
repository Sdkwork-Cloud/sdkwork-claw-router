package types

// Plus app record schema exposed by Claw Router.
type PlusAppRecord struct {
	AccessUrl string `json:"access_url"`
	AppType string `json:"app_type"`
	BundleId string `json:"bundle_id"`
	Description string `json:"description"`
	DownloadUrl string `json:"download_url"`
	Icon map[string]JsonValue `json:"icon"`
	IconUrl string `json:"icon_url"`
	InstallConfig map[string]JsonValue `json:"install_config"`
	InstallPlatforms map[string]JsonValue `json:"install_platforms"`
	InstallSkill map[string]JsonValue `json:"install_skill"`
	PackageName string `json:"package_name"`
	Platforms map[string]JsonValue `json:"platforms"`
	ProjectId string `json:"project_id"`
	ReleaseNotes map[string]JsonValue `json:"release_notes"`
	ResourceList map[string]JsonValue `json:"resource_list"`
	StoreUrl string `json:"store_url"`
	UserId string `json:"user_id"`
	Version string `json:"version"`
}
