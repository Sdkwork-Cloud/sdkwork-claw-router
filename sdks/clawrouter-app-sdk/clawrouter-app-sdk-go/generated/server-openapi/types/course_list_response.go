package types

// Course list response schema exposed by Claw Router.
type CourseListResponse struct {
	Content []CourseItem `json:"content"`
	Items []CourseItem `json:"items"`
	Page int `json:"page"`
	Size int `json:"size"`
	TotalElements int `json:"totalElements"`
}
