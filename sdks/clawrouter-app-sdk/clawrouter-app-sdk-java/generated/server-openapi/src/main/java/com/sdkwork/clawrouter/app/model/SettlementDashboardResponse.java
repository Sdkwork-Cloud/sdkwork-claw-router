package com.sdkwork.clawrouter.app.model;

import java.util.List;

public class SettlementDashboardResponse {
    private List<SettlementBill> bills;
    private List<SettlementChartPoint> chartData;

    public List<SettlementBill> getBills() {
        return this.bills;
    }
    
    public void setBills(List<SettlementBill> bills) {
        this.bills = bills;
    }

    public List<SettlementChartPoint> getChartData() {
        return this.chartData;
    }
    
    public void setChartData(List<SettlementChartPoint> chartData) {
        this.chartData = chartData;
    }
}
