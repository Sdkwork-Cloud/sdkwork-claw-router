package types

// Open platform manifest item schema exposed by Claw Router.
type OpenPlatformManifestItem struct {
	Id string `json:"id"`
	Key string `json:"key"`
	Provider string `json:"provider"`
	Status string `json:"status"`
	Type string `json:"type"`
	Version string `json:"version"`
}
