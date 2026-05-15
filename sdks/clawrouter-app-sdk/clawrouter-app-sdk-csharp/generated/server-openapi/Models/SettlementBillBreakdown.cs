using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class SettlementBillBreakdown
    {
        public SettlementBillBreakdownItem? Audio { get; set; }
        public SettlementBillBreakdownItem? Image { get; set; }
        public SettlementBillBreakdownItem? Music { get; set; }
        public SettlementBillBreakdownItem? Text { get; set; }
        public SettlementBillBreakdownItem? Video { get; set; }
    }
}
