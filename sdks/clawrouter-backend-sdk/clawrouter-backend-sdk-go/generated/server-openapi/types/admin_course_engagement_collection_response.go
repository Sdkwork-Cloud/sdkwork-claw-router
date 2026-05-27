package types

// Admin course engagement collection response schema exposed by Claw Router.
type AdminCourseEngagementCollectionResponse struct {
	Items []AdminCourseEngagementItem `json:"items"`
}
