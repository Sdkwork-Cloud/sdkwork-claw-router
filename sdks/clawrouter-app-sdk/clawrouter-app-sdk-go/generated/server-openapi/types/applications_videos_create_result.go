package types

// Applications videos create result schema exposed by Claw Router.
type ApplicationsVideosCreateResult struct {
	Code string `json:"code"`
	Data CourseApplicationVideoUploadResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
