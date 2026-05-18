package types

// Verification policy retrieve result schema exposed by Claw Router.
type VerificationPolicyRetrieveResult struct {
	Code string `json:"code"`
	Data AuthVerificationPolicy `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
