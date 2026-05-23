package types

// Admin app category list response schema exposed by Claw Router.
type AdminAppCategoryListResponse struct {
	Items []AdminAppCategoryItem `json:"items"`
}
