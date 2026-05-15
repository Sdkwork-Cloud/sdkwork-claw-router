package types

// Model ranking item schema exposed by Claw Router.
type ModelRankingItem struct {
	BaseVolume int `json:"baseVolume"`
	Color string `json:"color"`
	ContextSize string `json:"contextSize"`
	Cost float64 `json:"cost"`
	CostIndicator int `json:"costIndicator"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	IsNew bool `json:"isNew"`
	Latency int `json:"latency"`
	License string `json:"license"`
	Modality string `json:"modality"`
	Name string `json:"name"`
	PrevRank int `json:"prevRank"`
	Pricing string `json:"pricing"`
	Rank int `json:"rank"`
	Requests int `json:"requests"`
	Strengths []string `json:"strengths"`
	Tokens int `json:"tokens"`
	TrendScore float64 `json:"trendScore"`
	Vendor string `json:"vendor"`
	VendorCode string `json:"vendorCode"`
	WinRate float64 `json:"winRate"`
}
