package types

// Course application create response schema exposed by Claw Router.
type CourseApplicationCreateResponse struct {
	ApplicationId int `json:"applicationId"`
	Category string `json:"category"`
	ContactEmail string `json:"contactEmail"`
	ContactName string `json:"contactName"`
	Description string `json:"description"`
	ExternalBvid string `json:"externalBvid"`
	Id string `json:"id"`
	SourceProvider string `json:"sourceProvider"`
	Status string `json:"status"`
	SubmittedAt string `json:"submittedAt"`
	Title string `json:"title"`
	VideoUrl string `json:"videoUrl"`
}
