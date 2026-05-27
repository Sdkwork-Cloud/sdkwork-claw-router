package types

// Admin access group channel bindings response schema exposed by Claw Router.
type AdminAccessGroupChannelBindingsResponse struct {
	Items []AdminAccessGroupChannelBindingItem `json:"items"`
}
