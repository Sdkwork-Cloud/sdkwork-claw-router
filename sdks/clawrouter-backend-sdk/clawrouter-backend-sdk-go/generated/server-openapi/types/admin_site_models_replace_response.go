package types

// Admin site models replace response schema exposed by Claw Router.
type AdminSiteModelsReplaceResponse struct {
	Items []AdminSiteModelItem `json:"items"`
}
