package types

// Commerce wallet command request schema exposed by Claw Router.
type CommerceWalletCommandRequest struct {
	Amount string `json:"amount"`
	AssetType string `json:"assetType"`
	Remarks string `json:"remarks"`
	RequestNo string `json:"requestNo"`
}
