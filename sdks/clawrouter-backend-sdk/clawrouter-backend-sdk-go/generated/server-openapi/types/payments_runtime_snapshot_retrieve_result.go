package types

// Payments runtime snapshot retrieve result schema exposed by Claw Router.
type PaymentsRuntimeSnapshotRetrieveResult struct {
	Code string `json:"code"`
	Data CommercePaymentRuntimeSnapshotResponse `json:"data"`
	Msg string `json:"msg"`
}
