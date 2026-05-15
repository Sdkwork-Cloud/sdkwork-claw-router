using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SettlementDashboardResponse
    {
        public List<SettlementBill>? Bills { get; set; }
        public List<SettlementChartPoint>? ChartData { get; set; }
    }
}
