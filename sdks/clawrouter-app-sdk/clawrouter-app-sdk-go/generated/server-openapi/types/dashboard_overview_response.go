package types

// Dashboard overview response schema exposed by Claw Router.
type DashboardOverviewResponse struct {
	Announcements []DashboardAnnouncement `json:"announcements"`
	ChartData []DashboardChartPoint `json:"chartData"`
	MultimodalSparkline []DashboardSparklinePoint `json:"multimodalSparkline"`
	PerformanceSparkline []DashboardSparklinePoint `json:"performanceSparkline"`
	RequestSparkline []DashboardSparklinePoint `json:"requestSparkline"`
	Summary DashboardOverviewSummary `json:"summary"`
	TopModels []DashboardTopModel `json:"topModels"`
	Warnings []string `json:"warnings"`
}
