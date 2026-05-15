package types

// Commerce vip purchase request schema exposed by Claw Router.
type CommerceVipPurchaseRequest struct {
	PackId string `json:"packId"`
	Remarks string `json:"remarks"`
	RequestNo string `json:"requestNo"`
}
