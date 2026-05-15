package types

// Account login log schema exposed by Claw Router.
type AccountLoginLog struct {
	Device string `json:"device"`
	Ip string `json:"ip"`
	Location string `json:"location"`
	Status string `json:"status"`
	Time string `json:"time"`
}
