package types

// Course application create request schema exposed by Claw Router.
type CourseApplicationCreateRequest struct {
	Category string `json:"category"`
	ContactEmail string `json:"contactEmail"`
	ContactName string `json:"contactName"`
	Description string `json:"description"`
	ExternalBvid string `json:"externalBvid"`
	Notes string `json:"notes"`
	SourceProvider string `json:"sourceProvider"`
	Title string `json:"title"`
	VideoUrl string `json:"videoUrl"`
}
