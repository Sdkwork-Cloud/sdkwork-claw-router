package types

// Open platform qr auth scan create request schema exposed by Claw Router.
type OpenPlatformQrAuthScanCreateRequest struct {
	AccountId string `json:"accountId"`
	EntryId string `json:"entryId"`
	ExternalUserId string `json:"externalUserId"`
	IpHash string `json:"ipHash"`
	ScanSource string `json:"scanSource"`
	UserAgent string `json:"userAgent"`
}
