package types

// Registrations create result schema exposed by Claw Router.
type RegistrationsCreateResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
