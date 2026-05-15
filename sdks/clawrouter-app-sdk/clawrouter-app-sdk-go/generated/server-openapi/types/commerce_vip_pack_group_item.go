package types

// Commerce vip pack group item schema exposed by Claw Router.
type CommerceVipPackGroupItem struct {
	Code string `json:"code"`
	Id string `json:"id"`
	Name string `json:"name"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
}
