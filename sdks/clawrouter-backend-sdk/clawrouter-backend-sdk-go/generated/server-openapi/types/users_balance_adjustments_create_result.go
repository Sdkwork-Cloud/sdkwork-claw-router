package types

// Users balance adjustments create result schema exposed by Claw Router.
type UsersBalanceAdjustmentsCreateResult struct {
	Code string `json:"code"`
	Data AdminUserMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
