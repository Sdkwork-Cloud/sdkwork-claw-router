package types

// Open platform entry list response schema exposed by Claw Router.
type OpenPlatformEntryListResponse struct {
	Items []OpenPlatformEntryItem `json:"items"`
}
