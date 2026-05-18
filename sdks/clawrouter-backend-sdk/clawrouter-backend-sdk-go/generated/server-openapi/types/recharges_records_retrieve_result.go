package types

// Recharges records retrieve result schema exposed by Claw Router.
type RechargesRecordsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminRechargeRecordItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
