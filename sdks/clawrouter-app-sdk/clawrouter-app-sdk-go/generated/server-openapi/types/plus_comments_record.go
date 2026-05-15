package types

// Plus comments record schema exposed by Claw Router.
type PlusCommentsRecord struct {
	Author map[string]JsonValue `json:"author"`
	DeviceInfo string `json:"device_info"`
	IpAddress string `json:"ip_address"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	UserId string `json:"user_id"`
}
