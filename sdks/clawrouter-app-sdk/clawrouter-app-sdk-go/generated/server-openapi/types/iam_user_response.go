package types

// Iam user response schema exposed by Claw Router.
type IamUserResponse struct {
	AvatarUrl string `json:"avatarUrl"`
	DisplayName string `json:"displayName"`
	Email string `json:"email"`
	Id string `json:"id"`
	IsVerified bool `json:"isVerified"`
	Language string `json:"language"`
	LastLogin string `json:"lastLogin"`
	LastLoginIp string `json:"lastLoginIp"`
	PasswordLastChanged string `json:"passwordLastChanged"`
	Phone string `json:"phone"`
	RegisteredAt string `json:"registeredAt"`
	Status string `json:"status"`
	ThirdPartyBound string `json:"thirdPartyBound"`
	TwoFactorEnabled bool `json:"twoFactorEnabled"`
	Username string `json:"username"`
}
