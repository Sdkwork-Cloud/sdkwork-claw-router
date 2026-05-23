package types

// Open platform manifest list response schema exposed by Claw Router.
type OpenPlatformManifestListResponse struct {
	Items []OpenPlatformManifestItem `json:"items"`
}
