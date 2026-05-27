package types

// Admin course relations replace request schema exposed by Claw Router.
type AdminCourseRelationsReplaceRequest struct {
	Items []map[string]interface{} `json:"items"`
}
