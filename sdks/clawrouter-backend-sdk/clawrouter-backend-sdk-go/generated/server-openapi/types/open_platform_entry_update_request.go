package types

// Open platform entry update request schema exposed by Claw Router.
type OpenPlatformEntryUpdateRequest struct {
	Key string `json:"key"`
	Status string `json:"status"`
	Type string `json:"type"`
	Url string `json:"url"`
}
