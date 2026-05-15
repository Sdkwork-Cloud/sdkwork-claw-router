package types

// Commerce operation response schema exposed by Claw Router.
type CommerceOperationResponse struct {
	RequestNo string `json:"requestNo"`
	Status string `json:"status"`
	Success bool `json:"success"`
}
