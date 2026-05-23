package types

// Manifests list result schema exposed by Claw Router.
type ManifestsListResult struct {
	Code string `json:"code"`
	Data OpenPlatformManifestListResponse `json:"data"`
	Msg string `json:"msg"`
}
