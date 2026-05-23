package types

// Open platform account list response schema exposed by Claw Router.
type OpenPlatformAccountListResponse struct {
	Items []OpenPlatformAccountItem `json:"items"`
}
