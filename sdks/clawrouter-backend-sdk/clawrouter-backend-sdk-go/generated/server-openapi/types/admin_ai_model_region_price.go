package types

// Regional official reference pricing input for admin AI model commands.
type AdminAiModelRegionPrice struct {
	CacheReadPrice string `json:"cacheReadPrice"`
	CacheWritePrice string `json:"cacheWritePrice"`
	PriceIn string `json:"priceIn"`
	PriceOut string `json:"priceOut"`
	RegionCode string `json:"regionCode"`
}
