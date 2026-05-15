package types

// Offline PlusApp snapshot returned by the backend.
type AdminAppItemResponse struct {
	AccessUrl string `json:"accessUrl"`
	AppKey string `json:"appKey"`
	AppType string `json:"appType"`
	BundleId string `json:"bundleId"`
	Config AdminAppConfig `json:"config"`
	CreatedAt string `json:"createdAt"`
	Description string `json:"description"`
	DownloadUrl string `json:"downloadUrl"`
	Icon map[string]JsonValue `json:"icon"`
	IconUrl string `json:"iconUrl"`
	Id string `json:"id"`
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
	UpdatedAt string `json:"updatedAt"`
	UserId string `json:"userId"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
