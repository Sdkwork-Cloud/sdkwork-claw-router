package types

// Admin site models response schema exposed by Claw Router.
type AdminSiteModelsResponse struct {
	Items []AdminSiteModelItem `json:"items"`
}
