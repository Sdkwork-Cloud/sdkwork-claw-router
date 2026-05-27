package types

// Open platform qr auth scan response schema exposed by Claw Router.
type OpenPlatformQrAuthScanResponse struct {
	AccountId string `json:"accountId"`
	CreatedAt string `json:"createdAt"`
	EntryId string `json:"entryId"`
	ExternalUserId string `json:"externalUserId"`
	Id string `json:"id"`
	IpHash string `json:"ipHash"`
	ScanSource string `json:"scanSource"`
	SessionId string `json:"sessionId"`
	SessionKey string `json:"sessionKey"`
	UserAgent string `json:"userAgent"`
}
