package types

// Commerce category seed initialize request schema exposed by Claw Router.
type CommerceCategorySeedInitializeRequest struct {
	Datasets []string `json:"datasets"`
	Mode string `json:"mode"`
}
