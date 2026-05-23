package types

// Open platform entry create request schema exposed by Claw Router.
type OpenPlatformEntryCreateRequest struct {
	Key string `json:"key"`
	Type string `json:"type"`
	Url string `json:"url"`
}
