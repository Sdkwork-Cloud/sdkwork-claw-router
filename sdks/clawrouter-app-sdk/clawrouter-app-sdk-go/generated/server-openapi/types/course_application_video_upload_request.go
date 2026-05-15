package types

// Course application video upload request schema exposed by Claw Router.
type CourseApplicationVideoUploadRequest struct {
	File string `json:"file"`
	FileName string `json:"fileName"`
}
