package types

// Iam permission record schema exposed by Claw Router.
type IamPermissionRecord struct {
	Action string `json:"action"`
	Code string `json:"code"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	Name string `json:"name"`
	Resource string `json:"resource"`
}
