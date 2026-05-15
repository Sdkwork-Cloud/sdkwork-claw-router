package types

// Plus content vote record schema exposed by Claw Router.
type PlusContentVoteRecord struct {
	ClientIp string `json:"client_ip"`
	DeviceInfo string `json:"device_info"`
	Source string `json:"source"`
	UserId string `json:"user_id"`
}
