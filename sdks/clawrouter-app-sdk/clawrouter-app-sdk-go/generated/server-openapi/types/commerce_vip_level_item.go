package types

// Commerce vip level item schema exposed by Claw Router.
type CommerceVipLevelItem struct {
	Code string `json:"code"`
	Id string `json:"id"`
	Name string `json:"name"`
	Rank int `json:"rank"`
	Status string `json:"status"`
}
