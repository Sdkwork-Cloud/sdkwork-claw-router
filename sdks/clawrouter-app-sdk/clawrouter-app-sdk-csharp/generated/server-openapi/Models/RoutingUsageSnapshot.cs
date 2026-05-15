using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoutingUsageSnapshot
    {
        public List<Dictionary<string, object>>? ChartData { get; set; }
        public List<Dictionary<string, object>>? ModelStats { get; set; }
    }
}
