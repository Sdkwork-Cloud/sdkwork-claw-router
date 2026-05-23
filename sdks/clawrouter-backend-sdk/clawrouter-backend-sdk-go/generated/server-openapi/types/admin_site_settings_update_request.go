package types

// Admin site settings update request schema exposed by Claw Router.
type AdminSiteSettingsUpdateRequest struct {
	AccentColor string `json:"accentColor"`
	BrandColor string `json:"brandColor"`
	CustomCss string `json:"customCss"`
	Description string `json:"description"`
	DocsUrl string `json:"docsUrl"`
	FaviconUrl string `json:"faviconUrl"`
	FooterCopyright string `json:"footerCopyright"`
	IconUrl string `json:"iconUrl"`
	IcpRecordNumber string `json:"icpRecordNumber"`
	IcpRecordUrl string `json:"icpRecordUrl"`
	LogoUrl string `json:"logoUrl"`
	PoliceRecordNumber string `json:"policeRecordNumber"`
	PoliceRecordUrl string `json:"policeRecordUrl"`
	PrivacyUrl string `json:"privacyUrl"`
	SeoDescription string `json:"seoDescription"`
	SeoTitle string `json:"seoTitle"`
	ShortName string `json:"shortName"`
	SiteName string `json:"siteName"`
	SupportUrl string `json:"supportUrl"`
	TermsUrl string `json:"termsUrl"`
}
