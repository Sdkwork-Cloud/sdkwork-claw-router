package types

// Admin app update request schema exposed by Claw Router.
type AdminAppUpdateRequest struct {
	AccessUrl string `json:"accessUrl"`
	AppType string `json:"appType"`
	Artifact MediaResource `json:"artifact"`
	BundleId string `json:"bundleId"`
	Config AdminAppConfig `json:"config"`
	Description string `json:"description"`
	Icon MediaResource `json:"icon"`
	InstallConfig map[string]JsonValue `json:"installConfig"`
	InstallPlatforms map[string]JsonValue `json:"installPlatforms"`
	InstallSkill map[string]JsonValue `json:"installSkill"`
	Name string `json:"name"`
	PackageName string `json:"packageName"`
	Platforms map[string]JsonValue `json:"platforms"`
	ProjectId string `json:"projectId"`
	ReleaseNotes []map[string]JsonValue `json:"releaseNotes"`
	ResourceList map[string]JsonValue `json:"resourceList"`
	StoreUrl string `json:"storeUrl"`
	UserId string `json:"userId"`
	Version string `json:"version"`
}
