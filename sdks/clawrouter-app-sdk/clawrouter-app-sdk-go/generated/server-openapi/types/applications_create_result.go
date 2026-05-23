package types

// Applications create result schema exposed by Claw Router.
type ApplicationsCreateResult struct {
	Code string `json:"code"`
	Data CourseApplicationCreateResponse `json:"data"`
	Msg string `json:"msg"`
}
