package com.sdkwork.clawrouter.app.model;

import java.util.List;
import java.util.Map;

public class RoutingUsageSnapshot {
    private List<Map<String, Object>> chartData;
    private List<Map<String, Object>> modelStats;

    public List<Map<String, Object>> getChartData() {
        return this.chartData;
    }
    
    public void setChartData(List<Map<String, Object>> chartData) {
        this.chartData = chartData;
    }

    public List<Map<String, Object>> getModelStats() {
        return this.modelStats;
    }
    
    public void setModelStats(List<Map<String, Object>> modelStats) {
        this.modelStats = modelStats;
    }
}
