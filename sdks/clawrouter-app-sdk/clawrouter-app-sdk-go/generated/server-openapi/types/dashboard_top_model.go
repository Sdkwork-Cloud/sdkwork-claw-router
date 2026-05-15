package types

// Dashboard top model schema exposed by Claw Router.
type DashboardTopModel struct {
	Cost float64 `json:"cost"`
	IsUp bool `json:"isUp"`
	Modality string `json:"modality"`
	Name string `json:"name"`
	Rank int `json:"rank"`
	Requests int `json:"requests"`
	Supplier string `json:"supplier"`
	Trend string `json:"trend"`
}
