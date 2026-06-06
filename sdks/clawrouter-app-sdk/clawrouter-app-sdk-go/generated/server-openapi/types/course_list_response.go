package types

// Course list response schema exposed by Claw Router.
type CourseListResponse struct {
	Content []CourseItem `json:"content"`
	Items []CourseItem `json:"items"`
	Page string `json:"page"`
	Size string `json:"size"`
	TotalElements string `json:"totalElements"`
}
