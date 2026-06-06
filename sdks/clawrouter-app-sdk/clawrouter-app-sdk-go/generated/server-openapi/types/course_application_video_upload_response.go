package types

// Course application video upload response schema exposed by Claw Router.
type CourseApplicationVideoUploadResponse struct {
	ContentType string `json:"contentType"`
	FileName string `json:"fileName"`
	Sha256 string `json:"sha256"`
	SizeBytes string `json:"sizeBytes"`
	UploadedAt string `json:"uploadedAt"`
	Video MediaResource `json:"video"`
}
