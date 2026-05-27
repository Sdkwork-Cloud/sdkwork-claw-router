package types

// Iam verification policy retrieve result schema exposed by Claw Router.
type IamVerificationPolicyRetrieveResult struct {
	Code string `json:"code"`
	Data AuthVerificationPolicy `json:"data"`
	Msg string `json:"msg"`
}
