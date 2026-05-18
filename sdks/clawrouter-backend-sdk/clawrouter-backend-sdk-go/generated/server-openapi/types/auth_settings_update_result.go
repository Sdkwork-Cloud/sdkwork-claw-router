package types

// Auth settings update result schema exposed by Claw Router.
type AuthSettingsUpdateResult struct {
	Code string `json:"code"`
	Data AdminAuthSettingsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
