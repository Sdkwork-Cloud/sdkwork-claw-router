package types

// Admin site models replace request schema exposed by Claw Router.
type AdminSiteModelsReplaceRequest struct {
	Items []AdminSiteModelCreateRequest `json:"items"`
}
