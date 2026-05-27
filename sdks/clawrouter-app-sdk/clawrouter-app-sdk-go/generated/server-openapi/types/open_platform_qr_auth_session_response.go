package types

// Open platform qr auth session response schema exposed by Claw Router.
type OpenPlatformQrAuthSessionResponse struct {
	CompletedAt string `json:"completedAt"`
	CreatedAt string `json:"createdAt"`
	DefaultAccountId string `json:"defaultAccountId"`
	DefaultAccountType string `json:"defaultAccountType"`
	DefaultEntryId string `json:"defaultEntryId"`
	DefaultProvider string `json:"defaultProvider"`
	ExpiresAt string `json:"expiresAt"`
	FallbackUrl string `json:"fallbackUrl"`
	Id string `json:"id"`
	Purpose string `json:"purpose"`
	QrContent map[string]interface{} `json:"qrContent"`
	ScannedAt string `json:"scannedAt"`
	Session IamSessionResponse `json:"session"`
	SessionKey string `json:"sessionKey"`
	Status string `json:"status"`
	Token IamSessionResponse `json:"token"`
	UpdatedAt string `json:"updatedAt"`
	UserInfo IamUserResponse `json:"userInfo"`
}
