package types

// Admin app list response schema exposed by Claw Router.
type AdminAppListResponse struct {
	Items []AdminAppItemResponse `json:"items"`
}
