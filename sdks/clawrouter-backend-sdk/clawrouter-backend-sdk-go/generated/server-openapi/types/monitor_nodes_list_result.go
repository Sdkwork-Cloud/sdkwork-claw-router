package types

// Monitor nodes list result schema exposed by Claw Router.
type MonitorNodesListResult struct {
	Code string `json:"code"`
	Data AdminMonitorNodesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
