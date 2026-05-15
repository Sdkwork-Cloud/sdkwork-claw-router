package types

// Admin app create request schema exposed by Claw Router.
type AdminAppCreateRequest struct {
	AccessUrl string `json:"accessUrl"`
	AppType string `json:"appType"`
	BundleId string `json:"bundleId"`
	Config AdminAppConfig `json:"config"`
	Description string `json:"description"`
	DownloadUrl string `json:"downloadUrl"`
	Icon map[string]JsonValue `json:"icon"`
	IconUrl string `json:"iconUrl"`
	InstallConfig map[string]JsonValue `json:"installConfig"`
	InstallPlatforms map[string]JsonValue `json:"installPlatforms"`
	InstallSkill map[string]JsonValue `json:"installSkill"`
	MarketStatus string `json:"marketStatus"`
	Name string `json:"name"`
	PackageName string `json:"packageName"`
	Platforms map[string]JsonValue `json:"platforms"`
	ProjectId string `json:"projectId"`
	ReleaseNotes []map[string]JsonValue `json:"releaseNotes"`
	ResourceList map[string]JsonValue `json:"resourceList"`
	Status string `json:"status"`
	StoreUrl string `json:"storeUrl"`
	UserId string `json:"userId"`
	Version string `json:"version"`
}
