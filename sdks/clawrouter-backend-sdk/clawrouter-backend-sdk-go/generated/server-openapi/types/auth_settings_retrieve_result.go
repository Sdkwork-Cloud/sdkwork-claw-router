package types

// Auth settings retrieve result schema exposed by Claw Router.
type AuthSettingsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminAuthSettingsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
