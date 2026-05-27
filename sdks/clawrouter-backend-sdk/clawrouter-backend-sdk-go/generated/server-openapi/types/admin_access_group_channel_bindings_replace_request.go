package types

// Admin access group channel bindings replace request schema exposed by Claw Router.
type AdminAccessGroupChannelBindingsReplaceRequest struct {
	Items []AdminAccessGroupChannelBindingInput `json:"items"`
}
